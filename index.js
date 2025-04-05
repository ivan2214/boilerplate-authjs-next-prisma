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
    // Copiar archivos del template al directorio destino
    await fs.copy(templatePath, targetPath);
    spinner.succeed("Archivos copiados correctamente");

    // Actualizar .env
    spinner.start("Configurando archivo .env...");
    let envContent = await fs.readFile(path.join(templatePath, ".env"), "utf8");

    // Reemplazar variables en .env
    envContent = envContent
      .replace(/POSTGRES_USER=.*/, `POSTGRES_USER=${envVars.POSTGRES_USER}`)
      .replace(
        /POSTGRES_PASSWORD=.*/,
        `POSTGRES_PASSWORD=${envVars.POSTGRES_PASSWORD}`
      )
      .replace(/POSTGRES_DB=.*/, `POSTGRES_DB=${envVars.POSTGRES_DB}`)
      .replace(/ADMIN_EMAIL=.*/, `ADMIN_EMAIL="${envVars.ADMIN_EMAIL}"`);

    await fs.writeFile(path.join(targetPath, ".env"), envContent);
    spinner.succeed("Archivo .env configurado correctamente");

    // Actualizar .env.local
    spinner.start("Configurando archivo .env.local...");
    let envLocalContent = await fs.readFile(
      path.join(templatePath, ".env.local"),
      "utf8"
    );

    // Reemplazar variables en .env.local
    envLocalContent = envLocalContent
      .replace(
        /NEXTAUTH_SECRET=.*/,
        `NEXTAUTH_SECRET="${envLocalVars.NEXTAUTH_SECRET}"`
      )
      .replace(
        /AUTH_GITHUB_ID=.*/,
        `AUTH_GITHUB_ID="${envLocalVars.AUTH_GITHUB_ID}"`
      )
      .replace(
        /AUTH_GITHUB_SECRET=.*/,
        `AUTH_GITHUB_SECRET="${envLocalVars.AUTH_GITHUB_SECRET}"`
      )
      .replace(
        /AUTH_GOOGLE_ID=.*/,
        `AUTH_GOOGLE_ID="${envLocalVars.AUTH_GOOGLE_ID}"`
      )
      .replace(
        /AUTH_GOOGLE_SECRET=.*/,
        `AUTH_GOOGLE_SECRET="${envLocalVars.AUTH_GOOGLE_SECRET}"`
      )
      .replace(
        /NEXTAUTH_URL=.*/,
        `NEXTAUTH_URL="${envLocalVars.NEXTAUTH_URL}"`
      );

    await fs.writeFile(path.join(targetPath, ".env.local"), envLocalContent);
    spinner.succeed("Archivo .env.local configurado correctamente");

    // Actualizar docker-compose.yml
    spinner.start("Configurando archivo docker-compose.yml...");
    let dockerComposeContent = await fs.readFile(
      path.join(templatePath, "docker-compose.yml"),
      "utf8"
    );

    // Reemplazar nombre del volumen en docker-compose.yml
    dockerComposeContent = dockerComposeContent
      .replace(
        /- boilerplate-db:\/var\/lib\/postgresql\/data/,
        `- ${dockerConfig.volumeName}:/var/lib/postgresql/data`
      )
      .replace(
        /boilerplate-db:\s+driver: "local"/,
        `${dockerConfig.volumeName}:\n    driver: "local"`
      );

    await fs.writeFile(
      path.join(targetPath, "docker-compose.yml"),
      dockerComposeContent
    );
    spinner.succeed("Archivo docker-compose.yml configurado correctamente");

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
