"use client";

// =============================================================================
// BOTÃO "Enviar Denúncia" (só o clique — o visual continua o da página)
// =============================================================================
// Por que um arquivo separado?
// A página /denuncia precisa de onClick + navegação. Isso exige "use client".
// Se colocássemos "use client" no page.js inteiro, perderíamos o metadata
// (título da aba). Então o formulário visual fica no page.js e SÓ este botão
// é cliente.
//
// O que o clique faz (check-out 2, sem banco):
// 1) sorteia um id de lib/denuncias-exemplo.js
// 2) vai para /denuncia/sucesso?protocolo=ESSE_ID
// =============================================================================

import { useRouter } from "next/navigation";
import { sortearProtocoloExemplo } from "../../lib/denuncias-exemplo";

export default function BotaoEnviarDenuncia() {
  const router = useRouter();

  function aoEnviar() {
    const protocolo = sortearProtocoloExemplo();
    router.push(`/denuncia/sucesso?protocolo=${protocolo}`);
  }

  return (
    <button type="button" className="botao-enviar" onClick={aoEnviar}>
      <span>▷</span>
      Enviar Denúncia
    </button>
  );
}
