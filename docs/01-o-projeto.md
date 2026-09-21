# O que é este projeto

Somos um grupo da UFMS fazendo um **projeto integrador**. O produto é um **site** (não um aplicativo da loja da Apple/Google) para registrar **denúncias** (por exemplo, problema na rua) e acompanhar o andamento.

Você abre o site no navegador: Chrome, Safari, Firefox, no computador ou no celular.

## O que a pessoa consegue fazer (MVP)

MVP = a versão **mais simples** que ainda é útil. Combinamos o seguinte:

1. **Home** — tela inicial com botões para as outras telas.
2. **Nova denúncia** — **sem criar conta**. A pessoa informa localização, envia **foto** e recebe um **número de protocolo**.
3. **Acompanhar** — consulta o status **só com o protocolo** (não tem “minhas denúncias” nem login).
4. **Mapa** — vê os pontos das denúncias (mapa OpenStreetMap + lista). A tela **já busca** a lista no banco (`GET /api/denuncias`, passo 11).
5. **Prefeitura** — alguém da prefeitura marca como **resolvido** usando uma **senha** guardada no arquivo `.env`. A tela **já** valida a senha no servidor e grava no banco (passo 12). Não existe cadastro de usuários.

## O que ainda não está pronto

As **telas** do MVP já existem no front (check-out 2) e, no check-out 3, **já estão ligadas ao banco** (passos 09–12). O **teste ponta a ponta** (passo 13) também está documentado e conferido.

No **check-out 3** (branch `checkout3`) o grupo ligou o **banco** e as **APIs**:

* Prisma + SQLite **já instalados** (passo 02)
* Modelo `Denuncia` **já desenhado** no `schema.prisma` (passo 03)
* Migração **já aplicada** (passo 04) — a tabela existe no `dev.db` local; cada pessoa roda `npm run db:migrate` na própria máquina
* `lib/prisma.js` + `lib/gerar-protocolo.js` **já prontos** (passo 05) — conexão com o banco e geração de protocolo
* `POST /api/denuncias` **já cria** denúncia + salva foto em `public/uploads/` (passo 06)
* `GET /api/denuncias` **já lista** todas e **busca** com `?protocolo=` (passo 07)
* `PATCH /api/denuncias/[id]/resolver` **já marca** como `RESOLVIDO` com a senha do `.env` (passo 08)
* Tela `/denuncia` **já envia** para a API e mostra protocolo real (passo 09)
* Tela `/acompanhar` **já consulta** o banco com `GET ?protocolo=` (passo 10)
* Tela `/mapa` **já lista** as denúncias do banco no mapa e nos cartões (passo 11)
* Tela `/prefeitura` **já** usa senha do `.env` + lista do banco + `PATCH` (passo 12)
* Teste ponta a ponta documentado e conferido (passo 13)

Guia do check-out 3: [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md).  
Roteiro denunciar → acompanhar → mapa → resolver: seção do **passo 13** nesse guia.  
Check-out 4 (testes): [12-checkout4-testes.md](./12-checkout4-testes.md) — passos **01–06** já feitos (`npm test` + helpers + APIs + telas + Playwright E2E). Falta o passo 07 (merge na `main`).
Visual (cores, fonte, ícones e mapa): [08-identidade-e-menu.md](./08-identidade-e-menu.md).  
Ordem do produto: [mpv.md](./mpv.md).

## Por que JavaScript e Next.js?

- **JavaScript** — linguagem do navegador; o grupo não precisa aprender TypeScript agora.
- **Next.js (App Router)** — um único projeto serve as **páginas** e as **APIs** (`/api/...`) que gravam no banco.
- **Tailwind** — estilo com classes no próprio JSX (`className="..."`), sem criar um arquivo CSS por botão.

Lista completa de bibliotecas: [07-bibliotecas.md](./07-bibliotecas.md).

Detalhes de instalação: [arquitetura_e_tecnologias.md](./arquitetura_e_tecnologias.md).
