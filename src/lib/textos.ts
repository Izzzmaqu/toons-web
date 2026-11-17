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
    etiquetaBuscador: "Buscar obras",
    placeholderBuscador: "Buscar por título",
    botonBuscar: "Buscar",
  },
  inicio: {
    destacada: "Lo más reciente",
    recientes: "Recientes",
    tendencias: "Tendencias",
    resultadosPara: "Resultados para",
    sinResultados: "No encontramos obras con ese título.",
    porCreador: "por",
    textoAlternativoPortada: "Portada de",
  },
} as const;
