import { NextResponse, type NextRequest } from "next/server";
import { NOMBRE_COOKIE_SESION } from "@/lib/constantes";

export function proxy(solicitud: NextRequest) {
  if (solicitud.cookies.has(NOMBRE_COOKIE_SESION)) return NextResponse.next();
  return NextResponse.redirect(new URL("/login", solicitud.url));
}

export const config = {
  matcher: ["/"],
};
