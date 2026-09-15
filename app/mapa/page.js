// =============================================================================
// PÁGINA /mapa  →  arquivo: app/mapa/page.js
// =============================================================================
// No App Router, o NOME DA PASTA vira a URL. Esta pasta se chama "mapa",
// então o endereço é http://localhost:3000/mapa
//
// Este arquivo é um Server Component (não tem "use client"): só define o
// título da aba e chama TelaMapa, que é a parte interativa (mapa + lista).
//
// Check-out 3 · passo 11: TelaMapa busca a lista em GET /api/denuncias
// (não usa mais o mock DENUNCIAS_EXEMPLO).
//
// O menu hambúrguer NÃO é desenhado aqui. Ele está no layout raiz.
// =============================================================================

import TelaMapa from "../../components/mapa/TelaMapa";

export const metadata = {
  title: "Mapa de denúncias",
};

export default function PaginaMapa() {
  return <TelaMapa />;
}
