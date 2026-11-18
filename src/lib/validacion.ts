import { CODIGOS_ERROR } from "./errores";

export type ErroresLogin = { correo?: string; contrasena?: string };

export type ErroresRegistro = ErroresLogin & { nombre?: string };

const LARGO_MINIMO_CONTRASENA = 8;
const LARGO_MAXIMO_NOMBRE = 60;

function tieneFormatoDeCorreo(correo: string): boolean {
  const partes = correo.split("@");
  return partes.length === 2 && partes[0] !== "" && partes[1] !== "";
}

function validarNombre(nombre: string): string | undefined {
  if (nombre.trim() === "") return CODIGOS_ERROR.nombreObligatorio;
  if (nombre.length > LARGO_MAXIMO_NOMBRE) return CODIGOS_ERROR.nombreLargo;
  return undefined;
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

function soloConError<T extends object>(errores: T): Partial<T> {
  return Object.fromEntries(Object.entries(errores).filter(([, codigo]) => codigo !== undefined)) as Partial<T>;
}

export function validarLogin(correo: string, contrasena: string): ErroresLogin {
  return soloConError({ correo: validarCorreo(correo), contrasena: validarContrasena(contrasena) });
}

export function validarRegistro(nombre: string, correo: string, contrasena: string): ErroresRegistro {
  return soloConError({
    nombre: validarNombre(nombre),
    correo: validarCorreo(correo),
    contrasena: validarContrasena(contrasena),
  });
}
