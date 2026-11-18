import { registrarEnApi } from "@/lib/api";
import { abrirSesionConLaApi, leerCampos, respuestaDeSolicitudInvalida } from "@/lib/rutasDeSesion";

export async function POST(solicitud: Request) {
  const datos = await leerCampos(solicitud, ["nombre", "correo", "contrasena"]);
  if (!datos) return respuestaDeSolicitudInvalida();

  return abrirSesionConLaApi(() => registrarEnApi(datos.nombre, datos.correo, datos.contrasena));
}
