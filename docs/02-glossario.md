# Glossário (para quem está começando)

Quando aparecer uma palavra estranha no código ou nas reuniões, volte nesta lista.

| Palavra | Significado simples |
| --- | --- |
| **Repositório (repo)** | A pasta do projeto no GitHub + o histórico de mudanças. |
| **Git** | Programa que guarda versões do código (commit, pull, push). |
| **Commit** | “Foto” do código com uma mensagem (“adicionei a Home”). |
| **Branch** | Linha de trabalho paralela (ex.: `bruna`) para não bagunçar o `main`. |
| **Clone / pull** | Clone = baixar o projeto. Pull = atualizar com o que as outras enviaram. |
| **Node.js** | Programa que executa JavaScript **fora** do navegador. Sem ele, `npm` não funciona. |
| **npm** | Instala bibliotecas listadas no `package.json`. |
| **`node_modules/`** | Pasta enorme com essas bibliotecas. **Não edite** e **não envie** para o GitHub. |
| **JavaScript (.js)** | Linguagem deste projeto. |
| **React** | Biblioteca para montar telas em pedaços (componentes). O Next.js usa React. |
| **Componente** | Função que devolve HTML/JSX. Ex.: `PlaceholderTela`. |
| **JSX** | Jeito de escrever HTML dentro do JavaScript (`<h1>Olá</h1>`). |
| **Next.js** | Ferramenta que organiza páginas, rotas e (depois) API. |
| **App Router** | Regra: a pasta `app/` define as URLs. `app/mapa/page.js` → `/mapa`. |
| **Rota** | Caminho na barra de endereço (`/denuncia`, `/mapa`). |
| **Página (`page.js`)** | Arquivo especial: o Next.js só desenha a rota se existir esse nome. |
| **Layout (`layout.js`)** | “Moldura” de todas as páginas: fontes, idioma, CSS global e o menu. |
| **`"use client"`** | Linha no topo de um arquivo quando ele precisa de estado no navegador (ex.: menu aberto/fechado). |
| **Menu lateral** | Painel à esquerda que **abre e fecha**. Não é barra embaixo. Ver [08-identidade-e-menu.md](./08-identidade-e-menu.md). |
| **`Link`** | Componente do Next para ir a outra página **sem recarregar** o site inteiro. Não use `<a href="/mapa">` para páginas internas. |
| **Props** | Dados que um componente recebe. Ex.: `titulo="Mapa"`. |
| **`export default`** | Diz “esta função é a página / o componente principal deste arquivo”. |
| **`import`** | Traz código de outro arquivo. |
| **Tailwind** | Classes de estilo no `className` (`flex`, `text-2xl`, `bg-white`). |
| **CSS** | Folha de estilo. Neste projeto o global é `app/globals.css`. |
| **API** | Endereço que **grava ou busca dados**, não uma tela bonita. Ex.: `/api/denuncias`. Hoje: `POST` cria, `GET` lista/busca e `PATCH .../resolver` marca resolvido. As telas `/denuncia`, `/acompanhar`, `/mapa` e `/prefeitura` já chamam essas rotas (passos 09–12). |
| **FormData** | Jeito de mandar **texto + arquivo(s)** (foto) na mesma requisição. Usado no formulário de denúncia e no `POST /api/denuncias`. O campo `foto` pode se repetir (até 5 imagens). |
| **Carrossel de fotos** | Na tela `/denuncia`: pré-visualização das imagens, setas para navegar, botão **X** para excluir e botão para **adicionar outra**. Detalhes no guia do check-out 3 (passo 09). |
| **GET / POST / PATCH** | Métodos HTTP. **GET** = “me mostre”. **POST** = “crie”. **PATCH** = “mude só uma parte” (ex.: status → `RESOLVIDO`). |
| **Query string** | Texto depois do `?` na URL. Ex.: `/api/denuncias?protocolo=125172` — o parâmetro é `protocolo`. |
| **SQLite** | Banco em **um arquivo** (`dev.db`). Não precisa instalar MySQL. |
| **Prisma** | Ferramenta que cria/atualiza o SQLite a partir de um modelo (`schema.prisma`). **Já instalada** no check-out 3. Guia: [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md). |
| **`schema.prisma`** | Arquivo na pasta `prisma/` com o “desenho” das tabelas. |
| **`model Denuncia`** | Bloco no schema que lista os campos de uma denúncia (protocolo, endereço, status, GPS, foto…). **Já existe** (passo 03). |
| **Migração** | Comando (`npm run db:migrate`) que aplica o schema no arquivo `dev.db`. **Já existe** a migração `init_denuncia` no Git (passo 04); cada pessoa aplica na própria máquina. |
| **`PrismaClient` / `lib/prisma.js`** | Objeto (e o arquivo que o exporta) usado no **servidor** para gravar/buscar denúncias. **Já existe** (passo 05). Não use isso dentro de componente só do navegador. |
| **Protocolo** | Número (texto de 6 dígitos) que identifica a denúncia. Gerado por `lib/gerar-protocolo.js` (passo 05) quando a API criar o registro. |
| **`.env`** | Segredos da **sua** máquina (`DATABASE_URL`, `ADMIN_PASSWORD` da prefeitura). **Nunca** vá para o GitHub. A API do passo 08 compara a senha; a tela `/prefeitura` (passo 12) só **envia** o que a pessoa digitou. |
| **`.env.example`** | Modelo **sem senha real**. Esse pode ir para o GitHub. |
| **`localhost:3000`** | “Este computador, porta 3000” — o site em desenvolvimento. |
| **`npm run dev`** | Liga o servidor de desenvolvimento. Deixe o terminal aberto. |
| **Placeholder** | Tela temporária (“ainda não implementada”) só para a rota existir. |
| **MVP** | Produto mínimo viável — só o essencial. |
| **Leaflet / OSM** | Leaflet desenha o mapa; OpenStreetMap fornece as ruas (grátis). Já usado em `/mapa`. |
| **Nominatim** | Serviço grátis do OpenStreetMap que transforma endereço ↔ GPS. O app usa via `/api/geocode` (formulário `/denuncia`). |
| **Geocode / autocomplete** | Buscar sugestões de endereço enquanto a pessoa digita; ao escolher, o formulário guarda `lat`/`lng` sem mostrar os números. |
| **Deploy / Vercel** | Colocar o site na internet. Combinamos Vercel no MVP. |
| **`public/`** | Arquivos que o navegador baixa direto (ícones, fotos em `uploads/`). |
| **Teste automatizado** | Código que confere sozinho se uma parte do app ainda funciona. No check-out 4 usamos **Vitest** + **Testing Library** + **Playwright**. Guia: [12-checkout4-testes.md](./12-checkout4-testes.md). |
| **Vitest** | Ferramenta que **roda** os testes rápidos (`npm test`). Parecida com Jest. |
| **Testing Library** | Ajuda a testar **telas React** (botões, textos, formulários) sem abrir o Chrome. |
| **jsdom** | “Navegador falso” usado pelo Vitest nos testes de componentes. |
| **Playwright** | Abre o **Chromium de verdade** e simula cliques/digitação. Comando: `npm run test:e2e`. |
| **E2E** | “End-to-end” / ponta a ponta: do formulário até marcar resolvido (passo 06). |
| **Smoke test** | Teste bem simples só para ver se a ferramenta de testes está ligada. Não prova o app inteiro. |
| **Helper** | Função auxiliar em `lib/` (ex.: montar lista de fotos). Não é uma tela. |
| **Teste unitário** | Testa **uma função** (ou um pedaço pequeno) de forma isolada. |
| **Mock** | “Fingir” uma dependência nos testes (ex.: o banco Prisma ou o geocode), sem usar internet/`dev.db`. |
| **`npm test`** | Roda a suite do Vitest **uma vez** e termina. |
| **`npm run test:e2e`** | Roda os testes Playwright no navegador. |
| **Teste de API** | Chama as funções `GET`/`POST`/`PATCH` das rotas em `app/api/` e confere o JSON e o status (200, 201, 400, 401, 404…). Não abre o navegador. Guia passos 03–04: [12-checkout4-testes.md](./12-checkout4-testes.md). |
| **Teste de componente / tela** | Monta um componente React (ex.: `TelaAcompanhar`) e confere textos/botões. Usa Testing Library + mock do `fetch`. Guia passo 05: [12-checkout4-testes.md](./12-checkout4-testes.md). |
| **FormData** | Jeito de enviar formulário com **texto + arquivo** (foto) na mesma requisição — usado no `POST /api/denuncias`. |

Nomes e funções de **cada biblioteca** (Next, React, Tailwind, Prisma, Leaflet, Vitest, Testing Library, Playwright, etc.): [07-bibliotecas.md](./07-bibliotecas.md).

Se faltar uma palavra, acrescentem neste arquivo e avisem o grupo.
