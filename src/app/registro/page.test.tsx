import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TEXTOS } from "@/lib/textos";
import PaginaLogin from "../login/page";
import PaginaRegistro from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
}));

describe("enlaces entre login y registro", () => {
  it("la página de registro enlaza al login", () => {
    render(<PaginaRegistro />);

    expect(screen.getByRole("link", { name: TEXTOS.registro.enlaceLogin })).toHaveAttribute("href", "/login");
  });

  it("la página de login enlaza al registro", () => {
    render(<PaginaLogin />);

    expect(screen.getByRole("link", { name: TEXTOS.login.enlaceRegistro })).toHaveAttribute("href", "/registro");
  });
});
