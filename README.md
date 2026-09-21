# projeto_integrador_ufms

App web do projeto integrador (MVP): denúncias sem login, acompanhamento por protocolo, mapa e marcação de resolvido.

Stack: **Next.js (App Router, JavaScript)**, Tailwind, API nas rotas do Next, SQLite + Prisma, Leaflet.  
Testes: **Vitest** + **Testing Library** (`npm test`) e **Playwright** E2E (`npm run test:e2e`).

**Documentação para o grupo (iniciantes):** comece em [`docs/README.md`](docs/README.md). Bibliotecas: [`docs/07-bibliotecas.md`](docs/07-bibliotecas.md). Visual e menu: [`docs/08-identidade-e-menu.md`](docs/08-identidade-e-menu.md). Pastas: [`docs/03-estrutura-do-projeto.md`](docs/03-estrutura-do-projeto.md). Testes (check-out 4): [`docs/12-checkout4-testes.md`](docs/12-checkout4-testes.md).

## Desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Copie `.env.example` para `.env` se ainda não existir. Não commite `.env`, `dev.db` nem fotos em `public/uploads`.

## Testes automatizados

### Vitest (rápido — sem abrir o Chrome)

```bash
npm test
```

Roda a suite do Vitest **uma vez**. No check-out 4 (passos 01–05):

* **Passo 01** — confere se a ferramenta está ligada (smoke test).
* **Passo 02** — testa os helpers em `lib/` (fotos e protocolo).
* **Passo 03** — testa `GET` e `POST` de `/api/denuncias`.
* **Passo 04** — testa `PATCH .../resolver` (senha da prefeitura).
* **Passo 05** — testa as telas `/acompanhar` e `/prefeitura` (Testing Library).

Não precisa ter o `npm run dev` ligado.

Para ficar observando enquanto edita:

```bash
npm run test:watch
```

### Playwright (E2E — abre o Chromium)

Na **primeira** vez nesta máquina:

```bash
npx playwright install chromium
```

Depois:

```bash
npm run test:e2e
```

Isso é o **passo 06**: denunciar → acompanhar → marcar resolvido na prefeitura.  
Precisa do `.env` com `ADMIN_PASSWORD` (igual ao check-out 3). O Playwright sobe o `npm run dev` sozinho se ainda não estiver rodando.

### Tudo junto

```bash
npm run test:all
```

Detalhes (para iniciantes): [`docs/12-checkout4-testes.md`](docs/12-checkout4-testes.md).
