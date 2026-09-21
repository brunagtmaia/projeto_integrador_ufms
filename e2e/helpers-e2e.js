// =============================================================================
// Helpers dos testes E2E — check-out 4 · passo 06
// =============================================================================
// Funções só para os testes Playwright. A pessoa que usa o site não vê isso.
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

/**
 * Lê uma variável do arquivo `.env` na raiz do projeto (sem imprimir o valor).
 * Preferência: process.env (se alguém exportou no terminal) → depois o `.env`.
 *
 * @param {string} nome
 * @returns {string}
 */
export function lerEnv(nome) {
  const doProcesso = process.env[nome];
  if (typeof doProcesso === "string" && doProcesso.trim()) {
    return doProcesso.trim();
  }

  const caminho = path.join(process.cwd(), ".env");
  if (!existsSync(caminho)) {
    throw new Error(
      `Não achei a variável ${nome}. Copie .env.example para .env e configure (veja docs/12-checkout4-testes.md).`,
    );
  }

  const texto = readFileSync(caminho, "utf8");
  for (const linha of texto.split("\n")) {
    const limpa = linha.trim();
    if (!limpa || limpa.startsWith("#")) continue;
    const igual = limpa.indexOf("=");
    if (igual < 0) continue;
    const chave = limpa.slice(0, igual).trim();
    if (chave !== nome) continue;
    let valor = limpa.slice(igual + 1).trim();
    // Remove aspas simples ou duplas se existirem.
    if (
      (valor.startsWith('"') && valor.endsWith('"')) ||
      (valor.startsWith("'") && valor.endsWith("'"))
    ) {
      valor = valor.slice(1, -1);
    }
    if (!valor) {
      throw new Error(
        `A variável ${nome} está vazia no .env. Preencha antes de rodar npm run test:e2e.`,
      );
    }
    return valor;
  }

  throw new Error(
    `Não achei ${nome} no .env. Exemplo: ADMIN_PASSWORD="prefeitura"`,
  );
}

/**
 * Caminho da foto de fixture (≥ 2 KB — a API exige).
 */
export function caminhoFotoFixture() {
  return path.join(process.cwd(), "e2e", "fixtures", "foto-teste.jpg");
}

/**
 * Intercepta GET /api/geocode e devolve uma sugestão fixa.
 * Assim o teste NÃO depende da internet / Nominatim.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ label: string, lat: number, lng: number }} lugar
 */
export async function mockarGeocode(page, lugar) {
  await page.route("**/api/geocode**", async (rota) => {
    const url = new URL(rota.request().url());
    // Busca por texto (?q=...) — autocomplete do formulário.
    if (url.searchParams.has("q")) {
      await rota.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ok: true,
          resultados: [lugar],
        }),
      });
      return;
    }
    // Reverse (GPS → endereço) — se aparecer, também responde.
    await rota.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        label: lugar.label,
        lat: lugar.lat,
        lng: lugar.lng,
      }),
    });
  });
}
