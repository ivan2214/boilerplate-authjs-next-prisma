#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas de origen y destino
const sourcePath = path.join(
  __dirname,
  "..",
  "template",
  "authjs-prisma-shadcn-protecteed"
);
const targetPath = path.join(
  __dirname,
  "template",
  "authjs-prisma-shadcn-protecteed"
);

const exclude = [
  ".git",
  "node_modules",
  ".next",
  "pnpm-lock.yaml",
  ".env",
  ".env.local",
  ".DS_Store",
  "Dockerfile",
  "docker-compose.yml",
];

async function copyTemplate() {
  console.log(chalk.blue("Copiando template al paquete..."));

  try {
    // Verificar si existe el directorio de origen
    if (!fs.existsSync(sourcePath)) {
      console.error(
        chalk.red(
          `Error: No se encontró el directorio de origen en ${sourcePath}`
        )
      );
      process.exit(1);
    }

    // Crear directorio de destino si no existe
    fs.ensureDirSync(path.join(__dirname, "template"));

    // Renombrar temporalmente el archivo .gitignore a gitignore
    const gitignorePath = path.join(sourcePath, ".gitignore");
    const tempGitignorePath = path.join(sourcePath, "gitignore");
    if (fs.existsSync(gitignorePath)) {
      fs.renameSync(gitignorePath, tempGitignorePath);
    }

    // Copiar archivos
    await fs.copy(sourcePath, targetPath, {
      filter: (src) => {
        return !exclude.some((pattern) => src.includes(pattern));
      },
      dereference: true,
      preserveTimestamps: true,
      recursive: true,
    });

    // Renombrar el archivo gitignore de vuelta a .gitignore
    const copiedGitignorePath = path.join(targetPath, "gitignore");
    const finalGitignorePath = path.join(targetPath, ".gitignore");

    if (fs.existsSync(copiedGitignorePath)) {
      try {
        fs.renameSync(copiedGitignorePath, finalGitignorePath);
        console.log(
          chalk.green(
            "✅ Archivo gitignore renombrado a .gitignore correctamente"
          )
        );
      } catch (error) {
        console.error(
          chalk.red(
            `❌ Error al renombrar gitignore a .gitignore: ${error.message}`
          )
        );
      }
    } else {
      console.warn(
        chalk.yellow(
          "⚠️ No se encontró el archivo gitignore en el destino para renombrarlo a .gitignore"
        )
      );
    }

    console.log(chalk.green("✅ Template copiado correctamente"));
  } catch (error) {
    console.error(chalk.red(`Error al copiar el template: ${error.message}`));
    process.exit(1);
  }
}

copyTemplate().catch((error) => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
