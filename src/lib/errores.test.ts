import { describe, expect, it } from "vitest";
import { CODIGOS_ERROR, MENSAJE_GENERICO, mensajeDeError } from "./errores";

const CODIGOS_AUTH_DEL_BACKEND = [
  "auth.correo_obligatorio",
  "auth.correo_invalido",
  "auth.contrasena_obligatoria",
  "auth.contrasena_corta",
  "auth.credenciales_invalidas",
  "auth.cuenta_bloqueada",
];

describe("mensajeDeError", () => {
  it("define los mismos códigos de auth que el backend", () => {
    const codigosAuth = Object.values(CODIGOS_ERROR).filter((codigo) => codigo.startsWith("auth."));

    expect(codigosAuth).toEqual(CODIGOS_AUTH_DEL_BACKEND);
  });

  it.each(CODIGOS_AUTH_DEL_BACKEND)("el código %s tiene su propio mensaje", (codigo) => {
    expect(mensajeDeError(codigo)).not.toBe(MENSAJE_GENERICO);
  });

  it.each([CODIGOS_ERROR.solicitudInvalida, CODIGOS_ERROR.errorInterno])(
    "el código común %s tiene su propio mensaje",
    (codigo) => {
      expect(mensajeDeError(codigo)).not.toBe(MENSAJE_GENERICO);
    },
  );

  it("las credenciales inválidas no revelan si el correo existe", () => {
    expect(mensajeDeError(CODIGOS_ERROR.credencialesInvalidas)).toBe("Correo o contraseña incorrectos.");
  });

  it("un código desconocido cae al mensaje genérico", () => {
    expect(mensajeDeError("modulo.codigo_que_no_existe")).toBe(MENSAJE_GENERICO);
  });

  it.each([undefined, null, ""])("el valor %p cae al mensaje genérico", (codigo) => {
    expect(mensajeDeError(codigo)).toBe(MENSAJE_GENERICO);
  });
});
