# Planejamento dos check-outs restantes (P02)

Este arquivo organiza o que ainda falta entregar na disciplina, com base no que já existe no repositório e no MVP ([mpv.md](./mpv.md)).

**Semestre:** 2026.2 · **Projeto:** FiscalizApp (lotes vagos / denúncias urbanas)

---

## Situação atual (o que já foi feito)

| Etapa | Status | Resumo |
| --- | --- | --- |
| P01 (módulos anteriores) | Concluído | Requisitos, escopo, fundamentação e base do projeto |
| P02 · Módulo 1 | Concluído | Resolução de problemas e análise de requisitos ([P02_M1](./checkouts-ufms/P02/P02_M1.md)) |
| Código base / check-out 2 | Telas prontas (mock) | Next.js, Home, denúncia, sucesso, acompanhar, mapa, prefeitura |
| `/denuncia` | Layout visual pronto | **Não redesenhar**; Enviar → sucesso com protocolo mock |
| `/denuncia/sucesso` | Feito (check-out 2) | Protocolo na URL, copiar, links |
| `/acompanhar` | Feito (check-out 2) | Consulta por protocolo (mock) |
| `/prefeitura` | Feito (check-out 2) | Senha `prefeitura` + marcar resolvido (só na tela) |
| Banco (Prisma + SQLite) e APIs | Pendente | Pasta `app/api/` reservada; `schema.prisma` ainda falta |
| Testes automatizados | Pendente | Ainda não definidos neste repositório |

Detalhes das rotas: [04-rotas-e-telas.md](./04-rotas-e-telas.md). Guia completo do check-out 2 (telas): [10-checkout2-frontend-telas.md](./10-checkout2-frontend-telas.md). O que fica fora do MVP: [06-trabalhos-futuros.md](./06-trabalhos-futuros.md).

---

## Visão geral do plano

| Check-out | Módulo da disciplina | Foco do grupo | Branch Git |
| --- | --- | --- | --- |
| **2** | Desenvolvimento Web com Frameworks e HTML/CSS | **Todas as telas Frontend** | `checkout2` |
| **3** | Banco de Dados e Controle de Versão | **Banco de dados + Backend** | `checkout-3-banco-backend` |
| **4** | Testes e Garantia de Qualidade | **Testes automatizados** | `checkout-4-testes` |

