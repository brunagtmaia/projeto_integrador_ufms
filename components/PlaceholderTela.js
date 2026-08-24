// Componente reutilizável: o "miolo" temporário de cada tela.
//
// Por que um arquivo em components/ e não copiar o mesmo JSX em 4 páginas?
// - As 4 rotas (denúncia, acompanhar, mapa, prefeitura) ainda não têm formulário/mapa.
// - Elas só precisam de título, texto e um jeito de voltar para a Home.
// - Quando alguém for implementar de verdade, troca o conteúdo de app/<rota>/page.js
//   e pode até apagar este arquivo se não precisar mais.
//
// "props" (titulo, descricao) = dados que a página manda para cá.
// Ex.: <PlaceholderTela titulo="Mapa" descricao="..." />

import Link from "next/link";

export default function PlaceholderTela({ titulo, descricao }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <main className="flex w-full max-w-md flex-col gap-6">
        <p>
          {/* href="/" volta para app/page.js (a Home). */}
          <Link
            href="/"
            className="text-sm text-zinc-600 underline underline-offset-2 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Voltar à Home
          </Link>
        </p>
        <header>
          <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {titulo}
          </h1>
          {/*
            Só mostra a descrição se ela existir.
            descricao ? (...) : null  = "se tiver texto, desenha o <p>; senão, nada".
          */}
          {descricao ? (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {descricao}
            </p>
          ) : null}
        </header>
        {/* Aviso para o grupo: a URL já funciona; a tela em si ainda vai ser feita. */}
        <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Tela ainda não implementada. A rota já está configurada.
        </p>
      </main>
    </div>
  );
}
