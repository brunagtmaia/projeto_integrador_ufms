# Bibliotecas do projeto

Este texto lista **tudo que o site usa** e explica **para que serve**, em linguagem de quem está começando.

**Biblioteca** = um pedaço de código que outra pessoa já escreveu. Em vez de inventar “como desenhar um botão no navegador”, usamos React, Next.js, etc.

A lista oficial de nomes e versões fica no arquivo `package.json` na raiz. O comando `npm install` lê esse arquivo e baixa tudo para a pasta `node_modules/` (não edite essa pasta).

Há três grupos:

1. **Já instaladas** — estão no `package.json` hoje (incluindo Leaflet e **Prisma**).
2. **Não são npm, mas o site usa** — fonte, ícones e os tiles do OpenStreetMap.
3. **Ferramentas do computador** — Node, npm, Git (não são pacotes do projeto).

---

## 1. Já instaladas (`package.json`)

### Dependências (`dependencies`)

São as bibliotecas que o site **precisa para funcionar** (na sua máquina e, depois, na internet).

| Nome no `package.json` | Versão no projeto | Para que serve |
| --- | --- | --- |
| **next** | 16.3.1 | **Next.js.** Monta o site: páginas na pasta `app/`, endereços (`/mapa`), e as APIs (`/api/...`). O comando `npm run dev` é o Next.js. Sem ele não existe o projeto como está. |
| **react** | 19.2.8 | **React.** Permite escrever a tela em **componentes** (funções que devolvem JSX, tipo `Home` ou `Icone`). O Next.js **usa** o React por baixo. |
| **react-dom** | 19.2.8 | Liga o React ao **navegador** (coloca o HTML na página). Quase sempre vem junto com o React; não mexemos nela no dia a dia. |
| **leaflet** | 1.9.x | Desenha o **mapa** e os marcadores na tela `/mapa`. |
| **react-leaflet** | 5.x | Deixa usar o Leaflet com componentes React (`MapContainer`, `Marker`). |
| **@prisma/client** | 6.x | **Cliente do Prisma.** É o que o código das APIs importa para gravar/buscar denúncias no SQLite (ex.: `prisma.denuncia.create`). Depois de mudar o `schema.prisma`, rode `npm run db:generate` (ou `db:migrate`, que já gera). |

Por que Next **e** React? O React desenha os pedaços da tela. O Next.js organiza pastas, rotas, servidor e o comando de desenvolvimento.

### Dependências de desenvolvimento (`devDependencies`)

Servem **enquanto programamos**. Não são “a tela da denúncia”; ajudam a estilizar, achar erro e cuidar do banco.

| Nome no `package.json` | Para que serve |
| --- | --- |
| **tailwindcss** | **Tailwind CSS.** Estilo com classes no `className` (`flex`, `bg-primary`, `rounded-full`). Também usamos classes nossas no `globals.css` (`btn-primario`, `cartao`). |
| **@tailwindcss/postcss** | “Cola” o Tailwind no processo de CSS do projeto. Sem isso, as classes do Tailwind não viram estilo de verdade. Em geral **não se edita**. |
| **eslint** | Programa que **lê o código** e avisa coisa estranha (variável não usada, erro de sintaxe). Roda com `npm run lint`. |
| **eslint-config-next** | Conjunto de regras do ESLint **feitas para Next.js**. Assim o lint entende `page.js`, `layout.js`, etc. |
| **prisma** | **CLI do Prisma** (linha de comando). Cria/atualiza o banco a partir do arquivo `prisma/schema.prisma`. Comandos do grupo: `npm run db:migrate`, `npm run db:studio`, `npm run db:generate`. |
| **vitest** | **Vitest.** Roda os **testes automatizados** rápidos do check-out 4. Comandos: `npm test` (uma vez) e `npm run test:watch` (fica observando). Guia: [12-checkout4-testes.md](./12-checkout4-testes.md). |
| **@testing-library/react** | **Testing Library.** Monta componentes React nos testes e procura botões/textos (passo 05). |
| **@testing-library/jest-dom** | Frases extras nos testes: `toBeInTheDocument()`, `toHaveValue()`, etc. |
| **@testing-library/user-event** | Simula digitação e clique “como uma pessoa” nos testes de tela. |
| **jsdom** | Navegador falso dentro do Node (precisa para testar telas sem abrir o Chrome). |
| **@vitejs/plugin-react** | Ajuda o Vitest a entender JSX nos arquivos `.test.jsx`. |
| **@babel/core** + **@babel/preset-react** | Nos testes, convertem o JSX das telas em `components/*.js` (o app continua com `.js` normal). |
| **@playwright/test** | **Playwright.** Abre o Chromium e testa o fluxo ponta a ponta (passo 06). Comandos: `npm run test:e2e` e, na 1ª vez, `npx playwright install chromium`. |

**PostCSS** aparece no arquivo `postcss.config.mjs`. Não está listado à parte no `package.json` porque entra junto com o plugin do Tailwind. Função: transformar o CSS (incluindo `@import "tailwindcss"`) no CSS que o navegador entende.

---

## 2. O site usa, mas não está no `package.json`

Essas coisas vêm da **internet** quando a página abre (ou o Next baixa a fonte). Não precisa `npm install` para elas.

