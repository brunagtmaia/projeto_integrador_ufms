// =============================================================================
// Helpers dos testes de tela — check-out 4 · passo 05
// =============================================================================
// O que é este arquivo?
//   Atalhos só para os testes de componentes. NÃO faz parte do app.
//   Ajuda a:
//     - montar uma resposta falsa do fetch (como se fosse a API);
//     - criar um objeto denúncia no formato que as telas esperam.
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

/**
 * Objeto denúncia no formato que a API devolve ao front
 * (depois de denunciaParaJson — com fotos em lista).
 * @param {Partial<Record<string, unknown>>} [extras]
 */
export function denunciaNaTela(extras = {}) {
  return {
    id: "482913",
    endereco: "Rua das Flores, 100 — Centro",
    descricao: "Mato alto no lote vago.",
    status: "PENDENTE",
    lat: -20.4697,
    lng: -54.6201,
    foto: "/uploads/exemplo.jpg",
    fotos: ["/uploads/exemplo.jpg"],
    createdAt: "2026-03-15T12:00:00.000Z",
    updatedAt: "2026-03-15T12:00:00.000Z",
    ...extras,
  };
}

/**
 * Monta uma Response falsa para o mock do fetch.
 * @param {unknown} corpo
 * @param {number} [status=200]
 */
export function respostaJson(corpo, status = 200) {
  return new Response(JSON.stringify(corpo), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
