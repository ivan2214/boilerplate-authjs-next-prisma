# Instrucciones para Preparar y Publicar el Paquete

Sigue estos pasos para preparar y publicar el paquete `create-boilerplate-authjs-next-prisma`.

## 1. Preparar el Paquete

### 1.1. Copiar el Template

Primero, necesitas copiar tu proyecto existente a la carpeta `template` del paquete. Puedes usar el script `copy-template.js` que hemos creado:

```bash
node copy-template.js
```

Este script copiará todos los archivos de tu proyecto desde `../template/authjs-prisma-shadcn-protecteed` a `./template/authjs-prisma-shadcn-protecteed`.

### 1.2. Instalar Dependencias

Instala las dependencias necesarias para el paquete:

```bash
pnpm install
```

## 2. Probar Localmente

Antes de publicar, es recomendable probar el paquete localmente:

```bash
# Crear un enlace simbólico global
pnpm link --global

# Crear un directorio de prueba
mkdir test-project
cd test-project

# Usar el paquete localmente
pnpm create boilerplate-authjs-next-prisma
```

## 3. Publicar en npm

Cuando estés listo para publicar:

```bash
# Iniciar sesión en npm (si aún no lo has hecho)
npm login

# Publicar el paquete
npm publish
```

Si el nombre ya está en uso, puedes usar un ámbito (scope) con tu nombre de usuario:

```bash
# Modificar el nombre en package.json a:
# "name": "@tu-usuario/create-boilerplate-authjs-next-prisma",

# Publicar con ámbito
npm publish --access=public
```

## 4. Actualizar el Paquete

Para futuras actualizaciones:

1. Realiza los cambios necesarios
2. Incrementa la versión en `package.json`
3. Ejecuta `npm publish` nuevamente

## 5. Ejemplo de Uso

Una vez publicado, los usuarios pueden usar tu paquete con:

```bash
pnpm create boilerplate-authjs-next-prisma
```

O si lo publicaste con un ámbito:

```bash
pnpm create @tu-usuario/boilerplate-authjs-next-prisma
```

## Notas Importantes

- Asegúrate de que el script `index.js` tenga permisos de ejecución (`chmod +x index.js` en sistemas Unix)
- Verifica que todas las rutas en los scripts sean correctas para tu entorno
- Considera añadir más validaciones y mensajes de error para mejorar la experiencia del usuario
