import { NOMBRE_PLATAFORMA } from "./constantes";

export const TEXTOS = {
  login: {
    titulo: "Inicia sesión",
    subtitulo: `Entra a ${NOMBRE_PLATAFORMA} para seguir leyendo`,
    etiquetaCorreo: "Correo electrónico",
    etiquetaContrasena: "Contraseña",
    placeholderCorreo: "tucorreo@ejemplo.com",
    botonIngresar: "Ingresar",
    botonIngresando: "Ingresando…",
    mostrarContrasena: "Mostrar contraseña",
    ocultarContrasena: "Ocultar contraseña",
  },
  encabezado: {
    menuUsuario: "Menú de usuario",
    cerrarSesion: "Cerrar sesión",
  },
  inicio: {
    bienvenida: "Bienvenido a",
    descripcion: "Tu próxima lectura está a punto de empezar.",
  },
} as const;
