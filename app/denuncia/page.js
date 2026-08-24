// Rota: /denuncia
// Como o Next.js descobre isso: pasta app/denuncia + arquivo page.js = URL /denuncia.
//
// MVP (docs/mpv.md): denúncia SEM login — localização + foto + gerar protocolo.
// Esta página só reserva a rota. Quem for fazer o formulário edita ESTE arquivo
// (troca o PlaceholderTela pelo formulário de verdade).

import PlaceholderTela from "../../components/PlaceholderTela";

// Título da aba do navegador nesta página (sobrescreve o do layout).
export const metadata = {
  title: "Nova denúncia",
};

export default function PaginaDenuncia() {
  return (
    <PlaceholderTela
      titulo="Nova denúncia"
      descricao="Localização + foto + gerar protocolo, sem login."
    />
  );
}
