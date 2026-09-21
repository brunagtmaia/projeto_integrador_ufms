// =============================================================================
// Helpers compartilhados dos testes de API — check-out 4 · passo 03
// =============================================================================
// O que é este arquivo?
//   Funções pequenas só para os testes. Elas NÃO fazem parte do app
//   (a pessoa que usa o site nunca vê isso). Servem para:
//     - montar um objeto “denúncia” parecido com o do banco;
//     - criar um arquivo de foto falso (grande o bastante para a API aceitar).
//
// Por que a foto precisa ter tamanho mínimo?
//   A API rejeita arquivos menores que 2 KB (evita “fotos” de 1 pixel).
//   Nos testes usamos 3 KB de bytes fictícios — não precisa ser uma
//   imagem real; a rota só confere tamanho e extensão (.jpg, .png…).
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

/**
 * Monta um objeto no formato que o Prisma devolveria.
 * @param {Partial<Record<string, unknown>>} [extras]
 */
export function denunciaExemplo(extras = {}) {
  const agora = new Date("2026-03-15T12:00:00.000Z");

  return {
    id: "482913",
    endereco: "Rua das Flores, 100 — Centro",
    descricao: "Mato alto no lote vago.",
    status: "PENDENTE",
    lat: -20.4697,
    lng: -54.6201,
    foto: "/uploads/exemplo.jpg",
    createdAt: agora,
    updatedAt: agora,
    ...extras,
  };
}

/**
 * Cria um File falso de ~3 KB com nome .jpg (a API aceita).
 * @param {string} [nome]
 */
export function fotoFakeValida(nome = "foto-teste.jpg") {
  // 3 KB > limite mínimo de 2 KB da rota POST.
  const bytes = new Uint8Array(3 * 1024);
  bytes[0] = 0xff;
  bytes[1] = 0xd8;
  bytes[2] = 0xff;

  return new File([bytes], nome, { type: "image/jpeg" });
}

/**
 * Lê o corpo JSON de uma Response (atalho para os expects).
 * @param {Response} response
 */
export async function lerJson(response) {
  return response.json();
}
