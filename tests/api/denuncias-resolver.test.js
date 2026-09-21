// =============================================================================
// Testes PATCH /api/denuncias/[id]/resolver — check-out 4 · passo 04
// =============================================================================
// O que estamos testando?
//   A função PATCH da rota app/api/denuncias/[id]/resolver/route.js.
//   É o que a tela /prefeitura chama ao marcar uma denúncia como resolvida.
//
// Casos principais (em português):
//   - senha correta → status vira RESOLVIDO (200)
//   - senha errada → 401 (não autorizado)
//   - protocolo que não existe → 404
//   - sem senha / JSON inválido → 400
//   - já estava RESOLVIDO → 200 de novo (idempotente, com aviso)
//
// O que fingimos (mock)?
//   - Prisma (findUnique + update) — não usa o prisma/dev.db
//   - process.env.ADMIN_PASSWORD — senha fixa só neste arquivo de teste
//
// Como rodar:
//   npm test
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { denunciaExemplo, lerJson } from "./helpers-api.js";

// -----------------------------------------------------------------------------
// Mock do Prisma (precisa ficar no topo, antes do import da rota)
// -----------------------------------------------------------------------------
vi.mock("@/lib/prisma", () => ({
  prisma: {
    denuncia: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import { PATCH } from "@/app/api/denuncias/[id]/resolver/route";
import { prisma } from "@/lib/prisma";

/** Senha que os testes usam como se fosse a do arquivo .env. */
const SENHA_TESTE = "prefeitura-teste";

/**
 * No Next.js 16, `params` chega como Promise.
 * Ex.: URL /api/denuncias/482913/resolver → id = "482913"
 * @param {string} id
 */
function contextoComId(id) {
  return { params: Promise.resolve({ id }) };
}

/**
 * Monta um Request PATCH com JSON no corpo (igual ao fetch da tela).
 * @param {unknown} corpo
 */
function requestPatch(corpo) {
  return new Request("http://localhost:3000/api/denuncias/482913/resolver", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo),
  });
}

describe("PATCH /api/denuncias/[id]/resolver", () => {
  beforeEach(() => {
    // Cada teste começa com a senha “do servidor” conhecida.
    process.env.ADMIN_PASSWORD = SENHA_TESTE;

    vi.mocked(prisma.denuncia.findUnique).mockReset();
    vi.mocked(prisma.denuncia.update).mockReset();
  });

  afterEach(() => {
    // Não deixa a senha de teste vazar para outros arquivos da suite.
    delete process.env.ADMIN_PASSWORD;
  });

  it("marca como RESOLVIDO quando a senha está correta", async () => {
    const pendente = denunciaExemplo({ id: "482913", status: "PENDENTE" });
    const resolvida = denunciaExemplo({ id: "482913", status: "RESOLVIDO" });

    vi.mocked(prisma.denuncia.findUnique).mockResolvedValue(pendente);
    vi.mocked(prisma.denuncia.update).mockResolvedValue(resolvida);

    const response = await PATCH(
      requestPatch({ senha: SENHA_TESTE }),
      contextoComId("482913"),
    );
    const corpo = await lerJson(response);

    expect(response.status).toBe(200);
    expect(corpo.ok).toBe(true);
    expect(corpo.denuncia.id).toBe("482913");
    expect(corpo.denuncia.status).toBe("RESOLVIDO");
    expect(prisma.denuncia.update).toHaveBeenCalledWith({
      where: { id: "482913" },
      data: { status: "RESOLVIDO" },
    });
  });

  it("devolve 401 quando a senha está errada", async () => {
    const response = await PATCH(
      requestPatch({ senha: "senha-errada" }),
      contextoComId("482913"),
    );
    const corpo = await lerJson(response);

    expect(response.status).toBe(401);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/senha incorreta/i);
    // Com senha errada, a API nem consulta o banco (não vaza se o id existe).
    expect(prisma.denuncia.findUnique).not.toHaveBeenCalled();
    expect(prisma.denuncia.update).not.toHaveBeenCalled();
  });

  it("devolve 404 quando o protocolo não existe (senha ok)", async () => {
    vi.mocked(prisma.denuncia.findUnique).mockResolvedValue(null);

    const response = await PATCH(
      requestPatch({ senha: SENHA_TESTE }),
      contextoComId("999999"),
    );
    const corpo = await lerJson(response);

    expect(response.status).toBe(404);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/não achamos/i);
    expect(prisma.denuncia.update).not.toHaveBeenCalled();
  });

  it("devolve 400 quando faltou a senha no JSON", async () => {
    const response = await PATCH(
      requestPatch({}),
      contextoComId("482913"),
    );
    const corpo = await lerJson(response);

    expect(response.status).toBe(400);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/senha/i);
    expect(prisma.denuncia.findUnique).not.toHaveBeenCalled();
  });

  it("devolve 400 quando o corpo não é JSON válido", async () => {
    const request = new Request(
      "http://localhost:3000/api/denuncias/482913/resolver",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: "isto-nao-e-json",
      },
    );

    const response = await PATCH(request, contextoComId("482913"));
    const corpo = await lerJson(response);

    expect(response.status).toBe(400);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/json/i);
  });

  it("devolve 200 com aviso se a denúncia já estava RESOLVIDO", async () => {
    const jaResolvida = denunciaExemplo({
      id: "482913",
      status: "RESOLVIDO",
    });
    vi.mocked(prisma.denuncia.findUnique).mockResolvedValue(jaResolvida);

    const response = await PATCH(
      requestPatch({ senha: SENHA_TESTE }),
      contextoComId("482913"),
    );
    const corpo = await lerJson(response);

    expect(response.status).toBe(200);
    expect(corpo.ok).toBe(true);
    expect(corpo.denuncia.status).toBe("RESOLVIDO");
    expect(corpo.aviso).toMatch(/já estava/i);
    // Não precisa chamar update de novo (idempotente).
    expect(prisma.denuncia.update).not.toHaveBeenCalled();
  });

  it("devolve 500 quando ADMIN_PASSWORD não está no ambiente", async () => {
    delete process.env.ADMIN_PASSWORD;

    const response = await PATCH(
      requestPatch({ senha: "qualquer" }),
      contextoComId("482913"),
    );
    const corpo = await lerJson(response);

    expect(response.status).toBe(500);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/não está configurada/i);
    expect(prisma.denuncia.findUnique).not.toHaveBeenCalled();
  });
});
