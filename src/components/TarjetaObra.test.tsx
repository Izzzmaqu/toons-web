import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TEXTOS } from "@/lib/textos";
import type { Obra } from "@/lib/tipos";
import { TarjetaObra } from "./TarjetaObra";

const OBRA: Obra = {
  id: 3,
  titulo: "El Jardín Errante",
  descripcion: "Un jardín que cambia de lugar cada noche.",
  portada: "portada-03.svg",
  creador: "Mateo Ríos",
  fechaPublicacion: "2026-11-01T00:00:00Z",
};

describe("TarjetaObra", () => {
  it("muestra el título y el creador", () => {
    render(<TarjetaObra obra={OBRA} />);

    expect(screen.getByRole("heading", { name: OBRA.titulo })).toBeInTheDocument();
    expect(screen.getByText(OBRA.creador, { exact: false })).toBeInTheDocument();
  });

  it("sirve la portada desde la carpeta local de portadas con texto alternativo", () => {
    render(<TarjetaObra obra={OBRA} />);

    const portada = screen.getByRole("img", { name: `${TEXTOS.inicio.textoAlternativoPortada} ${OBRA.titulo}` });
    expect(portada).toHaveAttribute("src", "/portadas/portada-03.svg");
  });
});
