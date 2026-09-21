// =============================================================================
// Configuração do Vitest (check-out 4 · passos 01 e 05)
// =============================================================================
// O que é este arquivo?
//   Diz ao Vitest **como** rodar os testes: onde procurar arquivos, qual
//   ambiente usar e como entender o atalho `@/` (igual ao Next.js).
//
// Ambientes:
//   - Node  → testes de unit/ e api/ (sem tela React)
//   - jsdom → testes de components/ (simula o navegador para Testing Library)
//
// Por que Babel nos componentes .js?
//   O app guarda telas em arquivos `.js` com JSX (padrão Next). O Vite 8
//   (oxc) só aceita JSX “de fábrica” em `.jsx`. Nos testes, um plugin
//   pequeno converte o JSX dos componentes **antes** do oxc ler o arquivo.
//   Você **não** precisa renomear as telas do app.
//
// Guia: docs/12-checkout4-testes.md
// =============================================================================

import path from "node:path";
import { fileURLToPath } from "node:url";

import * as babel from "@babel/core";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

/** Pasta raiz do projeto (onde está o package.json). */
const raizDoProjeto = path.dirname(fileURLToPath(import.meta.url));

/**
 * Converte JSX em arquivos .js dentro de components/ para o Vitest conseguir
 * importar as telas do app sem renomear nada para .jsx.
 */
function jsxNosComponentesJs() {
  return {
    name: "jsx-nos-componentes-js",
    enforce: "pre",
    transform(codigo, id) {
      const ehComponenteJs =
        !id.includes("node_modules") &&
        id.endsWith(".js") &&
        (id.includes(`${path.sep}components${path.sep}`) ||
          id.includes("/components/"));

      if (!ehComponenteJs) return;

      const resultado = babel.transformSync(codigo, {
        filename: id,
        presets: [["@babel/preset-react", { runtime: "automatic" }]],
        babelrc: false,
        configFile: false,
        sourceMaps: true,
      });

      if (!resultado?.code) return;

      return {
        code: resultado.code,
        map: resultado.map,
      };
    },
  };
}

export default defineConfig({
  plugins: [
    jsxNosComponentesJs(),
    // Plugin React para os arquivos `.test.jsx` (JSX no próprio teste).
    react(),
  ],
  test: {
    // Padrão: Node (helpers e APIs). Telas usam jsdom (abaixo).
    environment: "node",

    // Só a pasta de componentes precisa de “navegador falso” (jsdom).
    environmentMatchGlobs: [
      ["tests/components/**", "jsdom"],
    ],

    // Carrega matchers extras (toBeInTheDocument, etc.) — útil nas telas.
    setupFiles: ["./tests/setup-components.js"],

    // unit/api = .test.js | componentes = .test.jsx (JSX no arquivo de teste)
    include: ["tests/**/*.test.js", "tests/**/*.test.jsx"],

    // Mensagens um pouco mais claras no terminal.
    reporters: ["default"],
  },
  resolve: {
    // Mesmo atalho do jsconfig.json / Next: import x from "@/lib/..."
    alias: {
      "@": raizDoProjeto,
    },
  },
});
