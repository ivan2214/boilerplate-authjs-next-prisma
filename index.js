#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta de la plantilla
const templatePath = path.join(
  __dirname,
  "template",
  "authjs-prisma-shadcn-protecteed"
);

async function main() {
  console.log(
    chalk.bold.blue(
      "\n🚀 Creando un nuevo proyecto con boilerplate-authjs-next-prisma\n"
    )
  );

  // Obtener el nombre del proyecto
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Nombre del proyecto:",
      default: "my-authjs-app",
    },
  ]);

  // Ruta de destino
  const targetPath = path.join(process.cwd(), projectName);

  // Verificar si el directorio ya existe
  if (fs.existsSync(targetPath)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `El directorio ${projectName} ya existe. ¿Deseas sobrescribirlo?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow("\n⚠️ Operación cancelada."));
      process.exit(1);
    }

    fs.removeSync(targetPath);
  }

  // Solicitar variables de entorno para .env
  console.log(
    chalk.cyan("\n📝 Configuración de variables de entorno (.env):\n")
  );
  const envVars = await inquirer.prompt([
    {
      type: "input",
      name: "POSTGRES_USER",
      message: "Usuario de PostgreSQL:",
      default: "postgres",
    },
    {
      type: "input",
      name: "POSTGRES_PASSWORD",
      message: "Contraseña de PostgreSQL:",
      default: "postgres",
    },
    {
      type: "input",
      name: "POSTGRES_DB",
      message: "Nombre de la base de datos:",
      default: "my-app-db",
    },
    {
      type: "input",
      name: "ADMIN_EMAIL",
      message: "Email del administrador:",
      default: "admin@example.com",
    },
  ]);

  // Solicitar variables de entorno para .env.local
  console.log(
    chalk.cyan("\n📝 Configuración de variables de entorno (.env.local):\n")
  );
  const envLocalVars = await inquirer.prompt([
    {
      type: "input",
      name: "NEXTAUTH_SECRET",
      message: "NEXTAUTH_SECRET (clave secreta para Auth.js):",
      default: "tu-clave-secreta-aqui",
    },
    {
      type: "input",
      name: "AUTH_GITHUB_ID",
      message: "ID de cliente de GitHub (opcional):",
      default: "",
    },
    {
      type: "input",
      name: "AUTH_GITHUB_SECRET",
      message: "Secreto de cliente de GitHub (opcional):",
      default: "",
    },
    {
      type: "input",
      name: "AUTH_GOOGLE_ID",
      message: "ID de cliente de Google (opcional):",
      default: "",
    },
    {
      type: "input",
      name: "AUTH_GOOGLE_SECRET",
      message: "Secreto de cliente de Google (opcional):",
      default: "",
    },
    {
      type: "input",
      name: "NEXTAUTH_URL",
      message: "URL de la aplicación:",
      default: "http://localhost:3000",
    },
  ]);

  // Solicitar nombre del volumen de Docker
  console.log(chalk.cyan("\n🐳 Configuración de Docker:\n"));
  const dockerConfig = await inquirer.prompt([
    {
      type: "input",
      name: "volumeName",
      message: "Nombre del volumen de Docker:",
      default: `${projectName}-db`,
    },
  ]);

  // Crear spinner para mostrar progreso
  const spinner = ora("Copiando archivos del template...").start();

  try {
    // Crear el directorio del proyecto
    await fs.ensureDir(targetPath);

    // Copiar archivos del template al directorio destino si existe la carpeta template
    if (fs.existsSync(templatePath)) {
      await fs.copy(templatePath, targetPath);
      spinner.succeed("Archivos de la plantilla copiados correctamente");
    } else {
      // Si no existe la carpeta template, crear la estructura básica del proyecto
      await fs.ensureDir(path.join(targetPath, "src"));
      await fs.ensureDir(path.join(targetPath, "public"));
      spinner.succeed("Estructura básica del proyecto creada correctamente");
    }

    // Crear y configurar archivo .env
    spinner.start("Creando y configurando archivo .env...");

    // Crear contenido del archivo .env
    const envContent = `POSTGRES_USER=${envVars.POSTGRES_USER}
POSTGRES_PASSWORD=${envVars.POSTGRES_PASSWORD}
POSTGRES_DB=${envVars.POSTGRES_DB}
ADMIN_EMAIL="${envVars.ADMIN_EMAIL}"
DATABASE_URL="postgresql://${envVars.POSTGRES_USER}:${envVars.POSTGRES_PASSWORD}@localhost:5432/${envVars.POSTGRES_DB}?schema=public"
`;

    // Escribir el archivo .env
    await fs.writeFile(path.join(targetPath, ".env"), envContent);
    spinner.succeed("Archivo .env creado y configurado correctamente");

    // Crear y configurar archivo .env.local
    spinner.start("Creando y configurando archivo .env.local...");

    // Crear contenido del archivo .env.local
    const envLocalContent = `NEXTAUTH_SECRET="${envLocalVars.NEXTAUTH_SECRET}"
AUTH_GITHUB_ID="${envLocalVars.AUTH_GITHUB_ID}"
AUTH_GITHUB_SECRET="${envLocalVars.AUTH_GITHUB_SECRET}"
AUTH_GOOGLE_ID="${envLocalVars.AUTH_GOOGLE_ID}"
AUTH_GOOGLE_SECRET="${envLocalVars.AUTH_GOOGLE_SECRET}"
NEXTAUTH_URL="${envLocalVars.NEXTAUTH_URL}"
`;

    await fs.writeFile(path.join(targetPath, ".env.local"), envLocalContent);
    spinner.succeed("Archivo .env.local creado y configurado correctamente");

    // Crear y configurar archivo docker-compose.yml
    spinner.start("Creando y configurando archivo docker-compose.yml...");

    // Crear contenido del archivo docker-compose.yml
    const dockerComposeContent = `version: '3.8'

services:
  postgres:
    image: postgres:14
    container_name: ${projectName}-postgres
    restart: always
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
      - POSTGRES_DB=\${POSTGRES_DB}
    volumes:
      - ${dockerConfig.volumeName}:/var/lib/postgresql/data

volumes:
  ${dockerConfig.volumeName}:
    driver: "local"
`;

    await fs.writeFile(
      path.join(targetPath, "docker-compose.yml"),
      dockerComposeContent
    );
    spinner.succeed(
      "Archivo docker-compose.yml creado y configurado correctamente"
    );

    console.log(chalk.green("\n✅ Proyecto creado exitosamente!"));
    console.log(chalk.cyan("\nPara comenzar:"));
    console.log(chalk.white(`  cd ${projectName}`));
    console.log(chalk.white("  pnpm install"));
    console.log(chalk.white("  docker-compose up -d"));
    console.log(chalk.white("  pnpm prisma migrate dev --name init"));
    console.log(chalk.white("  pnpm dev"));
    console.log(
      chalk.cyan("\nVisita http://localhost:3000 para ver tu aplicación\n")
    );
  } catch (error) {
    spinner.fail("Error al crear el proyecto");
    console.error(chalk.red(`\n❌ Error: ${error.message}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(chalk.red(`\n❌ Error: ${error.message}`));
  process.exit(1);
});
