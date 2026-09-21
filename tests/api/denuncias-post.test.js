// =============================================================================
// Testes POST /api/denuncias — check-out 4 · passo 03
// =============================================================================
// O que estamos testando?
//   A função POST da rota app/api/denuncias/route.js.
//   É o que a tela /denuncia chama ao enviar o formulário.
//
// O que fingimos (mock)?
//   - Prisma (create) — não grava no dev.db
//   - gerarProtocoloUnico — devolve um número fixo (ex.: "482913")
//   - fs (mkdir / writeFile) — não salva arquivo em public/uploads
//
// Como rodar:
//   npm test
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  denunciaExemplo,
  fotoFakeValida,
  lerJson,
} from "./helpers-api.js";

// -----------------------------------------------------------------------------
// Mocks (sempre no topo, antes de importar a rota)
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

vi.mock("@/lib/gerar-protocolo", () => ({
  gerarProtocoloUnico: vi.fn(),
}));

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn().mockResolvedValue(undefined),
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "@/app/api/denuncias/route";
import { gerarProtocoloUnico } from "@/lib/gerar-protocolo";
import { prisma } from "@/lib/prisma";
import { mkdir, writeFile } from "node:fs/promises";

/**
 * Monta um Request POST com FormData (igual ao navegador / formulário).
 * @param {Record<string, string | File | null | undefined>} campos
 */
function requestPost(campos) {
  const formData = new FormData();

  for (const [nome, valor] of Object.entries(campos)) {
    if (valor === null || valor === undefined) continue;
    formData.set(nome, valor);
  }

  return new Request("http://localhost:3000/api/denuncias", {
    method: "POST",
    body: formData,
  });
}

/** Campos mínimos válidos do formulário (ainda sem foto). */
function camposBase() {
  return {
    endereco: "Rua das Flores, 100 — Centro",
    descricao: "Mato alto no lote vago.",
    lat: "-20.4697",
    lng: "-54.6201",
  };
}

describe("POST /api/denuncias", () => {
  beforeEach(() => {
    vi.mocked(prisma.denuncia.create).mockReset();
    vi.mocked(gerarProtocoloUnico).mockReset();
    vi.mocked(mkdir).mockClear();
    vi.mocked(writeFile).mockClear();

    vi.mocked(gerarProtocoloUnico).mockResolvedValue("482913");
  });

  it("cria denúncia válida e devolve 201 com protocolo", async () => {
    const criada = denunciaExemplo({
      id: "482913",
      foto: "/uploads/qualquer.jpg",
    });
    vi.mocked(prisma.denuncia.create).mockResolvedValue(criada);

    const response = await POST(
      requestPost({
        ...camposBase(),
        foto: fotoFakeValida(),
      }),
    );
    const corpo = await lerJson(response);

    expect(response.status).toBe(201);
    expect(corpo.ok).toBe(true);
    expect(corpo.protocolo).toBe("482913");
    expect(corpo.id).toBe("482913");
    expect(corpo.denuncia.status).toBe("PENDENTE");

    // Protocolo foi pedido e a denúncia foi gravada.
    expect(gerarProtocoloUnico).toHaveBeenCalled();
    expect(prisma.denuncia.create).toHaveBeenCalled();

    // Pasta e arquivo “salvos” (mock — não escreve no disco de verdade).
    expect(mkdir).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalled();

    // Conferimos o que o Prisma recebeu (campos principais).
    const argumentoCreate = vi.mocked(prisma.denuncia.create).mock.calls[0][0];
    expect(argumentoCreate.data.id).toBe("482913");
    expect(argumentoCreate.data.endereco).toBe("Rua das Flores, 100 — Centro");
    expect(argumentoCreate.data.status).toBe("PENDENTE");
    expect(argumentoCreate.data.lat).toBe(-20.4697);
    expect(argumentoCreate.data.lng).toBe(-54.6201);
    expect(argumentoCreate.data.foto).toMatch(/^\/uploads\//);
  });

  it("devolve 400 se faltar o endereço", async () => {
    const response = await POST(
      requestPost({
        ...camposBase(),
        endereco: "",
        foto: fotoFakeValida(),
      }),
    );
    const corpo = await lerJson(response);

    expect(response.status).toBe(400);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/endereço/i);
    expect(prisma.denuncia.create).not.toHaveBeenCalled();
  });

  it("devolve 400 se faltar a descrição", async () => {
    const response = await POST(
      requestPost({
        ...camposBase(),
        descricao: "   ",
        foto: fotoFakeValida(),
      }),
    );
    const corpo = await lerJson(response);

    expect(response.status).toBe(400);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/descrição/i);
    expect(prisma.denuncia.create).not.toHaveBeenCalled();
  });

  it("devolve 400 se faltar latitude ou longitude", async () => {
    const semLat = await POST(
      requestPost({
        ...camposBase(),
        lat: "",
        foto: fotoFakeValida(),
      }),
    );
    expect(semLat.status).toBe(400);
    expect((await lerJson(semLat)).erro).toMatch(/latitude/i);

    const semLng = await POST(
      requestPost({
        ...camposBase(),
        lng: "nao-e-numero",
        foto: fotoFakeValida(),
      }),
    );
    expect(semLng.status).toBe(400);
    expect((await lerJson(semLng)).erro).toMatch(/longitude/i);

    expect(prisma.denuncia.create).not.toHaveBeenCalled();
  });

  it("devolve 400 se não enviar foto", async () => {
    const response = await POST(requestPost(camposBase()));
    const corpo = await lerJson(response);

    expect(response.status).toBe(400);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/foto/i);
    expect(prisma.denuncia.create).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
  });

  it("devolve 400 se a foto for pequena demais", async () => {
    // 100 bytes < 2 KB → a API recusa.
    const fotoMinuscua = new File([new Uint8Array(100)], "minima.jpg", {
      type: "image/jpeg",
    });

    const response = await POST(
      requestPost({
        ...camposBase(),
        foto: fotoMinuscua,
      }),
    );
    const corpo = await lerJson(response);

    expect(response.status).toBe(400);
    expect(corpo.ok).toBe(false);
    expect(corpo.erro).toMatch(/pequena|inválida/i);
    expect(prisma.denuncia.create).not.toHaveBeenCalled();
  });
});
