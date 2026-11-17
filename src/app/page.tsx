import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Encabezado } from "@/components/Encabezado";
import { FilaObras } from "@/components/FilaObras";
import { PortadaDestacada } from "@/components/PortadaDestacada";
import { ResultadosBusqueda } from "@/components/ResultadosBusqueda";
import { buscarObrasPorTitulo, obtenerPerfil, obtenerRecientes, obtenerTendencias } from "@/lib/api";
import { NOMBRE_COOKIE_SESION } from "@/lib/constantes";
import { TEXTOS } from "@/lib/textos";

type PropiedadesPagina = { searchParams: Promise<{ titulo?: string }> };

async function InicioConFilas({ token }: { token: string }) {
  const [recientes, tendencias] = await Promise.all([obtenerRecientes(token), obtenerTendencias(token)]);
  const [destacada, ...restoDeRecientes] = recientes;

  return (
    <>
      {destacada && <PortadaDestacada obra={destacada} />}
      <FilaObras titulo={TEXTOS.inicio.recientes} obras={restoDeRecientes} />
      <FilaObras titulo={TEXTOS.inicio.tendencias} obras={tendencias} />
    </>
  );
}

async function InicioConBusqueda({ token, consulta }: { token: string; consulta: string }) {
  const obras = await buscarObrasPorTitulo(token, consulta);
  return <ResultadosBusqueda consulta={consulta} obras={obras} />;
}

export default async function PaginaInicio({ searchParams }: PropiedadesPagina) {
  const { titulo } = await searchParams;
  const almacen = await cookies();
  const token = almacen.get(NOMBRE_COOKIE_SESION)?.value;
  const perfil = token ? await obtenerPerfil(token) : null;
  if (!token || !perfil) redirect("/login");

  const consulta = titulo?.trim() ?? "";

  return (
    <>
      <Encabezado nombreUsuario={perfil.nombre} consulta={consulta} />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8">
        {consulta ? <InicioConBusqueda token={token} consulta={consulta} /> : <InicioConFilas token={token} />}
      </main>
    </>
  );
}
