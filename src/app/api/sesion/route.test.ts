import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NOMBRE_COOKIE_SESION } from "@/lib/constantes";
import { CODIGOS_ERROR } from "@/lib/errores";
import { DELETE, POST } from "./route";

const fijarCookie = vi.fn();
const borrarCookie = vi.fn();

vi.mock("next/headers", () => ({
  cookies: async () => ({ set: fijarCookie, delete: borrarCookie }),
}));

function solicitudDeLogin(cuerpo: unknown) {
  return new Request("http://localhost/api/sesion", { method: "POST", body: JSON.stringify(cuerpo) });
}

function respuestaDeApi(estado: number, cuerpo: unknown) {
  return new Response(JSON.stringify(cuerpo), { status: estado });
}

describe("ruta /api/sesion", () => {
  const peticion = vi.fn();

  beforeEach(() => {
    vi.stubEnv("API_URL", "http://api.local");
    vi.stubGlobal("fetch", peticion);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("con credenciales correctas guarda el token en una cookie httpOnly y no lo devuelve en el cuerpo", async () => {
    peticion.mockResolvedValue(respuestaDeApi(200, { token: "token-de-prueba", nombre: "Ana", rol: "lector" }));

    const respuesta = await POST(solicitudDeLogin({ correo: "ana@ejemplo.com", contrasena: "clave-de-ejemplo" }));

    expect(respuesta.status).toBe(200);
    expect(await respuesta.json()).toEqual({ nombre: "Ana", rol: "lector" });
    expect(fijarCookie).toHaveBeenCalledWith(
      NOMBRE_COOKIE_SESION,
      "token-de-prueba",
      expect.objectContaining({ httpOnly: true, sameSite: "lax", path: "/" }),
    );
  });

  it.each([
    [401, CODIGOS_ERROR.credencialesInvalidas],
    [423, CODIGOS_ERROR.cuentaBloqueada],
    [400, CODIGOS_ERROR.correoInvalido],
  ])("reenvía el error %i del backend con su código y sin crear cookie", async (estado, codigo) => {
    peticion.mockResolvedValue(respuestaDeApi(estado, { codigo, campo: null }));

    const respuesta = await POST(solicitudDeLogin({ correo: "ana@ejemplo.com", contrasena: "clave-de-ejemplo" }));

    expect(respuesta.status).toBe(estado);
    expect(await respuesta.json()).toEqual({ codigo, campo: null });
    expect(fijarCookie).not.toHaveBeenCalled();
  });

  it("si el backend no responde devuelve error interno", async () => {
    peticion.mockRejectedValue(new TypeError("sin conexión"));

    const respuesta = await POST(solicitudDeLogin({ correo: "ana@ejemplo.com", contrasena: "clave-de-ejemplo" }));

    expect(respuesta.status).toBe(500);
    expect((await respuesta.json()).codigo).toBe(CODIGOS_ERROR.errorInterno);
  });

  it("con un cuerpo mal formado devuelve solicitud inválida sin llamar al backend", async () => {
    const respuesta = await POST(solicitudDeLogin({ correo: 5 }));

    expect(respuesta.status).toBe(400);
    expect((await respuesta.json()).codigo).toBe(CODIGOS_ERROR.solicitudInvalida);
    expect(peticion).not.toHaveBeenCalled();
  });

  it("DELETE borra la cookie de sesión", async () => {
    const respuesta = await DELETE();

    expect(respuesta.status).toBe(204);
    expect(borrarCookie).toHaveBeenCalledWith(NOMBRE_COOKIE_SESION);
  });
});
