// =============================================================================
// PÁGINA /prefeitura
// =============================================================================
// Pasta app/prefeitura + page.js = URL /prefeitura
//
// MVP: marcar denúncia como resolvido (senha do .env, sem login de usuários).
// Check-out 3 · passo 12: a interação real (fetch + senha + PATCH) fica em
// components/prefeitura/TelaPrefeitura.js ("use client").
// =============================================================================

import TelaPrefeitura from "../../components/prefeitura/TelaPrefeitura";

export const metadata = {
  title: "Marcar como resolvido",
};

export default function PaginaPrefeitura() {
  return <TelaPrefeitura />;
}
