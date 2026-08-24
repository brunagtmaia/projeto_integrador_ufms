# Estrutura do projeto

Este arquivo lista **pastas e arquivos** da raiz do repositório e explica **para que servem**.

Regra de ouro: se você não sabe o que um arquivo faz, **não apague**. Leia esta lista ou pergunte no grupo.

## Visão da árvore (o que importa)

```text
projeto_integrador_ufms/
├── app/                      ← páginas e (depois) APIs — o coração do site
│   ├── page.js               ← Home (/)
│   ├── layout.js             ← moldura de todas as páginas
│   ├── globals.css           ← CSS global + Tailwind
│   ├── favicon.ico           ← ícone da aba do navegador
│   ├── denuncia/page.js      ← tela /denuncia
│   ├── acompanhar/page.js    ← tela /acompanhar
│   ├── mapa/page.js          ← tela /mapa
│   ├── prefeitura/page.js    ← tela /prefeitura
│   └── api/                  ← futuro: rotas de dados (pastas ainda vazias)
├── components/               ← pedaços de tela reutilizáveis
│   ├── PlaceholderTela.js
│   ├── Icone.js
│   └── MenuLateral.js
├── docs/                     ← esta documentação
├── public/                   ← arquivos estáticos (imagens, uploads)
├── lib/                      ← futuro: funções auxiliares (ex.: gerar protocolo)
├── prisma/                   ← futuro: banco SQLite (hoje incompleto)
├── package.json              ← nome do projeto, scripts, bibliotecas
├── README.md                 ← resumo rápido na raiz do GitHub
├── .env.example              ← modelo de variáveis de ambiente
└── .gitignore                ← o que o Git NÃO deve enviar ao GitHub
```

Arquivos gerados automaticamente (não editar, não commitar):

- `node_modules/` — bibliotecas baixadas pelo `npm install`
- `.next/` — cache do Next.js quando você roda `npm run dev`
- `.env` — **sua** senha; só na sua máquina
- `prisma/dev.db` — banco local (quando existir de verdade)

---

## Raiz do projeto (arquivos soltos)

### `package.json`

Lista:

- o **nome** do projeto;
- os **comandos** (`npm run dev`, `npm run build`, `npm run lint`);
- as **dependências** (Next.js, React, Tailwind).

O que cada biblioteca faz (Next, React, Tailwind, ESLint, o que ainda falta no MVP): [07-bibliotecas.md](./07-bibliotecas.md).

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

```text
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="troque-esta-senha"
```

Copie para `.env` na **sua** máquina (`cp .env.example .env`) e troque a senha. O `.env` real **não** vai para o Git.

### `.env`

Arquivo local (não está no Git). Guarda a senha da tela da prefeitura e o caminho do banco. **Nunca** cole no WhatsApp do grupo público nem no commit.

### `AGENTS.md` e `CLAUDE.md`

Arquivos gerados/atualizados pelo Next.js para ferramentas de IA. **Não são** o trabalho da disciplina. Não precisa ler para desenvolver as telas.

---

## Pasta `app/` — o site

No **App Router**, o nome da **pasta** vira o caminho da URL, **desde que** exista um arquivo chamado exatamente `page.js`.

| Caminho no disco | URL no navegador | Função hoje |
| --- | --- | --- |
| `app/page.js` | `/` | Home com os botões para as outras telas |
| `app/layout.js` | (todas) | HTML, idioma `pt-BR`, Poppins, ícones Material, `{children}` e o **menu lateral** |
| `app/globals.css` | (todas) | Tailwind + paleta (verde/navy) + classes `btn-primario`, `cartao` |
| `app/favicon.ico` | — | Ícone da aba |
| `app/denuncia/page.js` | `/denuncia` | Placeholder da denúncia sem login |
| `app/acompanhar/page.js` | `/acompanhar` | Placeholder da consulta por protocolo |
| `app/mapa/page.js` | `/mapa` | Placeholder do mapa |
| `app/prefeitura/page.js` | `/prefeitura` | Placeholder de marcar como resolvido |

**Como criar uma tela nova:** crie `app/nome-da-tela/page.js`, acrescente um item no array `telas` em `app/page.js` **e** um item no array `itens` em `components/MenuLateral.js`.

