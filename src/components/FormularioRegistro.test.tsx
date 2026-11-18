import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CODIGOS_ERROR, MENSAJE_GENERICO, mensajeDeError } from "@/lib/errores";
import { TEXTOS } from "@/lib/textos";
import { FormularioRegistro } from "./FormularioRegistro";

const reemplazar = vi.fn();
const refrescar = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: reemplazar, refresh: refrescar }),
}));

const NOMBRE = "Ana Pérez";
const CORREO = "ana@ejemplo.com";
const CONTRASENA = "clave-de-ejemplo";

function respuestaDeError(estado: number, codigo: string, campo: string | null = null) {
  return new Response(JSON.stringify({ codigo, campo }), { status: estado });
}

async function llenarYEnviar(nombre = NOMBRE, correo = CORREO, contrasena = CONTRASENA) {
  const usuario = userEvent.setup();
  if (nombre) await usuario.type(screen.getByLabelText(TEXTOS.registro.etiquetaNombre), nombre);
  if (correo) await usuario.type(screen.getByLabelText(TEXTOS.comun.etiquetaCorreo), correo);
  if (contrasena) await usuario.type(screen.getByLabelText(TEXTOS.comun.etiquetaContrasena), contrasena);
  await usuario.click(screen.getByRole("button", { name: TEXTOS.registro.botonCrear }));
  return usuario;
}

describe("FormularioRegistro", () => {
  const peticion = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", peticion);
    render(<FormularioRegistro />);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("con los campos vacíos muestra los tres mensajes y no llama al servidor", async () => {
    await llenarYEnviar("", "", "");

    expect(screen.getByText(mensajeDeError(CODIGOS_ERROR.nombreObligatorio))).toBeInTheDocument();
    expect(screen.getByText(mensajeDeError(CODIGOS_ERROR.correoObligatorio))).toBeInTheDocument();
    expect(screen.getByText(mensajeDeError(CODIGOS_ERROR.contrasenaObligatoria))).toBeInTheDocument();
    expect(peticion).not.toHaveBeenCalled();
  });

  it("con un nombre de más de 60 caracteres muestra el mensaje de nombre largo", async () => {
    await llenarYEnviar("a".repeat(61));

    expect(screen.getByText(mensajeDeError(CODIGOS_ERROR.nombreLargo))).toBeInTheDocument();
    expect(peticion).not.toHaveBeenCalled();
  });

  it("con un correo mal escrito muestra el mensaje de correo inválido", async () => {
    await llenarYEnviar(NOMBRE, "sin-arroba");

    expect(screen.getByText(mensajeDeError(CODIGOS_ERROR.correoInvalido))).toBeInTheDocument();
    expect(peticion).not.toHaveBeenCalled();
  });

  it("con una contraseña corta muestra el mensaje de contraseña corta", async () => {
    await llenarYEnviar(NOMBRE, CORREO, "1234567");

    expect(screen.getByText(mensajeDeError(CODIGOS_ERROR.contrasenaCorta))).toBeInTheDocument();
    expect(peticion).not.toHaveBeenCalled();
  });

  it("el botón del ojo muestra y oculta la contraseña", async () => {
    const usuario = userEvent.setup();
    const campo = screen.getByLabelText(TEXTOS.comun.etiquetaContrasena);
    expect(campo).toHaveAttribute("type", "password");

    await usuario.click(screen.getByRole("button", { name: TEXTOS.comun.mostrarContrasena }));
    expect(campo).toHaveAttribute("type", "text");

    await usuario.click(screen.getByRole("button", { name: TEXTOS.comun.ocultarContrasena }));
    expect(campo).toHaveAttribute("type", "password");
  });

  it("mientras espera al servidor deshabilita el botón y muestra el estado de carga", async () => {
    peticion.mockReturnValue(new Promise(() => {}));

    await llenarYEnviar();

    const boton = await screen.findByRole("button", { name: TEXTOS.registro.botonCreando });
    expect(boton).toBeDisabled();
  });

  it("ante un 409 muestra el mensaje de correo en uso", async () => {
    peticion.mockResolvedValue(respuestaDeError(409, CODIGOS_ERROR.correoEnUso, "correo"));

    await llenarYEnviar();

    expect(await screen.findByRole("alert")).toHaveTextContent(mensajeDeError(CODIGOS_ERROR.correoEnUso));
    expect(reemplazar).not.toHaveBeenCalled();
  });

  it("si no se puede contactar al servidor muestra el mensaje genérico", async () => {
    peticion.mockRejectedValue(new TypeError("fallo de red"));

    await llenarYEnviar();

    expect(await screen.findByRole("alert")).toHaveTextContent(MENSAJE_GENERICO);
  });

  it("con datos válidos envía el registro y navega al inicio", async () => {
    peticion.mockResolvedValue(new Response(JSON.stringify({ nombre: NOMBRE, rol: "lector" }), { status: 200 }));

    await llenarYEnviar();

    await waitFor(() => expect(reemplazar).toHaveBeenCalledWith("/"));
    expect(refrescar).toHaveBeenCalled();
    const [direccion, opciones] = peticion.mock.calls[0];
    expect(direccion).toBe("/api/registro");
    expect(JSON.parse(opciones.body)).toEqual({ nombre: NOMBRE, correo: CORREO, contrasena: CONTRASENA });
  });
});
