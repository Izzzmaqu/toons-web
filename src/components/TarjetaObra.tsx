import Image from "next/image";
import { RUTA_PORTADAS } from "@/lib/constantes";
import { TEXTOS } from "@/lib/textos";
import type { Obra } from "@/lib/tipos";

export function TarjetaObra({ obra }: { obra: Obra }) {
  return (
    <article className="flex w-40 shrink-0 flex-col gap-2">
      <Image
        src={`${RUTA_PORTADAS}/${obra.portada}`}
        alt={`${TEXTOS.inicio.textoAlternativoPortada} ${obra.titulo}`}
        width={300}
        height={400}
        unoptimized
        className="aspect-[3/4] w-full rounded-lg object-cover shadow-sm"
      />
      <div className="flex flex-col gap-0.5">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{obra.titulo}</h3>
        <p className="text-xs text-texto/60">
          {TEXTOS.inicio.porCreador} {obra.creador}
        </p>
      </div>
    </article>
  );
}
