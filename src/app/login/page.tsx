import Link from "next/link";
import { FormularioLogin } from "@/components/FormularioLogin";
import { PantallaDeAcceso } from "@/components/PantallaDeAcceso";
import { TEXTOS } from "@/lib/textos";

export default function PaginaLogin() {
  return (
    <PantallaDeAcceso
      titulo={TEXTOS.login.titulo}
      subtitulo={TEXTOS.login.subtitulo}
      pie={
        <>
          {TEXTOS.login.preguntaSinCuenta}{" "}
          <Link href="/registro" className="font-semibold text-primario hover:underline">
            {TEXTOS.login.enlaceRegistro}
          </Link>
        </>
      }
    >
      <FormularioLogin />
    </PantallaDeAcceso>
  );
}
