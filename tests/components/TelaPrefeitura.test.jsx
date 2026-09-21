/** @vitest-environment jsdom */
// =============================================================================
// Testes da tela /prefeitura — check-out 4 · passo 05 (Testing Library)
// =============================================================================
// O que estamos testando?
//   O componente React `TelaPrefeitura` (senha, lista, marcar resolvido).
//   O `fetch` é **mockado** — não usa `.env` nem `dev.db`.
//
// Lembrete de como a tela valida a senha (check-out 3 · passo 12):
//   1) PATCH com protocolo fictício "__teste_senha__"
//      - 401 → senha errada
//      - 404 → senha certa (protocolo de teste não existe — esperado)
//   2) GET /api/denuncias → filtra só PENDENTE
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import TelaPrefeitura from "@/components/prefeitura/TelaPrefeitura";

import { denunciaNaTela, respostaJson } from "./helpers-telas";

vi.mock("next/link", () => ({
  default: ({ children, href, ...resto }) => (
    <a href={href} {...resto}>
      {children}
    </a>
  ),
}));

describe("TelaPrefeitura (Testing Library)", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("mostra o formulário de senha no estado inicial", () => {
    render(<TelaPrefeitura />);

    expect(
      screen.getByRole("heading", { name: /marcar como resolvido/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("pede a senha se o campo estiver vazio", async () => {
    const user = userEvent.setup();
    render(<TelaPrefeitura />);

    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      /digite a senha da prefeitura/i,
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("mostra erro quando a senha está incorreta (401)", async () => {
    const user = userEvent.setup();

    global.fetch.mockResolvedValueOnce(
      respostaJson({ ok: false, erro: "Senha incorreta." }, 401),
    );

    render(<TelaPrefeitura />);

    await user.type(screen.getByLabelText(/^senha$/i), "errada");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/senha incorreta/i);
    });

    // Continua na tela de senha (não mostra lista).
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: /denúncias pendentes/i }),
    ).not.toBeInTheDocument();
  });

  it("entra e lista pendentes quando a senha está correta", async () => {
    const user = userEvent.setup();
    const pendente = denunciaNaTela({ id: "482913", status: "PENDENTE" });
    const resolvida = denunciaNaTela({
      id: "111111",
      status: "RESOLVIDO",
      endereco: "Rua Já Resolvida, 1",
    });

    // 1º fetch: PATCH de teste da senha → 404 = senha ok
    global.fetch.mockResolvedValueOnce(
      respostaJson({ ok: false, erro: "Não achamos." }, 404),
    );
    // 2º fetch: GET lista
    global.fetch.mockResolvedValueOnce(
      respostaJson({ ok: true, denuncias: [pendente, resolvida] }, 200),
    );

    render(<TelaPrefeitura />);

    await user.type(screen.getByLabelText(/^senha$/i), "prefeitura-teste");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("list", { name: /denúncias pendentes/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("482913")).toBeInTheDocument();
    expect(screen.getByText(pendente.endereco)).toBeInTheDocument();
    // Resolvida não entra na lista de pendentes.
    expect(screen.queryByText("111111")).not.toBeInTheDocument();
    // O contador "1 pendente" vem partido em <span>1</span> + texto — por isso
    // usamos textContent do parágrafo (não getByText(/1 pendente/)).
    expect(
      screen.getByText((_, elemento) => {
        if (elemento?.tagName !== "P") return false;
        const texto = elemento.textContent?.replace(/\s+/g, " ").trim();
        return texto === "1 pendente";
      }),
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "/api/denuncias/__teste_senha__/resolver",
      expect.objectContaining({ method: "PATCH" }),
    );
    expect(global.fetch).toHaveBeenNthCalledWith(2, "/api/denuncias");
  });

  it("remove o item da lista ao marcar como resolvido", async () => {
    const user = userEvent.setup();
    const pendente = denunciaNaTela({ id: "482913" });

    // Login: senha ok + lista com 1 pendente
    global.fetch
      .mockResolvedValueOnce(
        respostaJson({ ok: false, erro: "Não achamos." }, 404),
      )
      .mockResolvedValueOnce(
        respostaJson({ ok: true, denuncias: [pendente] }, 200),
      );

    render(<TelaPrefeitura />);

    await user.type(screen.getByLabelText(/^senha$/i), "prefeitura-teste");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText("482913")).toBeInTheDocument();
    });

    // 3º fetch: PATCH resolver de verdade
    global.fetch.mockResolvedValueOnce(
      respostaJson({
        ok: true,
        denuncia: { ...pendente, status: "RESOLVIDO" },
      }, 200),
    );

    await user.click(
      screen.getByRole("button", { name: /marcar como resolvido/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /nenhuma pendente/i }),
      ).toBeInTheDocument();
    });

    expect(screen.queryByText("482913")).not.toBeInTheDocument();
  });
});
