"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NOMBRE_PLATAFORMA } from "@/lib/constantes";
import { TEXTOS } from "@/lib/textos";

type PropiedadesEncabezado = { nombreUsuario: string; consulta: string };

export function Encabezado({ nombreUsuario, consulta }: PropiedadesEncabezado) {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);

  async function cerrarSesion() {
    await fetch("/api/sesion", { method: "DELETE" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-texto/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <span className="text-xl font-bold text-primario">{NOMBRE_PLATAFORMA}</span>

        <form role="search" method="get" action="/" className="order-last flex w-full gap-2 sm:order-none sm:w-96">
          <input
            type="search"
            name="titulo"
            defaultValue={consulta}
            aria-label={TEXTOS.encabezado.etiquetaBuscador}
            placeholder={TEXTOS.encabezado.placeholderBuscador}
            className="w-full rounded-md border border-texto/20 bg-fondo px-3 py-2 text-sm focus:border-primario focus:outline-none"
          />
          <button type="submit" className="rounded-md bg-acento px-4 py-2 text-sm font-semibold text-white">
            {TEXTOS.encabezado.botonBuscar}
          </button>
        </form>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-expanded={menuAbierto}
            aria-label={TEXTOS.encabezado.menuUsuario}
            className="rounded-full bg-primario px-3 py-1.5 text-sm font-semibold text-white"
          >
            {nombreUsuario}
          </button>
          {menuAbierto && (
            <div className="absolute right-0 z-10 mt-2 w-44 rounded-md border border-texto/10 bg-white p-1 shadow-md">
              <button
                type="button"
                onClick={cerrarSesion}
                className="w-full rounded px-3 py-2 text-left text-sm hover:bg-fondo"
              >
                {TEXTOS.encabezado.cerrarSesion}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