**Versão final:** merge das três branches na `main` (ver [estratégia Git](#estratégia-git-uma-branch-por-check-out)).

Ordem sugerida de trabalho: **2 → 3 → 4**, porque o front define o contrato visual/dados, o backend grava de verdade, e os testes validam o fluxo completo.

---

## Check-out 2 — Frontend (todas as telas)

**Objetivo:** terminar o desenvolvimento visual e de interação de **todas** as telas do MVP, ainda podendo usar dados fictícios onde o banco ainda não existir.

**Guia detalhado (para iniciantes):** [10-checkout2-frontend-telas.md](./10-checkout2-frontend-telas.md).

### Escopo

1. **Home (`/`)** — visual FiscalizApp (saudação + 4 ações), **sem** ilustração e **sem** ícone de perfil/login.
2. **Nova denúncia (`/denuncia`)** — layout visual **já pronto; não redesenhar**. Só um `onClick` mínimo no botão Enviar para ir à tela de sucesso.
3. **Denúncia criada (`/denuncia/sucesso`)** — mostrar protocolo (ex.: `?protocolo=748393`), copiar e links (protocolo ainda simulado até o check-out 3).
4. **Acompanhar (`/acompanhar`)** — consulta por protocolo (estados: vazio / carregando / encontrado / não encontrado), usando mock.
5. **Mapa (`/mapa`)** — Leaflet + lista; visual alinhado às outras telas (fase 6); dados reais no check-out 3.
6. **Prefeitura (`/prefeitura`)** — senha de teste no front: `prefeitura` + lista + marcar resolvido (só na tela).
7. **Identidade e responsividade** — cores, Poppins, ícones e menu ([08-identidade-e-menu.md](./08-identidade-e-menu.md)); **mobile-first**.

### Critérios de “pronto” deste check-out

- Nenhuma rota do MVP permanece só com `PlaceholderTela`.
- Layout de `/denuncia` não foi redesenhado.
- `/denuncia/sucesso` existe e o Enviar navega até ela.
- Navegação Home ↔ menu ↔ telas funciona em desktop e celular.
- Formulários e feedbacks de UI estão claros (mesmo com mock).
- Escopo **não** inclui login, cadastro ou “minhas denúncias”.

### Branch

```text
git checkout main
git pull
git checkout -b checkout2
```

(A branch `checkout2` já pode existir no repositório local — use `git checkout checkout2` se for o caso.)

Ao finalizar o check-out 2: abrir PR / merge em `main` (ou manter a branch até o merge final combinado pelo grupo — o importante é **não misturar** escopo de 3 e 4 nesta branch).

---

## Check-out 3 — Banco de dados e Backend

**Objetivo:** persistir denúncias de verdade e ligar as telas às APIs.

### Escopo

1. **Modelo Prisma + SQLite** — criar `prisma/schema.prisma` (denúncia: protocolo, status, localização, foto, datas, etc.).
2. **Migrações** — `npx prisma migrate dev` e arquivo local `dev.db` (não versionar o banco).
3. **Rotas de API (Next.js)** — por exemplo:
   - criar denúncia (upload de foto → `public/uploads`);
   - buscar por protocolo;
   - listar para o mapa;
   - marcar como resolvido (validar senha do `.env`).
4. **Integração com o Frontend** — trocar mocks/dados de exemplo pelas chamadas reais.
5. **Controle de versão** — commits claros nesta branch; `.env` / `dev.db` fora do Git; documentar variáveis necessárias.

### Critérios de “pronto” deste check-out

- Fluxo ponta a ponta: denunciar → receber protocolo → acompanhar → ver no mapa → resolver na prefeitura.
- Foto salva e referenciada no registro.
- Senha da prefeitura só no `.env` (sem tabela de usuários).

### Branch

```text
git checkout main
git pull
git checkout -b checkout-3-banco-backend
```

Preferência: partir da `main` **já com** o front do check-out 2 mergeado, para integrar UI + API sem retrabalho.

---

## Check-out 4 — Testes automatizados

**Objetivo:** garantir qualidade com testes automatizados cobrindo o que o MVP entrega.

### Escopo (sugestão alinhada ao módulo)

1. **Testes de API / backend** — criar denúncia, consultar protocolo, listar mapa, rejeitar senha inválida na prefeitura.
2. **Testes de componentes ou páginas** — formulários e estados principais das telas (quando fizer sentido com a ferramenta escolhida pelo grupo).
3. **Scripts no `package.json`** — ex.: `npm test` (e, se houver, lint).
4. **Documentação curta** — como rodar os testes localmente (pode ficar neste arquivo ou em nota no README).

Ferramenta concreta (Jest, Vitest, Playwright, etc.) fica a cargo do grupo no início desta branch; o importante é **automatizar** os fluxos críticos acima.

### Critérios de “pronto” deste check-out

- Suite de testes rodando com um comando único.
- Cobertura dos fluxos críticos do MVP (não precisa testar o que está em “trabalhos futuros”).
- Testes verdes na branch antes do merge final.

### Branch

```text
git checkout main
git pull
git checkout -b checkout-4-testes
```

Preferência: partir da `main` **já com** front + backend mergeados.

---

## Estratégia Git: uma branch por check-out

Regra combinada pelo grupo:

1. **Uma branch dedicada para cada check-out** (`checkout2`, `checkout-3-banco-backend`, `checkout-4-testes`).
2. Trabalho do check-out **só** na branch correspondente (evita misturar front, banco e testes no mesmo commit confuso).
3. Ao concluir cada etapa, **merge na `main`** (via PR no GitHub, se o grupo usar).
4. **Versão final da disciplina:** `main` contendo o merge de tudo (front + banco/backend + testes) — essa é a baseline estável para entrega/demo.

### Fluxo visual

```text
main
  │
  ├── checkout2  ──(merge)──► main
  │                              │
  ├── checkout-3-banco-backend ──(merge)──► main
  │                              │
  └── checkout-4-testes ──(merge)─────────► main  = versão final
```

### Boas práticas rápidas

- Sempre atualizar a branch com `main` antes de abrir o merge (`git pull origin main` + rebase ou merge, conforme o grupo preferir).
- Mensagens de commit objetivas (ex.: “Adiciona formulário de denúncia no front”).
- Não commitar `.env`, `node_modules` nem `prisma/dev.db`.
- Se duas pessoas editarem a mesma tela, alinhar na branch do check-out em andamento — não criar branches paralelas sem necessidade.

Como contribuir no dia a dia: [05-como-contribuir.md](./05-como-contribuir.md).

---

## Checklist rápido por check-out

### Check-out 2

- [x] Documentação do check-out 2 ([10-checkout2-frontend-telas.md](./10-checkout2-frontend-telas.md))
- [x] `/denuncia` — só `onClick` no Enviar (layout intacto; protocolo = `id` aleatório do mock)
- [x] `/denuncia/sucesso` com protocolo na URL
- [x] `/acompanhar` sem placeholder
- [x] `/prefeitura` sem placeholder (senha de teste `prefeitura`)
- [x] Home aproximada do mockup FiscalizApp (sem perfil, sem ilustração, 4 ações)
- [x] `/mapa` alinhada ao restante do visual (polimento fase 6)
- [x] Responsivo mobile (layout mobile-first + menu lateral)
- [ ] Branch `checkout2` mergeada na `main`

### Check-out 3

- [ ] Schema Prisma + migração
- [ ] APIs de denúncia / protocolo / mapa / resolver
- [ ] Upload de foto
- [ ] Front consumindo dados reais
- [ ] Branch `checkout-3-banco-backend` mergeada na `main`

### Check-out 4

- [ ] Testes automatizados dos fluxos críticos
- [ ] `npm test` (ou equivalente) documentado
- [ ] Branch `checkout-4-testes` mergeada na `main`
- [ ] `main` = versão final para entrega

---

## Referências no repositório

| Documento | Uso neste plano |
| --- | --- |
| [mpv.md](./mpv.md) | Escopo mínimo do produto |
| [04-rotas-e-telas.md](./04-rotas-e-telas.md) | Telas e URLs |
| [06-trabalhos-futuros.md](./06-trabalhos-futuros.md) | O que **não** fazer agora |
| [arquitetura_e_tecnologias.md](./arquitetura_e_tecnologias.md) | Stack, `.env`, Prisma |
| [checkouts-ufms/P02/P02_M1.md](./checkouts-ufms/P02/P02_M1.md) | Texto do módulo 1 já entregue |
| [10-checkout2-frontend-telas.md](./10-checkout2-frontend-telas.md) | Guia das telas do check-out 2 (iniciantes) |
