import Image from "next/image";
import { RUTA_PORTADAS } from "@/lib/constantes";
import { TEXTOS } from "@/lib/textos";
import type { Obra } from "@/lib/tipos";

export function PortadaDestacada({ obra }: { obra: Obra }) {
  return (
    <section className="flex flex-col gap-6 rounded-2xl bg-primario p-6 text-white sm:flex-row sm:items-center sm:p-8">
      <Image
        src={`${RUTA_PORTADAS}/${obra.portada}`}
        alt={`${TEXTOS.inicio.textoAlternativoPortada} ${obra.titulo}`}
        width={300}
        height={400}
        unoptimized
        priority
        className="aspect-[3/4] w-40 shrink-0 rounded-lg object-cover shadow-lg sm:w-48"
      />
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-acento">{TEXTOS.inicio.destacada}</p>
        <h2 className="text-3xl font-bold">{obra.titulo}</h2>
        <p className="max-w-xl text-white/85">{obra.descripcion}</p>
        <p className="text-sm text-white/70">
          {TEXTOS.inicio.porCreador} {obra.creador}
        </p>
      </div>
    </section>
  );
}
