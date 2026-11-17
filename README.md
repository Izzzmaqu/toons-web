# Toons — web (frontend)

Frontend en Next.js 16 (App Router) con Tailwind, solo en español, para la plataforma de lectura de cómics "Toons".
La API vive en otro repositorio: `toons-backend`.

## Requisitos

- Node.js 20 o superior y **pnpm** (`corepack enable` lo activa si no lo tienes).
- La API de `toons-backend` corriendo en http://localhost:5080 (ver su README).

## Paso a paso

1. Instala las dependencias:

   ```
   pnpm install
   ```

2. Copia el archivo de variables de entorno (la dirección de la API):

   ```
   copy .env.example .env.local
   ```

3. Arranca el sitio en http://localhost:3000:

   ```
   pnpm dev
   ```

4. Pruebas, revisión de estilo y compilación:

   ```
   pnpm test
   pnpm lint
   pnpm build
   ```

Usuarios de ejemplo: ver el README de `toons-backend`.

## Estructura

```
src/app/login         Pantalla de login
src/app/page.tsx      Inicio (protegido): portada destacada, filas Recientes y Tendencias y buscador por título
src/app/api/sesion    Route handler: guarda/borra la cookie httpOnly con el token
src/proxy.ts          Protege el inicio: sin cookie redirige a /login (antes se llamaba middleware)
src/components        Componentes de interfaz (Encabezado, TarjetaObra, FilaObras, PortadaDestacada...)
public/portadas       Portadas de relleno (portada-01.svg a portada-10.svg)
src/lib               Constantes, textos, errores, validación y cliente de la API
src/app/tema.css      Único archivo de tema de Tailwind (paleta de colores)
```

- El nombre de la plataforma está en una sola línea: `src/lib/constantes.ts`.
- Todos los textos en español están en `src/lib/textos.ts`; los mensajes de error, en `src/lib/errores.ts`.

## Cómo funcionan los errores

El backend responde solo **códigos** (por ejemplo `auth.credenciales_invalidas`). `src/lib/errores.ts` convierte cada código en un mensaje en español con `mensajeDeError(codigo)`; un código desconocido muestra un mensaje genérico. `src/lib/validacion.ts` valida en el navegador con los mismos códigos que el servidor.

## Sesión

El token JWT viaja solo en una cookie `httpOnly` que pone el route handler `src/app/api/sesion/route.ts`; el código del navegador nunca lo ve. `src/proxy.ts` redirige a `/login` si no hay cookie y la página de inicio valida el token con la API en cada visita.

## Portadas

Las 10 portadas de `public/portadas/` son SVG de relleno (un color y la inicial del título) servidos como archivos locales. La API devuelve en cada obra el nombre del archivo (`portada-03.svg`) y el frontend lo busca en esa carpeta.

Para usar imágenes propias: copia tus archivos a `public/portadas/` con **el mismo nombre** que el que tiene la obra en la base (por ejemplo `portada-03.svg`; si tu imagen es `.jpg`, cambia también la columna `portada` en la base o en `CatalogoDeEjemplo.cs` del backend). Proporción recomendada: 3:4 (por ejemplo 300 x 400 px).

## Buscador

El buscador del encabezado es un formulario HTML normal (`GET /?titulo=...`): la página de inicio lee el parámetro `titulo` y le pide a la API las obras que coinciden, sin distinguir mayúsculas.

La cookie dura 1 hora (`DURACION_SESION_EN_SEGUNDOS` en `src/lib/constantes.ts`), igual que el token del backend (`Jwt:MinutosVigencia`, 60). Si cambias uno, cambia el otro.
