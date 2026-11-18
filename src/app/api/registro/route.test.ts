import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NOMBRE_COOKIE_SESION } from "@/lib/constantes";
import { CODIGOS_ERROR } from "@/lib/errores";
import { POST } from "./route";

const fijarCookie = vi.fn();

vi.mock("next/headers", () => ({
  cookies: async () => ({ set: fijarCookie }),
}));

const DATOS = { nombre: "Ana Pérez", correo: "ana@ejemplo.com", contrasena: "clave-de-ejemplo" };

function solicitudDeRegistro(cuerpo: unknown) {
  return new Request("http://localhost/api/registro", { method: "POST", body: JSON.stringify(cuerpo) });
}

function respuestaDeApi(estado: number, cuerpo: unknown) {
  return new Response(JSON.stringify(cuerpo), { status: estado });
}

describe("ruta /api/registro", () => {
  const peticion = vi.fn();

  beforeEach(() => {
    vi.stubEnv("API_URL", "http://api.local");
    vi.stubGlobal("fetch", peticion);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("con un registro correcto guarda el token en una cookie httpOnly y no lo devuelve en el cuerpo", async () => {
    peticion.mockResolvedValue(respuestaDeApi(200, { token: "token-de-prueba", nombre: "Ana Pérez", rol: "lector" }));

    const respuesta = await POST(solicitudDeRegistro(DATOS));

    expect(respuesta.status).toBe(200);
    expect(await respuesta.json()).toEqual({ nombre: "Ana Pérez", rol: "lector" });
    expect(fijarCookie).toHaveBeenCalledWith(
      NOMBRE_COOKIE_SESION,
      "token-de-prueba",
      expect.objectContaining({ httpOnly: true, sameSite: "lax", path: "/" }),
    );
  });

  it("envía el registro al endpoint de registro de la API", async () => {
    peticion.mockResolvedValue(respuestaDeApi(200, { token: "t", nombre: "Ana Pérez", rol: "lector" }));

    await POST(solicitudDeRegistro(DATOS));

    const [direccion, opciones] = peticion.mock.calls[0];
    expect(direccion).toBe("http://api.local/api/autenticacion/registro");
    expect(JSON.parse(opciones.body)).toEqual(DATOS);
  });

  it.each([
    [409, CODIGOS_ERROR.correoEnUso, "correo"],
    [400, CODIGOS_ERROR.nombreObligatorio, "nombre"],
  ])("reenvía el error %i del backend con su código y sin crear cookie", async (estado, codigo, campo) => {
    peticion.mockResolvedValue(respuestaDeApi(estado, { codigo, campo }));

    const respuesta = await POST(solicitudDeRegistro(DATOS));

    expect(respuesta.status).toBe(estado);
    expect(await respuesta.json()).toEqual({ codigo, campo });
    expect(fijarCookie).not.toHaveBeenCalled();
  });

  it("si el backend no responde devuelve error interno", async () => {
    peticion.mockRejectedValue(new TypeError("sin conexión"));

    const respuesta = await POST(solicitudDeRegistro(DATOS));

    expect(respuesta.status).toBe(500);
    expect((await respuesta.json()).codigo).toBe(CODIGOS_ERROR.errorInterno);
  });

  it("con un cuerpo mal formado devuelve solicitud inválida sin llamar al backend", async () => {
    const respuesta = await POST(solicitudDeRegistro({ nombre: 5 }));

    expect(respuesta.status).toBe(400);
    expect((await respuesta.json()).codigo).toBe(CODIGOS_ERROR.solicitudInvalida);
    expect(peticion).not.toHaveBeenCalled();
  });
});
