import { CODIGOS_ERROR } from "./errores";

export type ErroresLogin = { correo?: string; contrasena?: string };

const LARGO_MINIMO_CONTRASENA = 8;

function tieneFormatoDeCorreo(correo: string): boolean {
  const partes = correo.split("@");
  return partes.length === 2 && partes[0] !== "" && partes[1] !== "";
}

function validarCorreo(correo: string): string | undefined {
  const texto = correo.trim();
  if (texto === "") return CODIGOS_ERROR.correoObligatorio;
  if (!tieneFormatoDeCorreo(texto)) return CODIGOS_ERROR.correoInvalido;
  return undefined;
}

function validarContrasena(contrasena: string): string | undefined {
  if (contrasena.trim() === "") return CODIGOS_ERROR.contrasenaObligatoria;
  if (contrasena.length < LARGO_MINIMO_CONTRASENA) return CODIGOS_ERROR.contrasenaCorta;
  return undefined;
}

export function validarLogin(correo: string, contrasena: string): ErroresLogin {
  const errores: ErroresLogin = {};
  const errorCorreo = validarCorreo(correo);
  const errorContrasena = validarContrasena(contrasena);
  if (errorCorreo) errores.correo = errorCorreo;
  if (errorContrasena) errores.contrasena = errorContrasena;
  return errores;
}
