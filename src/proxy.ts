import { NextResponse, type NextRequest } from "next/server";
import { NOMBRE_COOKIE_SESION } from "@/lib/constantes";

const RUTA_REGISTRO = "/registro";

function redirigirA(ruta: string, solicitud: NextRequest) {
  return NextResponse.redirect(new URL(ruta, solicitud.url));
}

export function proxy(solicitud: NextRequest) {
  const haySesion = solicitud.cookies.has(NOMBRE_COOKIE_SESION);
  const esRegistro = solicitud.nextUrl.pathname === RUTA_REGISTRO;

  if (esRegistro) return haySesion ? redirigirA("/", solicitud) : NextResponse.next();
  return haySesion ? NextResponse.next() : redirigirA("/login", solicitud);
}

export const config = {
  matcher: ["/", "/registro"],
};
