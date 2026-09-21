// =============================================================================
// Configuração do Playwright — check-out 4 · passo 06
// =============================================================================
// O que é este arquivo?
//   Diz ao Playwright **como** rodar os testes E2E (no navegador de verdade):
//   - onde estão os arquivos (`e2e/`);
//   - qual URL base (http://127.0.0.1:3000);
//   - como ligar o `npm run dev` sozinho antes dos testes.
//
// Diferença do Vitest:
//   Vitest (`npm test`) = testes rápidos sem abrir Chrome.
//   Playwright (`npm run test:e2e`) = abre o Chromium e clica como uma pessoa.
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Pasta dos testes E2E (não misturar com tests/ do Vitest).
  testDir: "./e2e",

  // Um worker só: o SQLite (dev.db) não gosta de dois testes gravando ao mesmo tempo.
  fullyParallel: false,
  workers: 1,

  // Se um teste falhar, não tenta de novo sozinho (mais fácil de entender o erro).
  retries: 0,

  // Relatório simples no terminal (bom para iniciantes).
  reporter: "list",

  use: {
    // Use "localhost" (não 127.0.0.1): o Next 16 bloqueia scripts
    // cross-origin no modo dev se a origem for só o IP.
    baseURL: "http://localhost:3000",
    // Se falhar, guarda um “filme” do que aconteceu (útil para depurar).
    trace: "on-first-retry",
    // Captura de tela só quando o teste falha.
    screenshot: "only-on-failure",
  },

  // Só Chromium no MVP — mais leve para o grupo instalar.
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Antes dos testes: sobe o Next.js. Se você já tiver `npm run dev` ligado,
  // ele reaproveita (reuseExistingServer) — não precisa matar o terminal.
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
