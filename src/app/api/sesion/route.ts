import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { iniciarSesionEnApi, type RespuestaLogin } from "@/lib/api";
import { DURACION_SESION_EN_SEGUNDOS, NOMBRE_COOKIE_SESION } from "@/lib/constantes";
import { CODIGOS_ERROR } from "@/lib/errores";

type Credenciales = { correo: string; contrasena: string };

function respuestaConCodigo(estado: number, codigo: string, campo: string | null = null) {
  return NextResponse.json({ codigo, campo }, { status: estado });
}

async function leerCredenciales(solicitud: Request): Promise<Credenciales | null> {
  try {
    const cuerpo = await solicitud.json();
    const { correo, contrasena } = cuerpo;
    return typeof correo === "string" && typeof contrasena === "string" ? { correo, contrasena } : null;
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

export async function POST(solicitud: Request) {
  const credenciales = await leerCredenciales(solicitud);
  if (!credenciales) return respuestaConCodigo(400, CODIGOS_ERROR.solicitudInvalida);

  let respuestaApi: Response;
  try {
    respuestaApi = await iniciarSesionEnApi(credenciales.correo, credenciales.contrasena);
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

export async function DELETE() {
  const almacen = await cookies();
  almacen.delete(NOMBRE_COOKIE_SESION);
  return new NextResponse(null, { status: 204 });
}
