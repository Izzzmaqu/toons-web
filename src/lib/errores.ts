export const CODIGOS_ERROR = {
  correoObligatorio: "auth.correo_obligatorio",
  correoInvalido: "auth.correo_invalido",
  contrasenaObligatoria: "auth.contrasena_obligatoria",
  contrasenaCorta: "auth.contrasena_corta",
  credencialesInvalidas: "auth.credenciales_invalidas",
  cuentaBloqueada: "auth.cuenta_bloqueada",
  solicitudInvalida: "comun.solicitud_invalida",
  errorInterno: "comun.error_interno",
} as const;

export const MENSAJE_GENERICO = "Ocurrió un error inesperado. Inténtalo de nuevo.";

const MENSAJES: Record<string, string> = {
  [CODIGOS_ERROR.correoObligatorio]: "Escribe tu correo electrónico.",
  [CODIGOS_ERROR.correoInvalido]: "El correo no tiene un formato válido.",
  [CODIGOS_ERROR.contrasenaObligatoria]: "Escribe tu contraseña.",
  [CODIGOS_ERROR.contrasenaCorta]: "La contraseña debe tener al menos 8 caracteres.",
  [CODIGOS_ERROR.credencialesInvalidas]: "Correo o contraseña incorrectos.",
  [CODIGOS_ERROR.cuentaBloqueada]:
    "Cuenta bloqueada temporalmente por demasiados intentos. Inténtalo de nuevo en unos minutos.",
  [CODIGOS_ERROR.solicitudInvalida]: "La solicitud no es válida. Revisa los datos e inténtalo de nuevo.",
  [CODIGOS_ERROR.errorInterno]: "Ocurrió un problema en el servidor. Inténtalo más tarde.",
};

export function mensajeDeError(codigo: string | null | undefined): string {
  return MENSAJES[codigo ?? ""] ?? MENSAJE_GENERICO;
}
