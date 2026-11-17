import { describe, expect, it } from "vitest";
import { CODIGOS_ERROR } from "./errores";
import { validarLogin } from "./validacion";

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
