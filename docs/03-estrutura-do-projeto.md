## Estrutura do projeto

Este arquivo lista **pastas e arquivos** da raiz do repositório e explica **para que servem**.

Regra de ouro: se você não sabe o que um arquivo faz, **não apague**. Leia esta lista ou pergunte no grupo.

## Visão da árvore (o que importa)

```plaintext
projeto_integrador_ufms/
├── app/                      ← páginas e (depois) APIs — o coração do site
│   ├── page.js               ← Home (/)
│   ├── layout.js             ← moldura de todas as páginas
│   ├── globals.css           ← CSS global + Tailwind
│   ├── favicon.ico           ← ícone da aba do navegador
│   ├── denuncia/page.js      ← tela /denuncia (formulário → API, passo 09)
│   ├── acompanhar/page.js    ← tela /acompanhar
│   ├── mapa/page.js          ← tela /mapa
│   ├── prefeitura/page.js    ← tela /prefeitura (senha .env + API, passo 12)
│   └── api/                  ← APIs: denuncias (POST/GET) + [id]/resolver (PATCH)
├── components/               ← pedaços de tela reutilizáveis
│   ├── PlaceholderTela.js
│   ├── Icone.js
│   ├── MenuLateral.js
│   ├── denuncia/             ← FormularioDenuncia + TelaSucessoDenuncia
│   ├── acompanhar/           ← TelaAcompanhar
│   ├── mapa/                 ← tela /mapa (Leaflet)
│   └── prefeitura/           ← TelaPrefeitura (passo 12)
├── docs/                     ← esta documentação
├── public/                   ← arquivos estáticos (imagens, uploads)
├── lib/                      ← funções e dados auxiliares
│   ├── denuncias-exemplo.js  ← mock aposentado; mapa só usa CENTRO_MAPA
│   ├── prisma.js             ← conexão única com o banco (check-out 3 · passo 05)
│   └── gerar-protocolo.js    ← cria protocolo de 6 dígitos único
├── prisma/                   ← banco SQLite + schema do Prisma (check-out 3)
├── package.json              ← nome do projeto, scripts, bibliotecas
├── README.md                 ← resumo rápido na raiz do GitHub
├── .env.example              ← modelo de variáveis de ambiente
└── .gitignore                ← o que o Git NÃO deve enviar ao GitHub
```

Arquivos gerados automaticamente (não editar, não commitar):

*   `node_modules/` — bibliotecas baixadas pelo `npm install`
*   `.next/` — cache do Next.js quando você roda `npm run dev`
*   `.env` — **sua** senha; só na sua máquina
*   `prisma/dev.db` — banco local (quando existir de verdade)

## Raiz do projeto (arquivos soltos)

### `package.json`

Lista:

*   o **nome** do projeto;
*   os **comandos** (`npm run dev`, `npm run build`, `npm run lint`);
*   as **dependências** (Next.js, React, Tailwind).

O que cada biblioteca faz (Next, React, Tailwind, ESLint, Prisma): [07-bibliotecas.md](./07-bibliotecas.md).

Se alguém adicionar uma biblioteca, este arquivo muda e **todo mundo** precisa rodar `npm install` de novo. Atualizem também o [07-bibliotecas.md](./07-bibliotecas.md).

### `package-lock.json`

Trava as **versões exatas** das bibliotecas. O npm cria/atualiza sozinho. Não edite à mão.

### `README.md`

Primeira página que aparece no GitHub. Tem o comando para ligar o site. O manual completo está em `docs/`.

### `jsconfig.json`

Ajuda o editor a entender imports. O atalho `@/` aponta para a raiz (`@/components/...` = pasta `components/` na raiz). Hoje os arquivos ainda usam caminho relativo (`../../components/...`), os dois jeitos funcionam.

### `next.config.mjs`

Configuração do Next.js. Na maioria das vezes o grupo **não precisa** mexer.

### `postcss.config.mjs`

Liga o Tailwind ao processo de CSS. Não precisa editar no dia a dia.

### `eslint.config.mjs`

Regras do `npm run lint` (avisos de código). Útil antes de entregar.

### `.gitignore`

Lista do que **não** sobe para o GitHub: `node_modules`, `.next`, `.env`, banco, fotos de `public/uploads`. Sem isso, o repositório ficaria pesado e **inseguro** (senhas).

### `.env.example`

Modelo:

```plaintext
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="troque-esta-senha"
```

Copie para `.env` na **sua** máquina (`cp .env.example .env`) e troque a senha. O `.env` real **não** vai para o Git.

### `.env`

