import Link from "next/link";
import { FormularioRegistro } from "@/components/FormularioRegistro";
import { PantallaDeAcceso } from "@/components/PantallaDeAcceso";
import { TEXTOS } from "@/lib/textos";

export default function PaginaRegistro() {
  return (
    <PantallaDeAcceso
      titulo={TEXTOS.registro.titulo}
      subtitulo={TEXTOS.registro.subtitulo}
      pie={
        <>
          {TEXTOS.registro.preguntaConCuenta}{" "}
          <Link href="/login" className="font-semibold text-primario hover:underline">
            {TEXTOS.registro.enlaceLogin}
          </Link>
        </>
      }
    >
      <FormularioRegistro />
    </PantallaDeAcceso>
  );
}
