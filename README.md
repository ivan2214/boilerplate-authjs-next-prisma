# create-boilerplate-authjs-next-prisma

Un boilerplate configurable para crear aplicaciones Next.js con Auth.js, Prisma y Shadcn UI. Este paquete te permite inicializar un proyecto con una configuración personalizada a través de un asistente interactivo en la consola.

## Características

- Next.js 15 con App Router
- Autenticación con Auth.js (NextAuth)
- Base de datos PostgreSQL con Prisma
- Componentes UI con Shadcn UI
- Docker para la base de datos
- Configuración personalizada a través de la consola

## Uso

Para crear un nuevo proyecto, ejecuta:

```bash
pnpm create boilerplate-authjs-next-prisma
```

El asistente te guiará a través de la configuración, solicitándote:

1. Nombre del proyecto
2. Variables de entorno para `.env`:
   - Usuario de PostgreSQL
   - Contraseña de PostgreSQL
   - Nombre de la base de datos
   - Email del administrador
3. Variables de entorno para `.env.local`:
   - NEXTAUTH_SECRET
   - Credenciales de GitHub (opcionales)
   - Credenciales de Google (opcionales)
   - URL de la aplicación
4. Nombre del volumen de Docker

## Desarrollo local

Si quieres probar este paquete localmente antes de publicarlo:

1. Clona este repositorio
2. Instala las dependencias:
   ```bash
   pnpm install
   ```
3. Crea un enlace simbólico global:
   ```bash
   pnpm link --global
   ```
4. Ahora puedes usar el paquete localmente:
   ```bash
   pnpm create boilerplate-authjs-next-prisma
   ```

## Publicación

Para publicar este paquete en npm:

1. Asegúrate de tener una cuenta en npm y estar autenticado:
   ```bash
   npm login
   ```
2. Actualiza la versión en `package.json` si es necesario
3. Publica el paquete:
   ```bash
   npm publish
   ```

## Estructura del proyecto generado

El proyecto generado incluye:

- Autenticación con Auth.js (GitHub y Google)
- Rutas protegidas y públicas
- Panel de administración
- Perfil de usuario
- Base de datos PostgreSQL con Prisma
- Componentes UI con Shadcn UI
- Docker para la base de datos

## Licencia

MIT
