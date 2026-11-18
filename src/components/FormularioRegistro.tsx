"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { enviarFormulario } from "@/lib/enviarFormulario";
import { TEXTOS } from "@/lib/textos";
import { validarRegistro, type ErroresRegistro } from "@/lib/validacion";
import { CampoContrasena } from "./CampoContrasena";
import { CampoDeTexto } from "./CampoDeTexto";

export function FormularioRegistro() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [erroresDeCampo, setErroresDeCampo] = useState<ErroresRegistro>({});
  const [mensajeDeFallo, setMensajeDeFallo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function alEnviar(evento: FormEvent) {
    evento.preventDefault();
    setMensajeDeFallo(null);
    const errores = validarRegistro(nombre, correo, contrasena);
    setErroresDeCampo(errores);
    if (Object.keys(errores).length > 0) return;

    setCargando(true);
    const resultado = await enviarFormulario("/api/registro", { nombre, correo, contrasena });
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
        id="nombre"
        etiqueta={TEXTOS.registro.etiquetaNombre}
        autoComplete="name"
        placeholder={TEXTOS.registro.placeholderNombre}
        valor={nombre}
        alCambiar={setNombre}
        deshabilitado={cargando}
        codigoDeError={erroresDeCampo.nombre}
      />
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
        autoComplete="new-password"
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
        {cargando ? TEXTOS.registro.botonCreando : TEXTOS.registro.botonCrear}
      </button>
    </form>
  );
}
