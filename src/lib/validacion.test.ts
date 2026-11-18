import { describe, expect, it } from "vitest";
import { CODIGOS_ERROR } from "./errores";
import { validarLogin, validarRegistro } from "./validacion";

const CORREO_VALIDO = "persona@ejemplo.com";
const CONTRASENA_VALIDA = "clave-de-ejemplo";

describe("validarLogin", () => {
  it("no devuelve errores con datos válidos", () => {
    expect(validarLogin(CORREO_VALIDO, CONTRASENA_VALIDA)).toEqual({});
  });

  it.each(["", "   "])("el correo %p es obligatorio", (correo) => {
    expect(validarLogin(correo, CONTRASENA_VALIDA).correo).toBe(CODIGOS_ERROR.correoObligatorio);
  });

  it.each(["sin-arroba", "@ejemplo.com", "persona@", "a@@b.com"])("el correo %p es inválido", (correo) => {
    expect(validarLogin(correo, CONTRASENA_VALIDA).correo).toBe(CODIGOS_ERROR.correoInvalido);
  });

  it.each(["", "        "])("la contraseña %p es obligatoria", (contrasena) => {
    expect(validarLogin(CORREO_VALIDO, contrasena).contrasena).toBe(CODIGOS_ERROR.contrasenaObligatoria);
  });

  it("una contraseña de 7 caracteres es corta", () => {
    expect(validarLogin(CORREO_VALIDO, "1234567").contrasena).toBe(CODIGOS_ERROR.contrasenaCorta);
  });

  it("una contraseña de 8 caracteres es válida", () => {
    expect(validarLogin(CORREO_VALIDO, "12345678").contrasena).toBeUndefined();
  });

  it("devuelve el error de cada campo por separado", () => {
    expect(validarLogin("", "")).toEqual({
      correo: CODIGOS_ERROR.correoObligatorio,
      contrasena: CODIGOS_ERROR.contrasenaObligatoria,
    });
  });
});

describe("validarRegistro", () => {
  const NOMBRE_VALIDO = "Ana Pérez";

  it("no devuelve errores con datos válidos", () => {
    expect(validarRegistro(NOMBRE_VALIDO, CORREO_VALIDO, CONTRASENA_VALIDA)).toEqual({});
  });

  it.each(["", "   "])("el nombre %p es obligatorio", (nombre) => {
    expect(validarRegistro(nombre, CORREO_VALIDO, CONTRASENA_VALIDA).nombre).toBe(CODIGOS_ERROR.nombreObligatorio);
  });

  it("un nombre de 60 caracteres es válido y uno de 61 es largo", () => {
    expect(validarRegistro("a".repeat(60), CORREO_VALIDO, CONTRASENA_VALIDA).nombre).toBeUndefined();
    expect(validarRegistro("a".repeat(61), CORREO_VALIDO, CONTRASENA_VALIDA).nombre).toBe(CODIGOS_ERROR.nombreLargo);
  });

  it.each(["", "   "])("el correo %p es obligatorio", (correo) => {
    expect(validarRegistro(NOMBRE_VALIDO, correo, CONTRASENA_VALIDA).correo).toBe(CODIGOS_ERROR.correoObligatorio);
  });

  it.each(["sin-arroba", "@ejemplo.com", "ana@", "a@@b.com"])("el correo %p es inválido", (correo) => {
    expect(validarRegistro(NOMBRE_VALIDO, correo, CONTRASENA_VALIDA).correo).toBe(CODIGOS_ERROR.correoInvalido);
  });

  it("la contraseña vacía es obligatoria, la de 7 caracteres es corta y la de 8 es válida", () => {
    expect(validarRegistro(NOMBRE_VALIDO, CORREO_VALIDO, "").contrasena).toBe(CODIGOS_ERROR.contrasenaObligatoria);
    expect(validarRegistro(NOMBRE_VALIDO, CORREO_VALIDO, "1234567").contrasena).toBe(CODIGOS_ERROR.contrasenaCorta);
    expect(validarRegistro(NOMBRE_VALIDO, CORREO_VALIDO, "12345678").contrasena).toBeUndefined();
  });

  it("devuelve el error de cada campo por separado", () => {
    expect(validarRegistro("", "", "")).toEqual({
      nombre: CODIGOS_ERROR.nombreObligatorio,
      correo: CODIGOS_ERROR.correoObligatorio,
      contrasena: CODIGOS_ERROR.contrasenaObligatoria,
    });
  });
});
