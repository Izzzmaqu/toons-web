# Toons - web (frontend)

Sitio web de la plataforma de lectura de cómics "Toons", hecho con Next.js 16 (App Router) y Tailwind, solo en español.
La API vive en otro repositorio: `toons-backend`. Este sitio necesita que la API esté corriendo para iniciar sesión.

## Requisitos

| Herramienta | Versión | Cómo comprobarla |
|---|---|---|
| Node.js | 22.22.2 o superior (24.15 o superior si usas la serie 24) | `node --version` |
| npm | el que trae Node | `npm --version` |
| Git | cualquiera reciente | `git --version` |
| La API `toons-backend` | corriendo en http://localhost:5080 | ver su README |

Descarga Node.js desde https://nodejs.org (versión LTS). Con una versión más antigua, `npm ci` muestra avisos y las pruebas pueden fallar.

## Paso a paso desde cero (PowerShell)

1. Consigue el código y entra a la carpeta:

   ```powershell
   git clone <URL-del-repositorio-toons-web>
   cd toons-web
   ```

2. Instala las dependencias exactas de `package-lock.json`:

   ```powershell
   npm ci
   ```

3. Crea tu archivo de variables de entorno (dice dónde está la API):

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Levanta primero la API (ver el README de `toons-backend`) y después este sitio:

   ```powershell
   npm run dev
   ```

5. Abre http://localhost:3000 en el navegador. Sin sesión te lleva a la pantalla de login.

Otros comandos:

```powershell
npm test          # pruebas
npm run lint      # revisión de estilo
npm run build     # compilación de producción
```

## Usuarios de ejemplo (ficticios, solo desarrollo)

| Correo | Contraseña | Rol |
|---|---|---|
| admin@ejemplo.com | admin-ejemplo-123 | administrador |
| usuario@ejemplo.com | usuario-ejemplo-123 | lector |
| lucia@ejemplo.com, mateo@ejemplo.com, sofia@ejemplo.com | lector-ejemplo-123 | lector |

Tras 5 contraseñas incorrectas seguidas la cuenta se bloquea 5 minutos.

## Si algo falla

- **"Falta la variable de entorno API_URL":** no existe `.env.local`; repite el paso 3 y reinicia `npm run dev`.
- **El login muestra "Ocurrió un problema en el servidor":** la API no está corriendo o no está en http://localhost:5080.
- **El puerto 3000 está ocupado:** `npm run dev -- --port 3001` (y cambia `OrigenFrontend` en `appsettings.json` del backend, porque solo permite http://localhost:3000).

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

La cookie dura 1 hora (`DURACION_SESION_EN_SEGUNDOS` en `src/lib/constantes.ts`), igual que el token del backend (`Jwt:MinutosVigencia`, 60). Si cambias uno, cambia el otro.

## Portadas

Las 10 portadas de `public/portadas/` son SVG de relleno (un color y la inicial del título) servidos como archivos locales. La API devuelve en cada obra el nombre del archivo (`portada-03.svg`) y el frontend lo busca en esa carpeta.

Para usar imágenes propias: copia tus archivos a `public/portadas/` con **el mismo nombre** que el que tiene la obra en la base (por ejemplo `portada-03.svg`; si tu imagen es `.jpg`, cambia también la columna `portada` en la base o en `CatalogoDeEjemplo.cs` del backend). Proporción recomendada: 3:4 (por ejemplo 300 x 400 px).

## Buscador

El buscador del encabezado es un formulario HTML normal (`GET /?titulo=...`): la página de inicio lee el parámetro `titulo` y le pide a la API las obras que coinciden, sin distinguir mayúsculas.
