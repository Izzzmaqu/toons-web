import type { Obra } from "@/lib/tipos";
import { TarjetaObra } from "./TarjetaObra";

export function FilaObras({ titulo, obras }: { titulo: string; obras: Obra[] }) {
  if (obras.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">{titulo}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {obras.map((obra) => (
          <TarjetaObra key={obra.id} obra={obra} />
        ))}
      </div>
    </section>
  );
}
