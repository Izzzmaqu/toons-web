import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Encabezado } from "@/components/Encabezado";
import { obtenerPerfil } from "@/lib/api";
import { NOMBRE_COOKIE_SESION, NOMBRE_PLATAFORMA } from "@/lib/constantes";
import { TEXTOS } from "@/lib/textos";

export default async function PaginaInicio() {
  const almacen = await cookies();
  const token = almacen.get(NOMBRE_COOKIE_SESION)?.value;
  const perfil = token ? await obtenerPerfil(token) : null;
  if (!perfil) redirect("/login");

  return (
    <>
      <Encabezado nombreUsuario={perfil.nombre} />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-bold">
          {TEXTOS.inicio.bienvenida} {NOMBRE_PLATAFORMA}
        </h1>
        <p className="mt-2 text-texto/70">{TEXTOS.inicio.descripcion}</p>
      </main>
    </>
  );
}
