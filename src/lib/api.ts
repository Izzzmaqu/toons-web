function urlDeApi(ruta: string): string {
  const urlBase = process.env.API_URL;
  if (!urlBase) {
    throw new Error("Falta la variable de entorno API_URL. Copia .env.example a .env.local.");
  }
  return `${urlBase}${ruta}`;
}

export type RespuestaLogin = { token: string; nombre: string; rol: string };

export type Perfil = { nombre: string; rol: string };

export function iniciarSesionEnApi(correo: string, contrasena: string): Promise<Response> {
  return fetch(urlDeApi("/api/autenticacion/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, contrasena }),
    cache: "no-store",
  });
}

export async function obtenerPerfil(token: string): Promise<Perfil | null> {
  const respuesta = await fetch(urlDeApi("/api/autenticacion/perfil"), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return respuesta.ok ? respuesta.json() : null;
}
