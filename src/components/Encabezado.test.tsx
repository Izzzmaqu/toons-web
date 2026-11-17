import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NOMBRE_PLATAFORMA } from "@/lib/constantes";
import { TEXTOS } from "@/lib/textos";
import { Encabezado } from "./Encabezado";

const reemplazar = vi.fn();
const refrescar = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: reemplazar, refresh: refrescar }),
}));

describe("Encabezado", () => {
  const peticion = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", peticion);
    peticion.mockResolvedValue(new Response(null, { status: 204 }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("muestra el nombre de la plataforma y el del usuario", () => {
    render(<Encabezado nombreUsuario="Ana" consulta="" />);

    expect(screen.getByText(NOMBRE_PLATAFORMA)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: TEXTOS.encabezado.menuUsuario })).toHaveTextContent("Ana");
  });

  it("el buscador envía el título por GET a la página de inicio y recuerda lo buscado", () => {
    render(<Encabezado nombreUsuario="Ana" consulta="torre" />);

    const buscador = screen.getByRole("search");
    expect(buscador).toHaveAttribute("method", "get");
    expect(buscador).toHaveAttribute("action", "/");
    expect(screen.getByRole("searchbox", { name: TEXTOS.encabezado.etiquetaBuscador })).toHaveValue("torre");
    expect(screen.getByRole("searchbox")).toHaveAttribute("name", "titulo");
  });

  it("Cerrar sesión borra la sesión y lleva al login", async () => {
    const usuario = userEvent.setup();
    render(<Encabezado nombreUsuario="Ana" consulta="" />);

    await usuario.click(screen.getByRole("button", { name: TEXTOS.encabezado.menuUsuario }));
    await usuario.click(screen.getByRole("button", { name: TEXTOS.encabezado.cerrarSesion }));

    await waitFor(() => expect(reemplazar).toHaveBeenCalledWith("/login"));
    expect(peticion).toHaveBeenCalledWith("/api/sesion", { method: "DELETE" });
  });
});
