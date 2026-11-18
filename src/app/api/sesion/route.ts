import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { iniciarSesionEnApi } from "@/lib/api";
import { NOMBRE_COOKIE_SESION } from "@/lib/constantes";
import { abrirSesionConLaApi, leerCampos, respuestaDeSolicitudInvalida } from "@/lib/rutasDeSesion";

export async function POST(solicitud: Request) {
  const datos = await leerCampos(solicitud, ["correo", "contrasena"]);
  if (!datos) return respuestaDeSolicitudInvalida();

  return abrirSesionConLaApi(() => iniciarSesionEnApi(datos.correo, datos.contrasena));
}

export async function DELETE() {
  const almacen = await cookies();
  almacen.delete(NOMBRE_COOKIE_SESION);
  return new NextResponse(null, { status: 204 });
}
