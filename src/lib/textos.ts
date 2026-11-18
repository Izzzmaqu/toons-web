import { NOMBRE_PLATAFORMA } from "./constantes";

export const TEXTOS = {
  comun: {
    etiquetaCorreo: "Correo electrónico",
    etiquetaContrasena: "Contraseña",
    placeholderCorreo: "tucorreo@ejemplo.com",
    mostrarContrasena: "Mostrar contraseña",
    ocultarContrasena: "Ocultar contraseña",
  },
  login: {
    titulo: "Inicia sesión",
    subtitulo: `Entra a ${NOMBRE_PLATAFORMA} para seguir leyendo`,
    botonIngresar: "Ingresar",
    botonIngresando: "Ingresando…",
    preguntaSinCuenta: "¿Aún no tienes cuenta?",
    enlaceRegistro: "Regístrate",
  },
  registro: {
    titulo: "Crea tu cuenta",
    subtitulo: `Únete a ${NOMBRE_PLATAFORMA} y empieza a leer`,
    etiquetaNombre: "Nombre",
    placeholderNombre: "Tu nombre",
    botonCrear: "Crear cuenta",
    botonCreando: "Creando cuenta…",
    preguntaConCuenta: "¿Ya tienes cuenta?",
    enlaceLogin: "Inicia sesión",
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
