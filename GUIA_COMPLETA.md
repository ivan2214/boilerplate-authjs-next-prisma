# Guía Completa: Boilerplate Configurable con Next.js, Auth.js y Prisma

Esta guía te mostrará paso a paso cómo crear, configurar, publicar y utilizar el paquete `create-boilerplate-authjs-next-prisma`.

## 1. Crear el Sistema

Si quieres crear este sistema desde cero, sigue estos pasos:

### 1.1. Estructura de Archivos

Crea la siguiente estructura de archivos:

```
boilerplate-authjs-next-prisma/
├── index.js           # Script principal
├── package.json       # Configuración del paquete
├── README.md          # Documentación
└── template/          # Carpeta con el código del boilerplate
    └── authjs-prisma-shadcn-protecteed/ # Tu proyecto existente
```

### 1.2. Configuración del package.json

El archivo `package.json` debe tener la siguiente configuración:

```json
{
  "name": "create-boilerplate-authjs-next-prisma",
  "version": "1.0.0",
  "description": "Boilerplate configurable para Next.js con Auth.js y Prisma",
  "type": "module",
  "bin": {
    "create-boilerplate-authjs-next-prisma": "index.js"
  },
  "files": ["index.js", "template"],
  "keywords": ["next.js", "auth.js", "prisma", "boilerplate", "template"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "chalk": "^5.3.0",
    "fs-extra": "^11.2.0",
    "inquirer": "^9.2.15",
    "ora": "^8.0.1"
  }
}
```

### 1.3. Implementación del Script Principal

El archivo `index.js` debe contener la lógica para solicitar la configuración al usuario y reemplazar los valores en los archivos correspondientes. Puedes usar el script que ya hemos creado.

### 1.4. Copiar el Template

Copia tu proyecto existente a la carpeta `template/authjs-prisma-shadcn-protecteed/`.

## 2. Empaquetar y Probar Localmente

Antes de publicar el paquete, es recomendable probarlo localmente:

### 2.1. Instalar Dependencias

```bash
cd boilerplate-authjs-next-prisma
pnpm install
```

### 2.2. Crear Enlace Simbólico

```bash
pnpm link --global
```

Esto creará un enlace simbólico global que te permitirá usar el paquete como si estuviera instalado desde npm.

### 2.3. Probar el Paquete

Ahora puedes probar el paquete localmente:

```bash
mkdir test-project
cd test-project
pnpm create boilerplate-authjs-next-prisma
```

Sigue las instrucciones del asistente para configurar tu proyecto.

## 3. Publicar el Paquete

Una vez que hayas probado el paquete y estés satisfecho con su funcionamiento, puedes publicarlo en npm:

### 3.1. Crear Cuenta en npm

Si aún no tienes una cuenta en npm, crea una en [npmjs.com](https://www.npmjs.com/).

### 3.2. Iniciar Sesión en npm

```bash
npm login
```

Ingresa tus credenciales cuando se te solicite.

### 3.3. Publicar el Paquete

```bash
npm publish
```

Si el nombre del paquete ya está en uso, puedes cambiarlo en el archivo `package.json` o usar un ámbito (scope) con tu nombre de usuario:

```json
{
  "name": "@tu-usuario/create-boilerplate-authjs-next-prisma",
  ...
}
```

Y luego publicarlo con:

```bash
npm publish --access=public
```

## 4. Uso del Paquete Publicado

Una vez publicado, cualquier persona puede usar tu paquete con:

```bash
pnpm create boilerplate-authjs-next-prisma
```

O si lo publicaste con un ámbito:

```bash
pnpm create @tu-usuario/boilerplate-authjs-next-prisma
```

## 5. Ejemplo Real de Uso

A continuación, se muestra un ejemplo real de cómo un usuario utilizaría tu paquete desde cero:

### 5.1. Crear un Nuevo Proyecto

```bash
# Crear un directorio para el proyecto (opcional)
mkdir mi-proyecto
cd mi-proyecto

# Inicializar el proyecto con el boilerplate
pnpm create boilerplate-authjs-next-prisma
```

### 5.2. Configuración Interactiva

El usuario verá un asistente interactivo que le pedirá:

1. **Nombre del proyecto**: Por ejemplo, "mi-app-auth"
2. **Variables de entorno para .env**:
   - Usuario de PostgreSQL: "postgres"
   - Contraseña de PostgreSQL: "micontraseña"
   - Nombre de la base de datos: "mi-app-db"
   - Email del administrador: "admin@midominio.com"
3. **Variables de entorno para .env.local**:
   - NEXTAUTH_SECRET: (se puede generar con `openssl rand -base64 32`)
   - ID de cliente de GitHub (opcional)
   - Secreto de cliente de GitHub (opcional)
   - ID de cliente de Google (opcional)
   - Secreto de cliente de Google (opcional)
   - URL de la aplicación: "http://localhost:3000"
4. **Nombre del volumen de Docker**: "mi-app-db"

### 5.3. Iniciar el Proyecto

Una vez completada la configuración, el usuario verá instrucciones para iniciar el proyecto:

```bash
cd mi-app-auth
pnpm install
docker-compose up -d
pnpm prisma migrate dev --name init
pnpm dev
```

### 5.4. Acceder a la Aplicación

El usuario podrá acceder a la aplicación en http://localhost:3000 y verá:

- Una página de inicio pública
- Opciones de inicio de sesión con GitHub y Google
- Rutas protegidas para usuarios autenticados
- Panel de administración para el usuario administrador
- Perfil de usuario configurable

## 6. Mantenimiento y Actualizaciones

Para mantener y actualizar el paquete:

1. Realiza cambios en el código
2. Incrementa la versión en `package.json` siguiendo el versionado semántico (MAJOR.MINOR.PATCH)
3. Publica la nueva versión con `npm publish`

## 7. Solución de Problemas Comunes

### 7.1. Error al Iniciar la Base de Datos

Si el usuario tiene problemas al iniciar la base de datos con Docker:

```bash
# Verificar el estado de los contenedores
docker-compose ps

# Ver los logs del contenedor de PostgreSQL
docker-compose logs postgres

# Reiniciar el contenedor
docker-compose restart postgres
```

### 7.2. Error en las Migraciones de Prisma

Si hay problemas con las migraciones de Prisma:

```bash
# Resetear la base de datos (¡cuidado, esto eliminará todos los datos!)
pnpm prisma migrate reset

# Crear una nueva migración
pnpm prisma migrate dev --name fix_schema
```

### 7.3. Problemas con la Autenticación

Si hay problemas con la autenticación, verificar:

1. Que las variables de entorno en `.env.local` estén correctamente configuradas
2. Que las credenciales de GitHub y Google sean válidas
3. Que la URL de la aplicación coincida con la configurada en los proveedores de autenticación

## Conclusión

Con esta guía, has aprendido a crear, configurar, publicar y utilizar un boilerplate configurable para Next.js con Auth.js y Prisma. Este sistema te permitirá inicializar proyectos rápidamente con una configuración personalizada, ahorrando tiempo y esfuerzo en la configuración inicial.
