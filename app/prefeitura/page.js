// =============================================================================
// PÁGINA /prefeitura
// =============================================================================
// Pasta app/prefeitura + page.js = URL /prefeitura
//
// MVP: marcar denúncia como resolvido.
// NÃO é um sistema de usuários (cadastro/login). No check-out 2 a senha de
// teste é "prefeitura" (só no front). No check-out 3 vira ADMIN_PASSWORD no .env.
//
// A interação fica em components/prefeitura/TelaPrefeitura.js (cliente).
// =============================================================================

import TelaPrefeitura from "../../components/prefeitura/TelaPrefeitura";

export const metadata = {
  title: "Marcar como resolvido",
};

export default function PaginaPrefeitura() {
  return <TelaPrefeitura />;
}
