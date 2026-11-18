import { MENSAJE_GENERICO, mensajeDeError } from "./errores";

export type ResultadoDeEnvio = { exitoso: true } | { exitoso: false; mensaje: string };

async function leerCodigoDeError(respuesta: Response): Promise<string | undefined> {
  try {
    const cuerpo = await respuesta.json();
    return cuerpo.codigo;
  } catch {
    return undefined;
  }
}

export async function enviarFormulario(ruta: string, cuerpo: object): Promise<ResultadoDeEnvio> {
  try {
    const respuesta = await fetch(ruta, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
    if (respuesta.ok) return { exitoso: true };
    return { exitoso: false, mensaje: mensajeDeError(await leerCodigoDeError(respuesta)) };
  } catch {
    return { exitoso: false, mensaje: MENSAJE_GENERICO };
  }
}
