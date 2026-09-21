// =============================================================================
// Smoke test — check-out 4 · passo 01
// =============================================================================
// O que é um "smoke test"?
//   Um teste bem simples só para conferir que a ferramenta de testes
//   (Vitest) está instalada e o comando `npm test` funciona.
//
// Não testa a API nem as telas ainda — isso vem nos próximos passos.
//
// Como rodar:
//   npm test
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { describe, expect, it } from "vitest";

describe("passo 01 — Vitest configurado", () => {
  it("roda um teste simples (smoke)", () => {
    expect(1 + 1).toBe(2);
  });

  it("consegue importar o atalho @/ (jsconfig / alias)", async () => {
    // Confere que o alias "@" do vitest.config.mjs aponta para a raiz.
    // Se este import quebrar, a config do Vitest está incompleta.
    const fotos = await import("@/lib/fotos-denuncia");
    expect(typeof fotos.listarFotos).toBe("function");
  });
});