Arquivo local (não está no Git). Guarda a senha da tela da prefeitura e o caminho do banco. **Nunca** cole no WhatsApp do grupo público nem no commit.

## Pasta `app/` — o site

No **App Router**, o nome da **pasta** vira o caminho da URL, **desde que** exista um arquivo chamado exatamente `page.js`.

| Caminho no disco | URL no navegador | Função hoje |
| --- | --- | --- |
| `app/page.js` | `/` | Home com os botões para as outras telas |
| `app/layout.js` | (todas) | HTML, idioma `pt-BR`, Poppins, ícones Material, `{children}` e o **menu lateral** |
| `app/globals.css` | (todas) | Tailwind + paleta (verde/navy) + classes `btn-primario`, `cartao` |
| `app/favicon.ico` | — | Ícone da aba |
| `app/denuncia/page.js` | `/denuncia` | **Passo 09:** importa `FormularioDenuncia` (envia para a API) |
| `app/acompanhar/page.js` | `/acompanhar` | Consulta por protocolo no **banco** (passo 10) |
| `app/mapa/page.js` | `/mapa` | Mapa OpenStreetMap + lista do **banco** (passo 11) |
| `app/prefeitura/page.js` | `/prefeitura` | **Passo 12:** marcar como resolvido (senha `.env` + banco) |

**Como criar uma tela nova:** crie `app/nome-da-tela/page.js`, acrescente um item no array `telas` em `app/page.js` **e** um item no array `itens` em `components/MenuLateral.js`.

### `app/api/`

Aqui ficam as **rotas de dados** (backend no mesmo projeto Next.js). Não é tela com botão: o navegador (ou o `curl`) chama esses endereços.

| Caminho no disco | URL | Situação |
| --- | --- | --- |
| `app/api/denuncias/route.js` | `/api/denuncias` | **Passos 06–07:** `POST` cria denúncia + foto; `GET` lista todas ou busca com `?protocolo=`. |
| `app/api/denuncias/[id]/resolver/route.js` | `/api/denuncias/125172/resolver` (o número muda) | **Passo 08:** `PATCH` marca `RESOLVIDO` se a senha = `ADMIN_PASSWORD` do `.env`. |
| `app/api/geocode/route.js` | `/api/geocode?q=` ou `?lat=&lng=` | Proxy Nominatim: autocomplete de endereço e reverse do GPS (formulário `/denuncia`). |

Como o Next “descobre” a URL: pasta + arquivo chamado exatamente `route.js`. A pasta `[id]` é **dinâmica** (cada protocolo vira uma URL diferente).

Guia com exemplos de `curl`, JSON, telas ligadas e o teste ponta a ponta: [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md) (passos **06** a **13**).

## Pasta `components/`

Pedaços de interface **reutilizáveis**. A maioria é importada por um `page.js`. O `MenuLateral.js` é importado pelo `app/layout.js`, por isso aparece em **todas** as telas.

