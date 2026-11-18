"use client";

import { useState } from "react";
import { TEXTOS } from "@/lib/textos";
import { CampoDeTexto } from "./CampoDeTexto";
import { IconoOjo } from "./IconoOjo";

type PropiedadesContrasena = {
  valor: string;
  alCambiar: (valor: string) => void;
  deshabilitado: boolean;
  autoComplete: string;
  codigoDeError?: string;
};

export function CampoContrasena({ valor, alCambiar, deshabilitado, autoComplete, codigoDeError }: PropiedadesContrasena) {
  const [visible, setVisible] = useState(false);

  return (
    <CampoDeTexto
      id="contrasena"
      etiqueta={TEXTOS.comun.etiquetaContrasena}
      tipo={visible ? "text" : "password"}
      valor={valor}
      alCambiar={alCambiar}
      deshabilitado={deshabilitado}
      autoComplete={autoComplete}
      codigoDeError={codigoDeError}
      accion={
        <button
          type="button"
          onClick={() => setVisible((estaVisible) => !estaVisible)}
          aria-label={visible ? TEXTOS.comun.ocultarContrasena : TEXTOS.comun.mostrarContrasena}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-texto/60 hover:text-texto"
        >
          <IconoOjo tachado={visible} />
        </button>
      }
    />
  );
}