### `app/api/`

Reservada para o **backend** no mesmo projeto. Pastas `denuncias/` e `geocode/` existem, mas **ainda não têm** `route.js`. Quando o grupo for gravar denúncia no banco, o arquivo típico será `app/api/denuncias/route.js` (isso vira a URL `/api/denuncias`).

Não coloque tela de usuário aqui: API não é página com botão.

---

## Pasta `components/`

Pedaços de interface **reutilizáveis**. A maioria é importada por um `page.js`. O `MenuLateral.js` é importado pelo `app/layout.js`, por isso aparece em **todas** as telas.

| Arquivo | Para quê |
| --- | --- |
| `PlaceholderTela.js` | Título, descrição, link “Voltar à Home” e o aviso de “tela ainda não implementada”. Usado pelas quatro rotas do MVP. |
| `Icone.js` | Desenha um ícone **Material Icons Outlined** (ex.: `<Icone nome="home" />`). Nomes em inglês: [fonts.google.com/icons](https://fonts.google.com/icons) (estilo Outlined). |
| `MenuLateral.js` | Menu **lateral** (abre/fecha). O botão com o ícone `menu` no topo abre; o X, o fundo escuro ou a tecla Esc fecham. Ao clicar numa tela, o menu fecha sozinho. |

Quando o formulário de denúncia estiver pronto, essa página **para de usar** o placeholder. O arquivo pode ficar para outras telas incompletas ou ser apagado se ninguém mais precisar.

---

## Pasta `docs/`

Documentação do trabalho (este guia). Veja o índice em [README.md](./README.md).

| Item | Para quê |
| --- | --- |
| `README.md` | Índice da documentação |
| `01-o-projeto.md` … `08-identidade-e-menu.md` | Guias para iniciantes (o `07` é bibliotecas; o `08` é visual e menu) |
| `mpv.md` | Escopo do MVP |
| `arquitetura_e_tecnologias.md` | Instalar e rodar na máquina |
| `ideias_layouts/` | Imagens do guia de cores/botões |
| `chats/` | Pasta vazia (anotações futuras) |
| `checkouts-ufms/` | Pasta vazia (anotações futuras) |

---

## Pasta `public/`

Tudo aqui é servido **como arquivo estático**. Exemplo: `public/next.svg` aparece em `/next.svg`.

| Item | Para quê |
| --- | --- |
| `*.svg` | Ícones que vieram do template do Next.js |
| `uploads/` | Onde as **fotos das denúncias** devem ser salvas no MVP |
| `uploads/.gitkeep` | Arquivo vazio só para o Git **guardar a pasta** (as fotos em si são ignoradas) |

**Não** envie fotos reais para o GitHub. O `.gitignore` já bloqueia o conteúdo de `uploads/`.

---

## Pasta `lib/`

Hoje está **vazia**. Combinamos usar para funções que não são tela, por exemplo: gerar número de protocolo, falar com o Prisma. Colocar isso em `lib/` evita copiar a mesma lógica em várias páginas.

---

## Pasta `prisma/`

No MVP o banco é **SQLite + Prisma**. Hoje a pasta tem:

| Item | Situação |
| --- | --- |
| `dev.db` | Arquivo de banco local (não vai para o Git). Pode existir na sua máquina sem o `schema.prisma` ainda. |
| `migrations/` | Histórico de mudanças do banco. Pasta iniciada; o modelo completo entra quando o grupo configurar o Prisma de verdade. |

Ainda **falta** o arquivo `prisma/schema.prisma` (o “desenho” das tabelas). Sem ele, o Prisma não está de fato no fluxo do dia a dia. Quem for fazer o passo 2 do MVP (gravar denúncia) deve seguir [arquitetura_e_tecnologias.md](./arquitetura_e_tecnologias.md) e o [mpv.md](./mpv.md).

---

## O que você **não** deve commitar

- `node_modules/`
- `.next/`
- `.env` (senhas)
- `prisma/dev.db`
- fotos em `public/uploads/` (exceto o `.gitkeep`)

Se o `git status` mostrar esses arquivos, **não** dê `git add` neles. Avise o grupo: o `.gitignore` deveria estar cobrindo.