| Arquivo | Para quê |
| --- | --- |
| `PlaceholderTela.js` | Título, descrição, “Voltar à Home” e aviso de tela incompleta. Hoje quase não é usado (as telas do MVP já têm UI própria). |
| `Icone.js` | Desenha um ícone **Material Icons Outlined** (ex.: `<icone nome="home">`). Nomes em inglês: [fonts.google.com/icons](https://fonts.google.com/icons) (estilo Outlined). |
| `MenuLateral.js` | Menu **lateral** (abre/fecha). |
| `denuncia/FormularioDenuncia.js` | **Passo 09:** formulário de `/denuncia` — inputs + **carrossel de fotos** (até 5) + `POST /api/denuncias`. |
| `denuncia/TelaSucessoDenuncia.js` | Tela `/denuncia/sucesso` — mostra o protocolo da URL. |
| `acompanhar/TelaAcompanhar.js` | **Passo 10:** consulta por protocolo — `GET /api/denuncias?protocolo=`. |
| `mapa/TelaMapa.js` | **Passo 11:** lista + filtro + `GET /api/denuncias` (lista completa) + Leaflet. |
| `mapa/MapaLeaflet.js` | Leaflet + OpenStreetMap + marcadores + enquadrar pontos. |
| `prefeitura/TelaPrefeitura.js` | **Passo 12:** senha do `.env` + lista pendentes + `PATCH .../resolver`. |

## Pasta `docs/`

Documentação do trabalho (este guia). Veja o índice em [README.md](./README.md).

| Item | Para quê |
| --- | --- |
| `README.md` | Índice da documentação |
| `01-o-projeto.md` … `08-identidade-e-menu.md` | Guias para iniciantes (o `07` é bibliotecas; o `08` é visual e menu) |
| `09-planejamento-checkouts.md` | Plano dos check-outs 2–4 e branches |
| `10-checkout2-frontend-telas.md` | Guia do check-out 2 (telas) |
| `11-checkout3-banco-backend.md` | Guia do check-out 3 (banco + backend) |
| `mpv.md` | Escopo do MVP |
| `arquitetura_e_tecnologias.md` | Instalar e rodar na máquina |
| `ideias_layouts/` | Imagens do guia de cores/botões |
| `chats/` | Pasta vazia (anotações futuras) |
| `checkouts-ufms/` | Textos dos check-outs da disciplina (P01, P02) |

## Pasta `public/`

Tudo aqui é servido **como arquivo estático**. Exemplo: `public/next.svg` aparece em `/next.svg`.

| Item | Para quê |
| --- | --- |
| `*.svg` | Ícones que vieram do template do Next.js |
| `uploads/` | Onde as **fotos das denúncias** devem ser salvas no MVP |
| `uploads/.gitkeep` | Arquivo vazio só para o Git **guardar a pasta** (as fotos em si são ignoradas) |

**Não** envie fotos reais para o GitHub. O `.gitignore` já bloqueia o conteúdo de `uploads/`.

## Pasta `lib/`

Funções e dados que **não são tela**. Quem importa daqui são as páginas, componentes ou (no check-out 3) as **APIs**.

| Arquivo | Para quê | Situação |
| --- | --- | --- |
| `denuncias-exemplo.js` | Mock antigo + `CENTRO_MAPA`. | `/mapa` usa só o centro (passo 11). Lista mock **aposentada** — `/denuncia`, `/acompanhar`, `/mapa` e `/prefeitura` **já não** usam (passos 09–12). |
| `prisma.js` | Exporta `prisma` — **uma** conexão com o SQLite para as rotas `/api/...` usarem. | **Pronto (passo 05).** |
| `gerar-protocolo.js` | Função `gerarProtocoloUnico()` — sorteia protocolo de 6 dígitos e confere se já existe no banco. | **Pronto (passo 05).** Usado por `POST /api/denuncias` (passo 06). |
| `fotos-denuncia.js` | Helpers para 1 ou várias fotos no campo `foto` (caminho único ou JSON). A API devolve `foto` + `fotos`. | Usado pelo `POST`/`GET` e pelo resolver. |

**Dica:** não importe `prisma.js` ou `gerar-protocolo.js` dentro de componentes que rodam **só no navegador**. Eles precisam do Node/servidor (e do arquivo `.env`). As telas vão continuar falando com `/api/...` via `fetch`.

## Pasta `prisma/`

No MVP o banco é **SQLite + Prisma**. Os pacotes já estão no `package.json` (check-out 3 · passo 02).

| Item | Situação |
| --- | --- |
| `schema.prisma` | **Pronto (passo 03).** Tem a base (SQLite + generator) **e** o `model Denuncia` (campos: protocolo/`id`, endereço, descrição, status, lat/lng, foto, datas). |
| `migrations/` | **Pronto (passo 04).** Pasta `…_init_denuncia/` com o SQL que cria a tabela. **Isso vai para o Git** (histórico compartilhado). |
| `dev.db` | Arquivo de banco **local** (não vai para o Git). Depois do `npm run db:migrate`, a tabela `Denuncia` existe aí. |

**O que é um `model`?** É o desenho de **uma tabela**. `model Denuncia` = “cada denúncia é uma linha com estes campos”.

**O que é uma migração?** É o “passo a passo” (em SQL) que o Prisma grava em `migrations/` para transformar o desenho em tabela real. Cada pessoa aplica isso na própria máquina com `npm run db:migrate`.

**Cliente no código:** `lib/prisma.js` (passo 05) é o que as APIs importam.  
**Criar denúncia:** `POST /api/denuncias` (**passo 06**) + tela `/denuncia` (**passo 09**).  
**Buscar / listar:** `GET /api/denuncias` e `GET /api/denuncias?protocolo=...` (**passo 07**).  
**Marcar resolvido:** `PATCH /api/denuncias/[id]/resolver` com senha do `.env` (**passo 08**).  
**Telas já ligadas:** `/denuncia` (09), `/acompanhar` (10), `/mapa` (11), `/prefeitura` (12). Falta o teste ponta a ponta (13).

Guia do check-out 3 (iniciantes): [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md) — inclusive as seções dos passos **06** a **13**.  
Instalar e rodar: [arquitetura\_e\_tecnologias.md](./arquitetura_e_tecnologias.md).