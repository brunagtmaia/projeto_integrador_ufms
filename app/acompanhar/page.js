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
  // Quem for fazer a consulta: campo de protocolo + resultado no lugar do placeholder.
  return (
    <PlaceholderTela
      titulo="Acompanhar"
      descricao="Consulta o andamento só com o número do protocolo."
    />
  );
}
