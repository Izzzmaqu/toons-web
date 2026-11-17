import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NOMBRE_PLATAFORMA } from "@/lib/constantes";
import "./globals.css";

export const metadata: Metadata = {
  title: NOMBRE_PLATAFORMA,
};

export default function LayoutRaiz({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
