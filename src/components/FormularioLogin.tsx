"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MENSAJE_GENERICO, mensajeDeError } from "@/lib/errores";
import { TEXTOS } from "@/lib/textos";
import { validarLogin, type ErroresLogin } from "@/lib/validacion";
import { IconoOjo } from "./IconoOjo";

const CLASES_CAMPO =
  "w-full rounded-md border border-texto/20 bg-white px-3 py-2 text-sm focus:border-primario focus:outline-none disabled:opacity-50";

async function leerCodigoDeError(respuesta: Response): Promise<string | undefined> {
  try {
    const cuerpo = await respuesta.json();
    return cuerpo.codigo;
  } catch {
    return undefined;
  }
}

export function FormularioLogin() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [contrasenaVisible, setContrasenaVisible] = useState(false);
  const [erroresDeCampo, setErroresDeCampo] = useState<ErroresLogin>({});
  const [mensajeDeFallo, setMensajeDeFallo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviarCredenciales() {
    setCargando(true);
    try {
      const respuesta = await fetch("/api/sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });
      if (respuesta.ok) {
        router.replace("/");
        router.refresh();
        return;
      }
      setMensajeDeFallo(mensajeDeError(await leerCodigoDeError(respuesta)));
    } catch {
      setMensajeDeFallo(MENSAJE_GENERICO);
    } finally {
      setCargando(false);
    }
  }

  async function alEnviar(evento: FormEvent) {
    evento.preventDefault();
    setMensajeDeFallo(null);
    const errores = validarLogin(correo, contrasena);
    setErroresDeCampo(errores);
    if (Object.keys(errores).length > 0) return;
    await enviarCredenciales();
  }

  return (
    <form onSubmit={alEnviar} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="correo" className="text-sm font-medium">
          {TEXTOS.login.etiquetaCorreo}
        </label>
        <input
          id="correo"
          type="email"
          autoComplete="email"
          value={correo}
          onChange={(evento) => setCorreo(evento.target.value)}
          placeholder={TEXTOS.login.placeholderCorreo}
          disabled={cargando}
          className={CLASES_CAMPO}
        />
        {erroresDeCampo.correo && <p className="text-xs text-peligro">{mensajeDeError(erroresDeCampo.correo)}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contrasena" className="text-sm font-medium">
          {TEXTOS.login.etiquetaContrasena}
        </label>
        <div className="relative">
          <input
            id="contrasena"
            type={contrasenaVisible ? "text" : "password"}
            autoComplete="current-password"
            value={contrasena}
            onChange={(evento) => setContrasena(evento.target.value)}
            disabled={cargando}
            className={`${CLASES_CAMPO} pr-10`}
          />
          <button
            type="button"
            onClick={() => setContrasenaVisible((visible) => !visible)}
            aria-label={contrasenaVisible ? TEXTOS.login.ocultarContrasena : TEXTOS.login.mostrarContrasena}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-texto/60 hover:text-texto"
          >
            <IconoOjo tachado={contrasenaVisible} />
          </button>
        </div>
        {erroresDeCampo.contrasena && (
          <p className="text-xs text-peligro">{mensajeDeError(erroresDeCampo.contrasena)}</p>
        )}
      </div>

      {mensajeDeFallo && (
        <p role="alert" className="rounded-md bg-peligro/10 px-3 py-2 text-sm text-peligro">
          {mensajeDeFallo}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="rounded-md bg-primario px-4 py-2 text-sm font-semibold text-white hover:bg-primario/90 disabled:opacity-60"
      >
        {cargando ? TEXTOS.login.botonIngresando : TEXTOS.login.botonIngresar}
      </button>
    </form>
  );
}
