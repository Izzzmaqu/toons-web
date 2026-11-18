import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { NOMBRE_COOKIE_SESION } from "@/lib/constantes";
import { config, proxy } from "./proxy";

function solicitud(ruta: string, conSesion: boolean) {
  const headers = conSesion ? { cookie: `${NOMBRE_COOKIE_SESION}=token-de-prueba` } : undefined;
  return new NextRequest(`http://localhost:3000${ruta}`, { headers });
}

function destinoDeLaRedireccion(respuesta: Response) {
  return respuesta.headers.get("location");
}

function dejaPasar(respuesta: Response) {
  return respuesta.headers.get("x-middleware-next") === "1";
}

describe("proxy", () => {
  it("el inicio sin sesión redirige al login", () => {
    const respuesta = proxy(solicitud("/", false));

    expect(destinoDeLaRedireccion(respuesta)).toBe("http://localhost:3000/login");
  });

  it("el inicio con sesión continúa", () => {
    expect(dejaPasar(proxy(solicitud("/", true)))).toBe(true);
  });

  it("el registro sin sesión continúa", () => {
    expect(dejaPasar(proxy(solicitud("/registro", false)))).toBe(true);
  });

  it("el registro con sesión redirige al inicio", () => {
    const respuesta = proxy(solicitud("/registro", true));

    expect(destinoDeLaRedireccion(respuesta)).toBe("http://localhost:3000/");
  });

  it("se ejecuta en el inicio y en el registro", () => {
    expect(config.matcher).toEqual(expect.arrayContaining(["/", "/registro"]));
  });
});
