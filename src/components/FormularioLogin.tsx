"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { enviarFormulario } from "@/lib/enviarFormulario";
import { TEXTOS } from "@/lib/textos";
import { validarLogin, type ErroresLogin } from "@/lib/validacion";
import { CampoContrasena } from "./CampoContrasena";
import { CampoDeTexto } from "./CampoDeTexto";

export function FormularioLogin() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [erroresDeCampo, setErroresDeCampo] = useState<ErroresLogin>({});
  const [mensajeDeFallo, setMensajeDeFallo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function alEnviar(evento: FormEvent) {
    evento.preventDefault();
    setMensajeDeFallo(null);
    const errores = validarLogin(correo, contrasena);
    setErroresDeCampo(errores);
    if (Object.keys(errores).length > 0) return;

    setCargando(true);
    const resultado = await enviarFormulario("/api/sesion", { correo, contrasena });
    if (resultado.exitoso) {
      router.replace("/");
      router.refresh();
      return;
    }
    setMensajeDeFallo(resultado.mensaje);
    setCargando(false);
  }

  return (
    <form onSubmit={alEnviar} noValidate className="flex flex-col gap-4">
      <CampoDeTexto
        id="correo"
        etiqueta={TEXTOS.comun.etiquetaCorreo}
        tipo="email"
        autoComplete="email"
        placeholder={TEXTOS.comun.placeholderCorreo}
        valor={correo}
        alCambiar={setCorreo}
        deshabilitado={cargando}
        codigoDeError={erroresDeCampo.correo}
      />
      <CampoContrasena
        valor={contrasena}
        alCambiar={setContrasena}
        deshabilitado={cargando}
        autoComplete="current-password"
        codigoDeError={erroresDeCampo.contrasena}
      />

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
