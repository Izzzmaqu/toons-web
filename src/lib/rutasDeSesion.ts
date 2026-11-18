import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { RespuestaLogin } from "./api";
import { DURACION_SESION_EN_SEGUNDOS, NOMBRE_COOKIE_SESION } from "./constantes";
import { CODIGOS_ERROR } from "./errores";

export function respuestaConCodigo(estado: number, codigo: string, campo: string | null = null) {
  return NextResponse.json({ codigo, campo }, { status: estado });
}

export function respuestaDeSolicitudInvalida() {
  return respuestaConCodigo(400, CODIGOS_ERROR.solicitudInvalida);
}

export async function leerCampos<Campo extends string>(
  solicitud: Request,
  campos: readonly Campo[],
): Promise<Record<Campo, string> | null> {
  try {
    const cuerpo = await solicitud.json();
    if (!campos.every((campo) => typeof cuerpo[campo] === "string")) return null;
    return Object.fromEntries(campos.map((campo) => [campo, cuerpo[campo]])) as Record<Campo, string>;
  } catch {
    return null;
  }
}

async function reenviarErrorDeApi(respuestaApi: Response) {
  try {
    const { codigo, campo } = await respuestaApi.json();
    return respuestaConCodigo(respuestaApi.status, codigo, campo ?? null);
  } catch {
    return respuestaConCodigo(500, CODIGOS_ERROR.errorInterno);
  }
}

export async function abrirSesionConLaApi(llamarApi: () => Promise<Response>) {
  let respuestaApi: Response;
  try {
    respuestaApi = await llamarApi();
  } catch {
    return respuestaConCodigo(500, CODIGOS_ERROR.errorInterno);
  }
  if (!respuestaApi.ok) return reenviarErrorDeApi(respuestaApi);

  const { token, nombre, rol }: RespuestaLogin = await respuestaApi.json();
  const almacen = await cookies();
  almacen.set(NOMBRE_COOKIE_SESION, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACION_SESION_EN_SEGUNDOS,
  });
  return NextResponse.json({ nombre, rol });
}
