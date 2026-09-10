// =============================================================================
// PLACEHOLDER DE TELA
// =============================================================================
// "Placeholder" = página temporária. As rotas /denuncia, /acompanhar, /mapa
// e /prefeitura JÁ FUNCIONAM (dá para abrir a URL), mas o formulário/mapa
// ainda vai ser feito por outra pessoa.
//
// Por que um componente em vez de copiar o mesmo HTML em 4 arquivos?
// Se mudarmos o visual do aviso, mudamos SÓ aqui.
//
// Como a página usa:
//   <PlaceholderTela
//     titulo="Mapa"
//     descricao="Pontos das denúncias em lista + mapa simples."
//   />
//
// titulo e descricao são PROPS: dados que o pai envia para este componente.
//
// Quando forem implementar de verdade: abra app/<rota>/page.js e TROQUE
// o <PlaceholderTela /> pelo formulário ou pelo mapa. Este arquivo pode
// continuar existindo enquanto alguma tela ainda estiver incompleta.
// =============================================================================

import Link from "next/link";
import Icone from "./Icone";

export default function PlaceholderTela({ titulo, descricao }) {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10 md:py-12">
      <main className="flex w-full max-w-md flex-col gap-6 md:max-w-lg">
        {/* href="/" volta para app/page.js (a Home). Link do Next = sem recarregar o site. */}
        <Link href="/" className="btn-contorno w-fit px-4 py-2 text-sm">
          <Icone nome="arrow_back" className="!text-xl" />
          Voltar à Home
        </Link>

        <header className="cartao px-5 py-6">
          <h1 className="headline">{titulo}</h1>
          {/*
            descricao ? (...) : null
            = "se veio texto de descrição, mostra o parágrafo; senão, não desenha nada".
          */}
          {descricao ? <p className="body-text mt-2">{descricao}</p> : null}
        </header>

        <p className="cartao border-dashed px-4 py-8 text-center body-text">
          Tela ainda não implementada. A rota já está configurada.
        </p>
      </main>
    </div>
  );
}
