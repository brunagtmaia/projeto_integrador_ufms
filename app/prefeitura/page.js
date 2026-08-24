// Rota: /prefeitura
// Pasta app/prefeitura + page.js = URL /prefeitura.
//
// MVP: marcar denúncia como resolvido.
// NÃO é um sistema de usuários (cadastro/login). A ideia é uma senha
// de "prefeitura" no arquivo .env (ADMIN_PASSWORD).
// Esta pasta só cria a URL; a senha e o botão "resolvido" vêm depois.

import PlaceholderTela from "../../components/PlaceholderTela";

export const metadata = {
  title: "Marcar como resolvido",
};

export default function PaginaPrefeitura() {
  return (
    <PlaceholderTela
      titulo="Marcar como resolvido"
      descricao="Tela da prefeitura: senha no .env, sem sistema de usuários."
    />
  );
}
