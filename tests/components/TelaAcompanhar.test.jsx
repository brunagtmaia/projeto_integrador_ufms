/** @vitest-environment jsdom */
// =============================================================================
// Testes da tela /acompanhar — check-out 4 · passo 05 (Testing Library)
// =============================================================================
// O que estamos testando?
//   O componente React `TelaAcompanhar` (botões, textos e estados).
//   NÃO chamamos a API de verdade — o `fetch` é **mockado** (fingido).
//
// Por quê?
//   Os passos 03–04 já provaram que a API funciona.
//   Aqui conferimos se a **tela** reage certo: encontrado, não encontrado, etc.
//
// Precisa do `npm run dev`?
//   Não. O Vitest monta o componente no jsdom (navegador falso).
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import TelaAcompanhar from "@/components/acompanhar/TelaAcompanhar";

import { denunciaNaTela, respostaJson } from "./helpers-telas";

// ---- Mocks do Next.js (a tela importa Link e useSearchParams) ----

/** Protocolo que a “URL” teria em ?protocolo=... (vazio = nenhuma). */
let protocoloNaUrlFake = "";

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (chave) => (chave === "protocolo" ? protocoloNaUrlFake : null),
  }),
}));

// Link do Next vira um <a> simples — basta para o teste.
vi.mock("next/link", () => ({
  default: ({ children, href, ...resto }) => (
    <a href={href} {...resto}>
      {children}
    </a>
  ),
}));

describe("TelaAcompanhar (Testing Library)", () => {
  beforeEach(() => {
    protocoloNaUrlFake = "";
    // Cada teste começa com fetch limpo.
    global.fetch = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("mostra o formulário de consulta no estado inicial", () => {
    render(<TelaAcompanhar />);

    expect(
      screen.getByRole("heading", { name: /acompanhar denúncia/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/número do protocolo/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
  });

  it("não chama a API se o protocolo estiver vazio", async () => {
    const user = userEvent.setup();
    render(<TelaAcompanhar />);

    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("mostra a denúncia quando a API encontra o protocolo", async () => {
    const user = userEvent.setup();
    const denuncia = denunciaNaTela();

    global.fetch.mockResolvedValueOnce(
      respostaJson({ ok: true, denuncia }, 200),
    );

    render(<TelaAcompanhar />);

    await user.type(
      screen.getByLabelText(/número do protocolo/i),
      "482913",
    );
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    // Espera a tela sair do “carregando” e mostrar o resultado.
    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: /resultado da consulta/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("482913")).toBeInTheDocument();
    expect(screen.getByText(denuncia.endereco)).toBeInTheDocument();
    expect(screen.getByText(/pendente/i)).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/denuncias?protocolo=482913",
    );
  });

  it("mostra 'não achamos' quando a API devolve 404", async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce(
      respostaJson({ ok: false, erro: "Não achamos." }, 404),
    );

    render(<TelaAcompanhar />);

    await user.type(
      screen.getByLabelText(/número do protocolo/i),
      "999999",
    );
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /não achamos esse protocolo/i }),
      ).toBeInTheDocument();
    });
  });

  it("mostra erro amigável quando a rede falha", async () => {
    const user = userEvent.setup();

    global.fetch.mockRejectedValueOnce(new Error("rede offline"));

    render(<TelaAcompanhar />);

    await user.type(
      screen.getByLabelText(/número do protocolo/i),
      "482913",
    );
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /não foi possível consultar/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByRole("alert")).toHaveTextContent(/falha de rede/i);
  });

  it("preenche o campo quando a URL já traz ?protocolo=", () => {
    protocoloNaUrlFake = "125172";

    render(<TelaAcompanhar />);

    expect(screen.getByLabelText(/número do protocolo/i)).toHaveValue("125172");
  });
});
