import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CODIGOS_ERROR, MENSAJE_GENERICO, mensajeDeError } from "@/lib/errores";
import { TEXTOS } from "@/lib/textos";
import { FormularioLogin } from "./FormularioLogin";

const reemplazar = vi.fn();
const refrescar = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: reemplazar, refresh: refrescar }),
}));

const CORREO = "usuario@ejemplo.com";
const CONTRASENA = "clave-de-ejemplo";

function respuestaDeError(estado: number, codigo: string) {
  return new Response(JSON.stringify({ codigo, campo: null }), { status: estado });
}

async function llenarYEnviar(correo = CORREO, contrasena = CONTRASENA) {
  const usuario = userEvent.setup();
  if (correo) await usuario.type(screen.getByLabelText(TEXTOS.login.etiquetaCorreo), correo);
  if (contrasena) await usuario.type(screen.getByLabelText(TEXTOS.login.etiquetaContrasena), contrasena);
  await usuario.click(screen.getByRole("button", { name: TEXTOS.login.botonIngresar }));
  return usuario;
}

describe("FormularioLogin", () => {
  const peticion = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", peticion);
    render(<FormularioLogin />);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("con los campos vacíos muestra los dos mensajes y no llama al servidor", async () => {
    await llenarYEnviar("", "");

    expect(screen.getByText(mensajeDeError(CODIGOS_ERROR.correoObligatorio))).toBeInTheDocument();
    expect(screen.getByText(mensajeDeError(CODIGOS_ERROR.contrasenaObligatoria))).toBeInTheDocument();
    expect(peticion).not.toHaveBeenCalled();
  });

  it("con un correo mal escrito muestra el mensaje de correo inválido", async () => {
    await llenarYEnviar("sin-arroba", CONTRASENA);

    expect(screen.getByText(mensajeDeError(CODIGOS_ERROR.correoInvalido))).toBeInTheDocument();
    expect(peticion).not.toHaveBeenCalled();
  });

  it("con una contraseña corta muestra el mensaje de contraseña corta", async () => {
    await llenarYEnviar(CORREO, "1234567");

    expect(screen.getByText(mensajeDeError(CODIGOS_ERROR.contrasenaCorta))).toBeInTheDocument();
    expect(peticion).not.toHaveBeenCalled();
  });

  it("el botón del ojo muestra y oculta la contraseña", async () => {
    const usuario = userEvent.setup();
    const campo = screen.getByLabelText(TEXTOS.login.etiquetaContrasena);
    expect(campo).toHaveAttribute("type", "password");

    await usuario.click(screen.getByRole("button", { name: TEXTOS.login.mostrarContrasena }));
    expect(campo).toHaveAttribute("type", "text");

    await usuario.click(screen.getByRole("button", { name: TEXTOS.login.ocultarContrasena }));
    expect(campo).toHaveAttribute("type", "password");
  });

  it("mientras espera al servidor deshabilita el botón y muestra el estado de carga", async () => {
    peticion.mockReturnValue(new Promise(() => {}));

    await llenarYEnviar();

    const boton = await screen.findByRole("button", { name: TEXTOS.login.botonIngresando });
    expect(boton).toBeDisabled();
  });

  it("ante un 401 muestra el mensaje de credenciales inválidas", async () => {
    peticion.mockResolvedValue(respuestaDeError(401, CODIGOS_ERROR.credencialesInvalidas));

    await llenarYEnviar();

    expect(await screen.findByRole("alert")).toHaveTextContent(mensajeDeError(CODIGOS_ERROR.credencialesInvalidas));
    expect(reemplazar).not.toHaveBeenCalled();
  });

  it("ante un 423 muestra el mensaje de cuenta bloqueada", async () => {
    peticion.mockResolvedValue(respuestaDeError(423, CODIGOS_ERROR.cuentaBloqueada));

    await llenarYEnviar();

    expect(await screen.findByRole("alert")).toHaveTextContent(mensajeDeError(CODIGOS_ERROR.cuentaBloqueada));
  });

  it("si no se puede contactar al servidor muestra el mensaje genérico", async () => {
    peticion.mockRejectedValue(new TypeError("fallo de red"));

    await llenarYEnviar();

    expect(await screen.findByRole("alert")).toHaveTextContent(MENSAJE_GENERICO);
  });

  it("con credenciales correctas envía los datos y navega al inicio", async () => {
    peticion.mockResolvedValue(new Response(JSON.stringify({ nombre: "Usuario", rol: "lector" }), { status: 200 }));

    await llenarYEnviar();

    await waitFor(() => expect(reemplazar).toHaveBeenCalledWith("/"));
    expect(refrescar).toHaveBeenCalled();
    const [direccion, opciones] = peticion.mock.calls[0];
    expect(direccion).toBe("/api/sesion");
    expect(JSON.parse(opciones.body)).toEqual({ correo: CORREO, contrasena: CONTRASENA });
  });
});
