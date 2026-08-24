// Esta é a HOME do site.
// No App Router, o arquivo app/page.js corresponde à URL "/".
// O MVP pede: "Home com os botões" — daqui a pessoa escolhe a tela.

import Link from "next/link";

// Lista das telas do MVP (docs/mpv.md).
// Cada item tem:
// - href: caminho da URL (precisa existir um app/<pasta>/page.js)
// - titulo / descricao: texto do botão
//
// Por que um array e não 4 botões copiados?
// Assim, para incluir outra tela, basta adicionar um objeto aqui.
const telas = [
  {
    href: "/denuncia",
    titulo: "Nova denúncia",
    descricao: "Localização + foto + gerar protocolo (sem login)",
  },
  {
    href: "/acompanhar",
    titulo: "Acompanhar",
    descricao: "Consulta só pelo número do protocolo",
  },
  {
    href: "/mapa",
    titulo: "Mapa",
    descricao: "Pontos das denúncias (lista + mapa)",
  },
  {
    href: "/prefeitura",
    titulo: "Marcar como resolvido",
    descricao: "Tela da prefeitura (senha no .env)",
  },
];

// Componente da Home. "export default" é o que o Next.js desenha nesta rota.
export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <main className="flex w-full max-w-md flex-col gap-8">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            Denúncias
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            MVP — escolha uma tela
          </p>
        </header>

        {/* nav = bloco de navegação. aria-label descreve o menu para acessibilidade. */}
        <nav className="flex flex-col gap-3" aria-label="Telas do MVP">
          {/*
            .map percorre o array "telas" e cria um Link para cada item.
            key={tela.href}: o React precisa de um identificador único em listas.
            Usamos o href porque cada rota é diferente.
          */}
          {telas.map((tela) => (
            // Link do Next.js (não use <a href> para páginas internas).
            // Ele troca de tela sem recarregar o site inteiro.
            <Link
              key={tela.href}
              href={tela.href}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-left transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              <span className="block font-medium text-black dark:text-zinc-50">
                {tela.titulo}
              </span>
              <span className="mt-1 block text-sm text-zinc-600 dark:text-zinc-400">
                {tela.descricao}
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
