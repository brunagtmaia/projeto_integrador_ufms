// =============================================================================
// E2E — fluxo ponta a ponta do MVP (check-out 4 · passo 06)
// =============================================================================
// O que este arquivo testa?
//   1) Criar denúncia na tela /denuncia (endereço + foto + descrição)
//   2) Ver o protocolo na tela de sucesso
//   3) Acompanhar pelo protocolo
//   4) Entrar na prefeitura e marcar como resolvido
//   5) Confirmar no acompanhar que o status virou "Resolvido"
//
// Como rodar:
//   npm run test:e2e
//
// Precisa:
//   - arquivo .env com ADMIN_PASSWORD (igual ao do check-out 3)
//   - Chromium do Playwright instalado uma vez: npx playwright install chromium
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { test, expect } from "@playwright/test";
import {
  caminhoFotoFixture,
  lerEnv,
  mockarGeocode,
} from "./helpers-e2e.js";

/** Endereço fixo do mock (não depende do Nominatim). */
const LUGAR_E2E = {
  label: "Rua E2E Teste, 123 — Campo Grande, MS",
  lat: -20.4697,
  lng: -54.6201,
};

test.describe("Fluxo MVP: denunciar → acompanhar → prefeitura", () => {
  test("cria denúncia, consulta protocolo e marca como resolvido", async ({
    page,
  }) => {
    const senhaPrefeitura = lerEnv("ADMIN_PASSWORD");
    const descricaoUnica = `Mato alto E2E ${Date.now()}`;

    // ----- 1) Nova denúncia -----
    await mockarGeocode(page, LUGAR_E2E);
    await page.goto("/denuncia");

    await expect(
      page.getByRole("heading", { name: /realizar denúncia anônima/i }),
    ).toBeVisible();

    // Digite o endereço (pressSequentially dispara onChange do React).
    // O mock de /api/geocode devolve a sugestão → clique nela.
    const campoEndereco = page.locator("#campo-endereco");
    await campoEndereco.click();
    await campoEndereco.pressSequentially("Rua E2E Teste", { delay: 40 });
    await page
      .getByRole("option", { name: LUGAR_E2E.label })
      .click({ timeout: 15_000 });

    await expect(page.getByText("Localização pronta para o mapa.")).toBeVisible();

    // Foto: o input fica escondido; o Playwright ainda consegue enviar o arquivo.
    await page.locator('input[type="file"]').setInputFiles(caminhoFotoFixture());
    await expect(page.getByText("1 / 1")).toBeVisible();

    await page.locator("#campo-descricao").fill(descricaoUnica);

    await page.getByRole("button", { name: /enviar denúncia/i }).click();

    // ----- 2) Tela de sucesso com protocolo -----
    await expect(page).toHaveURL(/\/denuncia\/sucesso\?protocolo=/, {
      timeout: 30_000,
    });
    await expect(
      page.getByRole("heading", { name: /protocolo gerado/i }),
    ).toBeVisible();

    const urlSucesso = new URL(page.url());
    const protocolo = urlSucesso.searchParams.get("protocolo");
    expect(protocolo).toBeTruthy();
    expect(protocolo).toMatch(/^\d{6}$/);

    await expect(page.getByText(protocolo, { exact: true })).toBeVisible();

    // ----- 3) Acompanhar -----
    await page.getByRole("link", { name: /acompanhar/i }).first().click();
    await expect(page).toHaveURL(new RegExp(`/acompanhar\\?protocolo=${protocolo}`));

    // A URL já preenche o campo; ainda precisamos clicar em Buscar.
    await page.getByRole("button", { name: /^buscar$/i }).click();

    const resultado = page.getByRole("region", {
      name: /resultado da consulta/i,
    });
    await expect(resultado).toBeVisible({ timeout: 15_000 });
    await expect(resultado.getByText(protocolo, { exact: true })).toBeVisible();
    await expect(resultado.getByText(LUGAR_E2E.label)).toBeVisible();
    await expect(resultado.getByText(descricaoUnica)).toBeVisible();
    await expect(resultado.getByText("Pendente")).toBeVisible();

    // ----- 4) Prefeitura: senha + marcar resolvido -----
    await page.goto("/prefeitura");
    await page.locator("#campo-senha-prefeitura").fill(senhaPrefeitura);
    await page.getByRole("button", { name: /^entrar$/i }).click();

    // Lista de pendentes (pode demorar um pouco o GET).
    const listaPendentes = page.getByRole("list", {
      name: /denúncias pendentes/i,
    });
    await expect(listaPendentes).toBeVisible({ timeout: 15_000 });

    // Acha o card pelo texto da descrição única e clica em resolver.
    const card = listaPendentes.locator("li").filter({
      hasText: descricaoUnica,
    });
    await expect(card).toBeVisible();
    await card.getByRole("button", { name: /marcar como resolvido/i }).click();

    // Depois de resolver, o item some da lista de pendentes.
    await expect(card).toHaveCount(0, { timeout: 15_000 });

    // ----- 5) Acompanhar de novo: status Resolvido -----
    await page.goto(`/acompanhar?protocolo=${protocolo}`);
    await page.getByRole("button", { name: /^buscar$/i }).click();

    const resultadoFinal = page.getByRole("region", {
      name: /resultado da consulta/i,
    });
    await expect(resultadoFinal).toBeVisible({ timeout: 15_000 });
    await expect(resultadoFinal.getByText("Resolvido")).toBeVisible();
  });
});
