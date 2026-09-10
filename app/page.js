// =============================================================================
// HOME — URL: /
// =============================================================================
// No App Router, app/page.js é sempre a página inicial.
// Visual inspirado no mockup FiscalizApp (docs/ideias_layouts/), sem ilustração
// e SEM ícone de perfil/login (MVP não tem conta).
//
// Os mesmos destinos existem no menu lateral (components/MenuLateral.js).
// =============================================================================

import Link from "next/link";
import Icone from "../components/Icone";

// Array das ações. Para incluir outra no futuro:
// 1) crie app/nova-pasta/page.js
// 2) acrescente um objeto aqui
// 3) acrescente o mesmo href em MenuLateral.js
const telas = [
  {
    href: "/denuncia",
    titulo: "Criar Denúncia",
    descricao: "Registrar novo lote irregular",
    icone: "add",
    destaque: true,
    corIcone: "bg-white/20 text-white",
  },
  {
    href: "/acompanhar",
    titulo: "Acompanhar Denúncia",
    descricao: "Via protocolo",
    icone: "description",
    destaque: false,
    corIcone: "bg-sky-100 text-sky-700",
  },
  {
    href: "/mapa",
    titulo: "Consultar Pontos",
    descricao: "Mapa de áreas",
    icone: "location_on",
    destaque: false,
    corIcone: "bg-primary/15 text-primary",
  },
  {
    href: "/prefeitura",
    titulo: "Prefeitura",
    descricao: "Marcar denúncia como resolvida",
    icone: "task_alt",
    destaque: false,
    corIcone: "bg-secondary/10 text-secondary",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8 md:py-12">
      <main className="flex w-full max-w-md flex-col gap-8 md:max-w-2xl lg:max-w-3xl">
        {/* Saudação — sem ilustração (decisão fase 5: opção C) */}
        <header className="md:max-w-xl">
          <h1 className="headline text-[1.85rem] md:text-[2.15rem]">
            Olá, Cidadão!
          </h1>
          <p className="body-text mt-3 leading-relaxed md:text-lg">
            Denuncie lotes vagos com mato alto ou irregularidades para
            construirmos um espaço urbano{" "}
            <span className="font-semibold text-primary">
              mais seguro e limpo
            </span>{" "}
            para todos.
          </p>
        </header>

        <section aria-labelledby="acoes-principais">
          <h2
            id="acoes-principais"
            className="label-text mb-3 uppercase tracking-wide text-[var(--texto-suave)]"
          >
            Ações principais
          </h2>

          <nav
            className="flex flex-col gap-3 md:grid md:grid-cols-2"
            aria-label="Telas do MVP"
          >
            {/*
              map = para cada item do array, cria um Link.
              key = o React exige um id único em listas; usamos a URL.
              Link (next/link) troca de página SEM recarregar o site inteiro.
            */}
            {telas.map((tela) => (
              <Link
                key={tela.href}
                href={tela.href}
                className={
                  tela.destaque
                    ? "btn-primario w-full !justify-between !rounded-[var(--raio)] px-4 py-4 md:col-span-2 md:py-5"
                    : "cartao flex w-full items-center justify-between gap-3 px-4 py-4 transition hover:border-primary/40 md:py-5"
                }
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tela.corIcone}`}
                  >
                    <Icone nome={tela.icone} />
                  </span>
                  <span className="text-left">
                    <span className="block text-base font-semibold">
                      {tela.titulo}
                    </span>
                    <span
                      className={`mt-0.5 block text-sm font-normal ${
                        tela.destaque
                          ? "opacity-90"
                          : "text-[var(--texto-suave)]"
                      }`}
                    >
                      {tela.descricao}
                    </span>
                  </span>
                </span>
                <Icone
                  nome="chevron_right"
                  className={`!text-2xl shrink-0 ${
                    tela.destaque
                      ? "opacity-90"
                      : "text-[var(--texto-suave)]"
                  }`}
                />
              </Link>
            ))}
          </nav>
        </section>
      </main>
    </div>
  );
}
