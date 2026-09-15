// Rota: /denuncia
// Como o Next.js descobre isso: pasta app/denuncia + arquivo page.js = URL /denuncia.
//
// MVP (docs/mpv.md): denúncia SEM login — localização + foto + gerar protocolo.
// Layout visual: NÃO redesenhar (combinado no check-out 2).
//
// Check-out 3 · passo 09:
//   O formulário de verdade (inputs + POST /api/denuncias) fica no componente
//   cliente FormularioDenuncia. Esta page.js só define o título da aba e
//   renderiza esse formulário — assim o metadata do App Router continua
//   funcionando (metadata não pode ficar num arquivo com "use client").
//
// Guia: docs/11-checkout3-banco-backend.md

import FormularioDenuncia from "../../components/denuncia/FormularioDenuncia";

// Título da aba do navegador nesta página (sobrescreve o do layout).
export const metadata = {
  title: "Nova denúncia",
};

export default function PaginaDenuncia() {
  return <FormularioDenuncia />;
}
