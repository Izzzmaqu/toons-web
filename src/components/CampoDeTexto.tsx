import type { ReactNode, Ref } from "react";
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
  inputRef?: Ref<HTMLInputElement>;
};

const CLASES_CAMPO =
  "w-full rounded-md border border-texto/20 bg-white px-3 py-2 text-sm focus:border-primario focus:outline-none disabled:opacity-50";

const CLASES_CAMPO_ERROR = "border-peligro focus:border-peligro";

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
  inputRef,
}: PropiedadesCampo) {
  const idError = `${id}-error`;
  const tieneError = Boolean(codigoDeError);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {etiqueta}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type={tipo}
          autoComplete={autoComplete}
          value={valor}
          onChange={(evento) => alCambiar(evento.target.value)}
          placeholder={placeholder}
          disabled={deshabilitado}
          aria-invalid={tieneError}
          aria-describedby={tieneError ? idError : undefined}
          className={[
            CLASES_CAMPO,
            tieneError ? CLASES_CAMPO_ERROR : "",
            accion ? "pr-10" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
        {accion}
      </div>
      {tieneError && (
        <p id={idError} role="alert" className="text-xs text-peligro">
          {mensajeDeError(codigoDeError)}
        </p>
      )}
    </div>
  );
}