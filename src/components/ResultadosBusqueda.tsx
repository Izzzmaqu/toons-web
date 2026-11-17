import { TEXTOS } from "@/lib/textos";
import type { Obra } from "@/lib/tipos";
import { TarjetaObra } from "./TarjetaObra";

export function ResultadosBusqueda({ consulta, obras }: { consulta: string; obras: Obra[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">
        {TEXTOS.inicio.resultadosPara} “{consulta}”
      </h2>
      {obras.length === 0 ? (
        <p className="text-texto/70">{TEXTOS.inicio.sinResultados}</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {obras.map((obra) => (
            <TarjetaObra key={obra.id} obra={obra} />
          ))}
        </div>
      )}
    </section>
  );
}
