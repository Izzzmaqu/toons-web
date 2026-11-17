"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { NOMBRE_PLATAFORMA } from "@/lib/constantes";
import { TEXTOS } from "@/lib/textos";

export function Encabezado({ nombreUsuario }: { nombreUsuario: string }) {
  const router = useRouter();
  const [menuAbierto, setMenuAbierto] = useState(false);

  async function cerrarSesion() {
    await fetch("/api/sesion", { method: "DELETE" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-texto/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <span className="text-xl font-bold text-primario">{NOMBRE_PLATAFORMA}</span>
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
            <div className="absolute right-0 mt-2 w-44 rounded-md border border-texto/10 bg-white p-1 shadow-md">
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
