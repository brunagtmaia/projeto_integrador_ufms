// =============================================================================
// Testes de lib/gerar-protocolo.js — check-out 4 · passo 02
// =============================================================================
// O que estamos testando?
//   A função que cria o número de protocolo (6 dígitos) antes de gravar
//   a denúncia. Ela consulta o banco para não repetir um id já usado.
//
// Por que usamos "mock"?
//   Mock = fingir o banco. Assim o teste NÃO precisa do arquivo
//   prisma/dev.db. A gente controla o que o Prisma “responde”.
//
// Como rodar:
//   npm test
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { beforeEach, describe, expect, it, vi } from "vitest";

// -----------------------------------------------------------------------------
// Mock do Prisma
// -----------------------------------------------------------------------------
// `vi.mock` precisa ficar no topo (o Vitest “sobe” isso automaticamente).
// Trocamos o módulo real por um objeto falso só com `findUnique`.
// -----------------------------------------------------------------------------
vi.mock("@/lib/prisma", () => ({
  prisma: {
    denuncia: {
      findUnique: vi.fn(),
    },
  },
}));

import { gerarProtocoloUnico } from "@/lib/gerar-protocolo";
import { prisma } from "@/lib/prisma";

describe("gerarProtocoloUnico", () => {
  beforeEach(() => {
    // Limpa o histórico do mock entre um teste e outro.
    vi.mocked(prisma.denuncia.findUnique).mockReset();
  });

  it("devolve um protocolo de 6 dígitos quando o banco está livre", async () => {
    // null = “não achou denúncia com esse id” → número livre.
    vi.mocked(prisma.denuncia.findUnique).mockResolvedValue(null);

    const protocolo = await gerarProtocoloUnico();

    expect(protocolo).toMatch(/^\d{6}$/);
    expect(prisma.denuncia.findUnique).toHaveBeenCalled();
  });

  it("tenta de novo se o primeiro número já existir", async () => {
    // 1ª chamada: “já existe” · 2ª: livre.
    vi.mocked(prisma.denuncia.findUnique)
      .mockResolvedValueOnce({ id: "000001" })
      .mockResolvedValueOnce(null);

    const protocolo = await gerarProtocoloUnico();

    expect(protocolo).toMatch(/^\d{6}$/);
    expect(prisma.denuncia.findUnique).toHaveBeenCalledTimes(2);
  });

  it("lança erro se não achar protocolo livre depois de várias tentativas", async () => {
    // Sempre “já existe” → a função desiste e avisa.
    vi.mocked(prisma.denuncia.findUnique).mockResolvedValue({
      id: "ocupado",
    });

    await expect(gerarProtocoloUnico()).rejects.toThrow(
      /protocolo único/i,
    );
  });
});
