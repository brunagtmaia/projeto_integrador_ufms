// =============================================================================
// Testes GET /api/denuncias — check-out 4 · passo 03
// =============================================================================
// O que estamos testando?
//   A função GET da rota app/api/denuncias/route.js.
//   Ela tem dois modos:
//     1) Sem ?protocolo=     → lista todas (mapa / prefeitura)
//     2) Com ?protocolo=123  → busca uma (tela acompanhar)
//
// Por que usamos mock?
//   Mock = fingir o banco. Assim NÃO precisamos do prisma/dev.db ligado.
//   Controlamos o que o Prisma “responde” e só conferimos a lógica da API.
//
// Como rodar:
//   npm test
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { beforeEach, describe, expect, it, vi } from "vitest";

import { denunciaExemplo, lerJson } from "./helpers-api.js";

// -----------------------------------------------------------------------------
// Mock do Prisma (precisa ficar no topo, antes do import da rota)
// -----------------------------------------------------------------------------
vi.mock("@/lib/prisma", () => ({
  prisma: {
    denuncia: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

import { GET } from "@/app/api/denuncias/route";
import { prisma } from "@/lib/prisma";

describe("GET /api/denuncias", () => {
  beforeEach(() => {
    vi.mocked(prisma.denuncia.findUnique).mockReset();
    vi.mocked(prisma.denuncia.findMany).mockReset();
  });

  it("lista todas as denúncias quando não vem protocolo", async () => {
    const lista = [
      denunciaExemplo({ id: "111111" }),
      denunciaExemplo({ id: "222222", status: "RESOLVIDO" }),
    ];
    vi.mocked(prisma.denuncia.findMany).mockResolvedValue(lista);

    const request = new Request("http://localhost:3000/api/denuncias");
    const response = await GET(request);
    const corpo = await lerJson(response);

    expect(response.status).toBe(200);
    expect(corpo.ok).toBe(true);
    expect(corpo.denuncias).toHaveLength(2);
    expect(corpo.denuncias[0].id).toBe("111111");
    expect(corpo.denuncias[0].foto).toBe("/uploads/exemplo.jpg");
    expect(corpo.denuncias[0].fotos).toEqual(["/uploads/exemplo.jpg"]);
    expect(prisma.denuncia.findMany).toHaveBeenCalled();
  });

  it("busca uma denúncia pelo protocolo", async () => {
    const uma = denunciaExemplo({ id: "125172" });
    vi.mocked(prisma.denuncia.findUnique).mockResolvedValue(uma);

    const request = new Request(
      "http://localhost:3000/api/denuncias?protocolo=125172",
    );
    const response = await GET(request);
    const corpo = await lerJson(response);

    expect(response.status).toBe(200);
    expect(corpo.ok).toBe(true);
    expect(corpo.denuncia.id).toBe("125172");
    expect(corpo.denuncia.endereco).toBe("Rua das Flores, 100 — Centro");
    expect(prisma.denuncia.findUnique).toHaveBeenCalledWith({
      where: { id: "125172" },
    });
  });

  it("devolve 404 quando o protocolo não existe", async () => {
    vi.mocked(prisma.denuncia.findUnique).mockResolvedValue(null);

    const request = new Request(
      "http://localhost:3000/api/denuncias?protocolo=999999",
    );
    const response = await GET(request);
    const corpo = await lerJson(response);

    expect(response.status).toBe(404);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/não achamos/i);
  });

  it("devolve 400 quando o protocolo veio vazio", async () => {
    const request = new Request(
      "http://localhost:3000/api/denuncias?protocolo=%20%20",
    );
    const response = await GET(request);
    const corpo = await lerJson(response);

    expect(response.status).toBe(400);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/protocolo/i);
    // Nem tenta ir ao banco se o protocolo está em branco.
    expect(prisma.denuncia.findUnique).not.toHaveBeenCalled();
  });
});