| O quê | Onde está no código | Para que serve |
| --- | --- | --- |
| **Poppins** | `next/font/google` em `app/layout.js` | Fonte do app (o guia visual mostrava Inter; o grupo pediu **Poppins**). |
| **Material Icons Outlined** | `<link>` no `app/layout.js` + componente `components/Icone.js` | Ícones do **Material Design**. Catálogo: [fonts.google.com/icons](https://fonts.google.com/icons). |
| **OpenStreetMap (tiles)** | URL no `MapaLeaflet.js` | Imagens das ruas, **gratuitas**, sem chave. O Leaflet só “cola” esses quadradinhos. |
| **Nominatim (geocode)** | Chamado por `app/api/geocode/route.js` | Transforma endereço ↔ GPS (autocomplete e reverse). Grátis; não precisa chave no `.env`. |

---

## 3. Ferramentas que não são “biblioteca npm”, mas o grupo usa

| Nome | É biblioteca do projeto? | Para que serve |
| --- | --- | --- |
| **Node.js** | Não. Instala **no computador**. | Executa JavaScript fora do navegador. Sem Node, `npm` e `next` não rodam. |
| **npm** | Não. Vem com o Node. | Lê o `package.json` e instala as bibliotecas. |
| **Git** | Não. | Histórico do código e GitHub. |
| **JavaScript** | Linguagem, não pacote. | Tudo que escrevemos em `.js`. |
| **SQLite** | Motor de banco (arquivo `dev.db`). | Guardar denúncias. O Prisma **usa** o SQLite; você não instala MySQL nem PostgreSQL. |
| **Vercel** | Serviço na nuvem. | Colocar o site no ar (combinado no MVP). Não é um pacote que se importa no código. |

---

## 4. Banco de dados no MVP (Prisma + SQLite)

No **check-out 3** o grupo grava denúncias de verdade. Resumo em linguagem simples:

| Peça | O que é | Onde fica |
| --- | --- | --- |
| **SQLite** | Banco em **um arquivo** no disco | `prisma/dev.db` (não vai para o GitHub) |
| **Prisma** | Ferramenta que lê o “desenho” das tabelas e conversa com o SQLite **sem** você escrever SQL na mão | CLI (`prisma`) + cliente (`@prisma/client`) |
| **`schema.prisma`** | Arquivo de texto com o desenho do banco | `prisma/schema.prisma` |
| **Migração** | Comando que aplica o desenho no arquivo `.db` | `npm run db:migrate` |

**Situação hoje (passos 01–13 do check-out 3):** Prisma **já está instalado**. O `schema.prisma` tem o `model Denuncia`. A migração `init_denuncia` **já está** em `prisma/migrations/`. Cada pessoa roda `npm run db:migrate` para criar o **próprio** `dev.db`. No código já existem `lib/prisma.js`, `lib/gerar-protocolo.js`, a rota **`/api/denuncias`** com **`POST`** (criar + upload) e **`GET`** (listar / buscar), **`PATCH /api/denuncias/[id]/resolver`**, e as telas **`/denuncia`**, **`/acompanhar`**, **`/mapa`** e **`/prefeitura`** ligadas ao banco. O **teste ponta a ponta** (passo 13) está no guia. Guia: [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md).

O **mapa** (Leaflet + OpenStreetMap) já está na tela `/mapa` e, no passo 11, a lista de pontos vem de `GET /api/denuncias` (não mais do mock).

**Não instalar agora** (trabalhos futuros): PostGIS, bibliotecas de login/e-mail, PWA. Ver [06-trabalhos-futuros.md](./06-trabalhos-futuros.md).

---

## Como saber o que está instalado de verdade

1. Abra `package.json`.
2. O que está em `dependencies` e `devDependencies` **já** foi escolhido.
3. Depois de `npm install`, a pasta `node_modules/` enche (não commitar).

Se o `package.json` mudar no GitHub, cada pessoa roda de novo:

```bash
npm install
```

Se alguém mudou o `schema.prisma` e você puxou o código, rode também:

```bash
npm run db:migrate
```

---

## Relação rápida (quem usa o quê)

```text
Você escreve JSX  →  React desenha os componentes
                     Next.js escolhe a página pela URL e sobe o servidor
                     Tailwind / globals.css pintam botões e cartões
                     Poppins + Material Icons = identidade visual
                     Menu lateral (abre/fecha) em todas as páginas
                     Leaflet + OpenStreetMap = mapa
                     Nominatim via /api/geocode = endereço ↔ GPS no formulário
Banco (check-out 3) → Prisma + SQLite gravam e leem denúncias
                     schema.prisma = desenho; lib/prisma.js = conexão
                     lib/gerar-protocolo.js = protocolo único
                     APIs em app/api/ = porta de entrada (POST/GET denúncias; PATCH resolver; geocode)
Testes (check-out 4) → Vitest roda `npm test` (pasta tests/)
                     passo 01 = smoke · passo 02 = helpers em lib/
                     passo 03 = GET/POST /api/denuncias (tests/api/)
                     passo 04 = PATCH .../resolver (senha da prefeitura)
                     passo 05 = telas com Testing Library (tests/components/)
                     Playwright → `npm run test:e2e` (pasta e2e/)
                     passo 06 = fluxo denunciar → acompanhar → prefeitura
```

Mais detalhes de pastas: [03-estrutura-do-projeto.md](./03-estrutura-do-projeto.md).  
Visual e menu: [08-identidade-e-menu.md](./08-identidade-e-menu.md).  
Como ligar o projeto: [arquitetura_e_tecnologias.md](./arquitetura_e_tecnologias.md).  
Check-out 3 (banco + backend): [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md).  
Check-out 4 (testes): [12-checkout4-testes.md](./12-checkout4-testes.md).
