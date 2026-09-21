// =============================================================================
// Testes de lib/fotos-denuncia.js — check-out 4 · passo 02
// =============================================================================
// O que estamos testando?
//   Funções pequenas que leem/gravam o campo `foto` da denúncia.
//   No banco pode ser:
//     - um caminho só: "/uploads/a.jpg"
//     - várias fotos em JSON: '["/uploads/a.jpg","/uploads/b.jpg"]'
//
// Por que testar isso?
//   O mapa, o acompanhar e a prefeitura usam essas funções. Se alguém
//   mudar a lógica e quebrar o formato antigo, o teste avisa.
//
// Como rodar:
//   npm test
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { describe, expect, it } from "vitest";

import {
  fotoPrincipal,
  listarFotos,
  serializarFotos,
} from "@/lib/fotos-denuncia";

describe("listarFotos", () => {
  it("devolve lista vazia quando não há foto", () => {
    expect(listarFotos(null)).toEqual([]);
    expect(listarFotos(undefined)).toEqual([]);
    expect(listarFotos("")).toEqual([]);
    expect(listarFotos("   ")).toEqual([]);
  });

  it("entende o formato antigo: um caminho só (texto)", () => {
    expect(listarFotos("/uploads/abc.jpg")).toEqual(["/uploads/abc.jpg"]);
  });

  it("entende várias fotos guardadas como JSON", () => {
    const campo = JSON.stringify([
      "/uploads/a.jpg",
      "/uploads/b.png",
    ]);

    expect(listarFotos(campo)).toEqual([
      "/uploads/a.jpg",
      "/uploads/b.png",
    ]);
  });

  it("ignora itens que não são texto dentro do JSON", () => {
    const campo = JSON.stringify([
      "/uploads/ok.jpg",
      123,
      null,
      "  ",
      "/uploads/outra.webp",
    ]);

    expect(listarFotos(campo)).toEqual([
      "/uploads/ok.jpg",
      "/uploads/outra.webp",
    ]);
  });

  it("se o JSON estiver quebrado, trata como caminho único", () => {
    // Começa com "[" mas não é JSON válido → cai no formato antigo.
    expect(listarFotos("[nao-e-json")).toEqual(["[nao-e-json"]);
  });
});

describe("fotoPrincipal", () => {
  it("devolve null quando não há foto", () => {
    expect(fotoPrincipal(null)).toBeNull();
    expect(fotoPrincipal("")).toBeNull();
  });

  it("devolve a única foto no formato antigo", () => {
    expect(fotoPrincipal("/uploads/unica.jpg")).toBe("/uploads/unica.jpg");
  });

  it("devolve a primeira foto quando há várias", () => {
    const campo = JSON.stringify([
      "/uploads/primeira.jpg",
      "/uploads/segunda.jpg",
    ]);

    expect(fotoPrincipal(campo)).toBe("/uploads/primeira.jpg");
  });
});

describe("serializarFotos", () => {
  it("devolve null quando a lista está vazia", () => {
    expect(serializarFotos([])).toBeNull();
    expect(serializarFotos(null)).toBeNull();
    expect(serializarFotos(undefined)).toBeNull();
  });

  it("grava um caminho só (sem JSON) quando há uma foto", () => {
    expect(serializarFotos(["/uploads/sozinha.jpg"])).toBe(
      "/uploads/sozinha.jpg",
    );
  });

  it("grava JSON quando há duas ou mais fotos", () => {
    const caminhos = ["/uploads/a.jpg", "/uploads/b.jpg"];
    expect(serializarFotos(caminhos)).toBe(JSON.stringify(caminhos));
  });

  it("ignora entradas vazias ou que não são texto", () => {
    expect(
      serializarFotos(["/uploads/ok.jpg", "", "   ", null, 42]),
    ).toBe("/uploads/ok.jpg");
  });

  it("ida e volta: serializar → listar devolve a mesma lista", () => {
    const originais = ["/uploads/1.jpg", "/uploads/2.jpg", "/uploads/3.png"];
    const gravado = serializarFotos(originais);

    expect(listarFotos(gravado)).toEqual(originais);
    expect(fotoPrincipal(gravado)).toBe("/uploads/1.jpg");
  });
});
