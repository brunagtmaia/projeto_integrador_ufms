// Rota: /acompanhar
// Pasta app/acompanhar + page.js = URL /acompanhar.
//
// MVP: acompanhar a denúncia SÓ pelo número do protocolo
// (sem cadastro, sem "minhas denúncias").
// Depois: um campo para digitar o protocolo e mostrar o status.

import PlaceholderTela from "../../components/PlaceholderTela";

export const metadata = {
  title: "Acompanhar denúncia",
};

export default function PaginaAcompanhar() {
  return (
    <PlaceholderTela
      titulo="Acompanhar"
      descricao="Consulta o andamento só com o número do protocolo."
    />
  );
}
