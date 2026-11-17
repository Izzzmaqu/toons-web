import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Obra } from "@/lib/tipos";
import { FilaObras } from "./FilaObras";

function crearObra(id: number): Obra {
  return {
    id,
    titulo: `Obra ${id}`,
    descripcion: "Descripción",
    portada: `portada-0${id}.svg`,
    creador: "Creadora",
    fechaPublicacion: "2026-11-01T00:00:00Z",
  };
}

describe("FilaObras", () => {
  it("muestra el título de la fila y una tarjeta por obra", () => {
    render(<FilaObras titulo="Recientes" obras={[crearObra(1), crearObra(2), crearObra(3)]} />);

    expect(screen.getByRole("heading", { name: "Recientes", level: 2 })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("no muestra nada cuando no hay obras", () => {
    const { container } = render(<FilaObras titulo="Recientes" obras={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
