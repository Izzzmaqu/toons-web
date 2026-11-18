import type { Obra, Perfil } from "./tipos";

export type RespuestaLogin = { token: string; nombre: string; rol: string };

function urlDeApi(ruta: string): string {
  const urlBase = process.env.API_URL;
  if (!urlBase) {
    throw new Error("Falta la variable de entorno API_URL. Copia .env.example a .env.local.");
  }
  return `${urlBase}${ruta}`;
}

function consultarApi(ruta: string, token: string): Promise<Response> {
  return fetch(urlDeApi(ruta), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

async function obtenerObras(ruta: string, token: string): Promise<Obra[]> {
  const respuesta = await consultarApi(ruta, token);
  if (!respuesta.ok) {
    throw new Error(`La API respondió ${respuesta.status} en ${ruta}.`);
  }
  return respuesta.json();
}

export function iniciarSesionEnApi(correo: string, contrasena: string): Promise<Response> {
  return fetch(urlDeApi("/api/autenticacion/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
    cache: "no-store",
  });
}

export function registrarEnApi(nombre: string, correo: string, contrasena: string): Promise<Response> {
  return fetch(urlDeApi("/api/autenticacion/registro"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, correo, contrasena }),
    cache: "no-store",
  });
}

export async function obtenerPerfil(token: string): Promise<Perfil | null> {
  const respuesta = await consultarApi("/api/autenticacion/perfil", token);
  return respuesta.ok ? respuesta.json() : null;
}

export function obtenerRecientes(token: string): Promise<Obra[]> {
  return obtenerObras("/api/obras/recientes", token);
}

export function obtenerTendencias(token: string): Promise<Obra[]> {
  return obtenerObras("/api/obras/tendencias", token);
}

export function buscarObrasPorTitulo(token: string, titulo: string): Promise<Obra[]> {
  return obtenerObras(`/api/obras?titulo=${encodeURIComponent(titulo)}`, token);
}
