import type { ReactNode } from "react";
import { mensajeDeError } from "@/lib/errores";

type PropiedadesCampo = {
  id: string;
  etiqueta: string;
  valor: string;
  alCambiar: (valor: string) => void;
  deshabilitado: boolean;
  tipo?: string;
  autoComplete?: string;
  placeholder?: string;
  codigoDeError?: string;
  accion?: ReactNode;
};

const CLASES_CAMPO =
  "w-full rounded-md border border-texto/20 bg-white px-3 py-2 text-sm focus:border-primario focus:outline-none disabled:opacity-50";

export function CampoDeTexto({
  id,
  etiqueta,
  valor,
  alCambiar,
  deshabilitado,
  tipo = "text",
  autoComplete,
  placeholder,
  codigoDeError,
  accion,
}: PropiedadesCampo) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {etiqueta}
      </label>
      <div className="relative">
        <input
          id={id}
          type={tipo}
          autoComplete={autoComplete}
          value={valor}
          onChange={(evento) => alCambiar(evento.target.value)}
          placeholder={placeholder}
          disabled={deshabilitado}
          className={accion ? `${CLASES_CAMPO} pr-10` : CLASES_CAMPO}
        />
        {accion}
      </div>
      {codigoDeError && <p className="text-xs text-peligro">{mensajeDeError(codigoDeError)}</p>}
    </div>
  );
}
