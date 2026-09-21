// =============================================================================
// Setup dos testes de componentes — check-out 4 · passo 05
// =============================================================================
// O que é este arquivo?
//   Roda **antes** de cada arquivo de teste (configurado no vitest.config.mjs).
//   Aqui só ligamos os “matchers” extras do Testing Library, por exemplo:
//     expect(botao).toBeInTheDocument()
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import "@testing-library/jest-dom/vitest";
