import { FormularioLogin } from "@/components/FormularioLogin";
import { NOMBRE_PLATAFORMA } from "@/lib/constantes";
import { TEXTOS } from "@/lib/textos";

export default function PaginaLogin() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="flex w-full max-w-sm flex-col gap-6 rounded-lg border border-texto/10 bg-white p-8 shadow-sm">
        <header className="flex flex-col gap-1.5">
          <p className="text-sm font-semibold uppercase tracking-wide text-acento">{NOMBRE_PLATAFORMA}</p>
          <h1 className="text-2xl font-bold">{TEXTOS.login.titulo}</h1>
          <p className="text-sm text-texto/60">{TEXTOS.login.subtitulo}</p>
        </header>
        <FormularioLogin />
      </section>
    </main>
  );
}
