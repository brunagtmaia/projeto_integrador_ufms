## Check-out 4 — Testes automatizados (guia para iniciantes)

Este texto é o **mapa de trabalho** do check-out 4. Foi escrito para quem está começando: o que é teste automatizado, o que já foi feito, o que falta e em que ordem fazer.

**Branch Git:** `checkout4`  
**Escopo:** testes automatizados dos fluxos críticos do MVP (API, helpers, telas e E2E no navegador).  
**Não inclui:** login, cadastro, novas telas, redesign, troca de banco.

Plano geral dos check-outs: [09-planejamento-checkouts.md](./09-planejamento-checkouts.md).  
MVP: [mpv.md](./mpv.md).  
Banco e APIs (já feitos): [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md).

---

## 1. Objetivo (em uma frase)

Fazer o computador **conferir sozinho** se as partes importantes do app ainda funcionam — com um comando (`npm test`), sem precisar clicar em tudo na mão toda vez.

---

## 2. Palavras que você vai ver (bem simples)

| Palavra | Significado |
| --- | --- |
| **Teste automatizado** | Um pedaço de código que **chama** outra parte do app e **verifica** se o resultado está certo. |
| **Suite de testes** | O conjunto de todos os arquivos de teste do projeto. |
| **Vitest** | A ferramenta que **roda** os testes (parecida com Jest). É ela que o `npm test` chama. |
| **Smoke test** | Teste bem simples (“a ferramenta está ligada?”). Não prova o app inteiro — só que o Vitest funciona. |
| **`expect(...).toBe(...)`** | Frase do teste: “eu espero que A seja igual a B”. Se não for, o teste **falha**. |
| **Verde / falhou** | Verde = passou. Vermelho (falhou) = algo quebrou; o terminal mostra qual teste. |
| **`npm test`** | Comando que roda a suite **uma vez** e termina. |
| **`npm run test:watch`** | Deixa o Vitest **observando**: quando você salva um arquivo, ele roda de novo. |
| **Helper** | Função auxiliar em `lib/` (ex.: montar lista de fotos, gerar protocolo). Não é uma tela. |
| **Teste unitário** | Testa **uma função** (ou um pedaço pequeno) de forma isolada. |
| **Mock** | “Fingir” uma dependência (ex.: o banco). O teste controla a resposta sem usar o `dev.db`. |
| **API** | Endereço no servidor que **recebe** dados e **devolve** JSON (ex.: `/api/denuncias`). Não é uma tela com botão. |
| **GET** | Pedido de **leitura** (“me mostre as denúncias” / “ache este protocolo”). |
| **PATCH** | Pedido de **atualização parcial** (“marque esta denúncia como resolvida”). |
| **FormData** | Formato de envio do formulário (texto + arquivo de foto na mesma requisição). |
| **Status HTTP** | Número da resposta: `200` ok, `201` criado, `400` dados errados, `404` não achou. |
| **Testing Library** | Biblioteca que ajuda a testar **telas React** (botões, textos, formulários) como se fosse uma pessoa usando. |
| **jsdom** | “Navegador falso” dentro do Node — precisa dele para montar componentes React nos testes. |
| **Playwright** | Abre o **navegador de verdade** (Chromium) e simula a pessoa usando o site. Comando: `npm run test:e2e`. |
| **E2E** | “End-to-end” = teste **ponta a ponta** (do formulário até marcar resolvido). |

Mais palavras: [02-glossario.md](./02-glossario.md). Bibliotecas: [07-bibliotecas.md](./07-bibliotecas.md).

---

## 3. Decisões do grupo

| Decisão | Valor |
| --- | --- |
| Branch | `checkout4` (já existe no remoto) |
| Runner principal | **Vitest** → comando `npm test` |
| Telas (passo 05) | **Testing Library** + jsdom |
| Depois (passo 06) | **Playwright** → comando `npm run test:e2e` |
| Pasta dos testes Vitest | `tests/` (`unit/`, `api/`, `components/`) |
| Pasta dos testes E2E | `e2e/` |
| Config Vitest | `vitest.config.mjs` na raiz |
| Config Playwright | `playwright.config.mjs` na raiz |

### O que **não** fazer neste check-out

* Login, cadastro, “minhas denúncias”, e-mail
* Redesign das telas
* Trocar Prisma/SQLite/Next.js
* Commitar `.env`, `node_modules`, `dev.db` ou relatórios gigantes de teste

---

## 4. Passos (ordem) e status

| Passo | O que é | Status |
| --- | --- | --- |
| **01** | Branch `checkout4` + Vitest + `npm test` (smoke) | **Feito** |
| **02** | Testes dos helpers (`lib/fotos-denuncia`, `lib/gerar-protocolo`) | **Feito** |
| **03** | Testes da API `GET` / `POST` `/api/denuncias` | **Feito** |
| **04** | Testes da API `PATCH .../resolver` (senha) | **Feito** |
| **05** | Testing Library nas telas principais (`TelaAcompanhar`, `TelaPrefeitura`) | **Feito** |
| **06** | Playwright — fluxo ponta a ponta no navegador | **Feito** |
| **07** | Documentação final + merge na `main` | Pendente |

Ordem sugerida: **01 → 02 → 03 → 04** (núcleo da API) → **05** (telas) → **06** (Playwright no navegador).

---

## 5. O que o passo 01 deixou pronto

Depois do `git pull` na branch `checkout4`, na pasta do projeto:

```bash
npm install
```

Isso baixa o **Vitest** junto com o resto.

### Pacotes novos

| Pacote | Onde no `package.json` | Para quê |
| --- | --- | --- |
| `vitest` | `devDependencies` | Roda os testes automatizados |

### Comandos npm (atalhos)

| Comando | O que faz |
| --- | --- |
| `npm test` | Roda **todos** os testes uma vez (`vitest run`) |
| `npm run test:watch` | Fica rodando e **repete** quando você salva um arquivo |

### Arquivos criados neste passo

| Arquivo / pasta | Para quê |
| --- | --- |
| `vitest.config.mjs` | Configuração do Vitest (onde achar testes, alias `@/`) |
| `tests/unit/smoke.test.js` | Smoke test — confere que o Vitest funciona |
| Scripts `test` e `test:watch` no `package.json` | Atalhos para o grupo |

### Como conferir que o passo 01 está ok

No terminal, **na pasta do projeto**:

```bash
npm test
```

Você deve ver algo parecido com:

```text
✓ tests/unit/smoke.test.js (2 tests)
Test Files  1 passed (1)
Tests  2 passed (2)
```

Se aparecer **passed** / números verdes, o Vitest está pronto.  
Se aparecer **failed**, leia a mensagem vermelha: em geral é `npm install` faltando ou arquivo de config errado.

### O que o smoke test faz (e o que **não** faz)

O arquivo `tests/unit/smoke.test.js`:

1. Confere `1 + 1 === 2` (só para provar que o Vitest roda).
2. Importa `@/lib/fotos-denuncia` — confere que o atalho `@/` do projeto também funciona nos testes.

Ele **não** cria denúncia, **não** abre o navegador e **não** substitui o teste ponta a ponta manual do check-out 3. Isso vem nos próximos passos.

---

## 6. Branch — como começar a trabalhar

```bash
git checkout checkout4
git pull
npm install
npm test
```

Se a branch ainda não existir na sua máquina:

```bash
git fetch origin
git checkout checkout4
```

Trabalho de testes **só** nesta branch (não misturar com feature nova).

---

## 7. Estrutura de pastas (como ficou)

Hoje (passos 01–06):

```text
tests/
  unit/
    smoke.test.js              ← passo 01
    fotos-denuncia.test.js     ← passo 02
    gerar-protocolo.test.js    ← passo 02
  api/
    helpers-api.js             ← atalhos só para os testes (não é o app)
    denuncias-get.test.js      ← passo 03 (GET)
    denuncias-post.test.js     ← passo 03 (POST)
    denuncias-resolver.test.js ← passo 04 (PATCH resolver)
  components/
    helpers-telas.js           ← atalhos das telas (não é o app)
    setup via tests/setup-components.js
    TelaAcompanhar.test.jsx    ← passo 05
    TelaPrefeitura.test.jsx    ← passo 05
vitest.config.mjs              ← Vitest (npm test)

e2e/                           ← Playwright (npm run test:e2e) — passo 06
  helpers-e2e.js               ← ler .env + mock do geocode
  fluxo-denuncia.spec.js       ← denunciar → acompanhar → prefeitura
  fixtures/
    foto-teste.jpg             ← imagem ≥ 2 KB para o upload
playwright.config.mjs          ← sobe o Next e acha os testes E2E
```

Regra: arquivos de teste de API/helpers terminam com `.test.js`.  
Arquivos de **tela** terminam com `.test.jsx` (precisam de JSX no próprio teste).  
Arquivos **E2E** do Playwright terminam com `.spec.js`.  
Os arquivos `helpers-api.js`, `helpers-telas.js` e `helpers-e2e.js` **não** são executados sozinhos.

---

## 8. O que o passo 02 deixou pronto

Depois do `git pull` na branch `checkout4`:

```bash
npm install
npm test
```

Você deve ver **vários** arquivos passando (não só o smoke), algo parecido com:

```text
✓ tests/unit/smoke.test.js
✓ tests/unit/fotos-denuncia.test.js
✓ tests/unit/gerar-protocolo.test.js
Test Files  3 passed (3)
Tests  18 passed (18)
```

(O número exato de testes pode crescer depois; o importante é **passed** / verde.)

### Arquivos novos deste passo

| Arquivo | O que testa |
| --- | --- |
| `tests/unit/fotos-denuncia.test.js` | `listarFotos`, `fotoPrincipal`, `serializarFotos` |
| `tests/unit/gerar-protocolo.test.js` | `gerarProtocoloUnico` (com **mock** do Prisma) |

### O que cada arquivo cobre (em português)

#### A) Fotos (`lib/fotos-denuncia.js`)

O banco guarda o campo `foto` de dois jeitos:

1. **Uma foto** → texto simples, ex.: `/uploads/abc.jpg`
2. **Várias fotos** → JSON, ex.: `["/uploads/a.jpg","/uploads/b.jpg"]`

Os testes conferem:

* lista vazia quando não há foto;
* formato antigo (um caminho só) continua funcionando;
* várias fotos em JSON;
* `fotoPrincipal` pega a **primeira**;
* `serializarFotos` grava caminho único **ou** JSON;
* “ida e volta”: serializar → listar devolve a mesma lista.

**Não** abre o navegador e **não** precisa do `dev.db`.

#### B) Protocolo (`lib/gerar-protocolo.js`)

A função sorteia um número de **6 dígitos** e pergunta ao banco se já existe.

Nos testes:

* se o banco “diz” que está livre → devolve protocolo `^\d{6}$`;
* se o primeiro número já existe → tenta de novo;
* se nunca achar livre → lança erro com a mensagem de protocolo único.

Aqui usamos **mock**: o Prisma é fingido. Assim ninguém precisa ter o SQLite ligado para rodar `npm test`.

### Como ler um teste (exemplo mínimo)

```js
it("devolve a primeira foto quando há várias", () => {
  const campo = JSON.stringify([
    "/uploads/primeira.jpg",
    "/uploads/segunda.jpg",
  ]);

  expect(fotoPrincipal(campo)).toBe("/uploads/primeira.jpg");
});
```

1. `it("...")` — nome do caso (o que você está conferindo).
2. Preparar o dado de entrada (`campo`).
3. `expect(...).toBe(...)` — o resultado **tem** que ser esse; senão o teste falha.

### Se um teste do passo 02 falhar

1. Leia a mensagem vermelha: ela diz **qual** `it(...)` quebrou.
2. Abra o arquivo em `lib/` correspondente e o `.test.js`.
3. Pergunte: alguém mudou o formato das fotos ou a regra do protocolo?
4. Não “apague o teste” para ficar verde — ajuste o código **ou** o teste se a regra do MVP mudou de propósito.

### O que o passo 02 **ainda não** fazia (já coberto no 03–04 / ainda pendente)

* ~~Não testa `POST` / `GET` das APIs~~ → **feito no passo 03**.
* ~~Não testa `PATCH .../resolver`~~ → **feito no passo 04**.
* Não testa botões das telas (passo **05** — **feito**).
* Não abre Chrome/Firefox (passo **06**).

---

## 9. O que o passo 03 deixou pronto

Depois do `git pull` na branch `checkout4`:

```bash
npm install
npm test
```

Você deve ver os arquivos de **unit** e de **api** passando, algo parecido com:

```text
✓ tests/unit/smoke.test.js
✓ tests/unit/fotos-denuncia.test.js
✓ tests/unit/gerar-protocolo.test.js
✓ tests/api/denuncias-get.test.js
✓ tests/api/denuncias-post.test.js
Test Files  5 passed (5)
Tests  28 passed (28)
```

(O número exato pode crescer no passo 04; o importante é **passed** / verde.)

### Arquivos novos deste passo

| Arquivo | O que faz / testa |
| --- | --- |
| `tests/api/helpers-api.js` | Atalhos: denúncia de exemplo, foto falsa ≥ 2 KB, ler JSON |
| `tests/api/denuncias-get.test.js` | `GET /api/denuncias` (lista e busca por protocolo) |
| `tests/api/denuncias-post.test.js` | `POST /api/denuncias` (criar + validações) |

Código real que estamos cobrindo: `app/api/denuncias/route.js` (check-out 3).

### O que cada arquivo cobre (em português)

#### A) GET — listar e buscar (`denuncias-get.test.js`)

A mesma URL muda de comportamento conforme a query string:

| Pedido | O que a API deve fazer | Status |
| --- | --- | --- |
| `GET /api/denuncias` | Listar todas (mapa / prefeitura) | `200` + `denuncias: [...]` |
| `GET ...?protocolo=125172` | Achar uma (acompanhar) | `200` + `denuncia: {...}` |
| Protocolo que não existe | Avisar que não achou | `404` |
| Protocolo só com espaços | Recusar (dado inválido) | `400` |

O Prisma é **mockado**: o teste decide se “existe” ou não no banco.

#### B) POST — criar (`denuncias-post.test.js`)

Simula o formulário com **FormData** (texto + foto), igual ao navegador.

| Caso | Esperado |
| --- | --- |
| Dados válidos + foto ok | `201`, `protocolo` / `id`, status `PENDENTE` |
| Sem endereço | `400` |
| Sem descrição | `400` |
| Sem lat ou lng | `400` |
| Sem foto | `400` |
| Foto menor que 2 KB | `400` |

Também fingimos:

* `gerarProtocoloUnico` → sempre `"482913"` (número fixo, fácil de conferir);
* `mkdir` / `writeFile` → **não** grava em `public/uploads` de verdade.

Assim o `npm test` não suja a pasta de uploads nem precisa do `dev.db`.

### Como um teste de API se parece (exemplo mínimo)

```js
it("devolve 404 quando o protocolo não existe", async () => {
  vi.mocked(prisma.denuncia.findUnique).mockResolvedValue(null);

  const request = new Request(
    "http://localhost:3000/api/denuncias?protocolo=999999",
  );
  const response = await GET(request);
  const corpo = await response.json();

  expect(response.status).toBe(404);
  expect(corpo.ok).toBe(false);
});
```

1. Preparar o mock (“banco diz que não achou”).
2. Chamar a função `GET` / `POST` da rota (não precisa abrir o Chrome).
3. Conferir o **status** e o JSON (`ok`, `erro`, `protocolo`…).

### Preciso do `npm run dev` ligado?

**Não** para os passos 01–03. O Vitest chama as funções da rota direto no Node.  
O `npm run dev` continua sendo para usar o site no navegador.

### Se um teste do passo 03 falhar

1. Leia qual `it("...")` quebrou (nome em português no terminal).
2. Abra `app/api/denuncias/route.js` e o `.test.js` correspondente.
3. Pergunte: alguém mudou mensagem de erro, status HTTP ou campos obrigatórios?
4. Não apague o teste para “ficar verde” — alinhe o código **ou** o teste se a regra do MVP mudou de propósito.

### O que o passo 03 **ainda não** fazia (já coberto no 04 / ainda pendente)

* ~~Não testa `PATCH .../resolver`~~ → **feito no passo 04**.
* Não testa botões das telas (passo **05** — **feito**).
* Não abre o navegador (passo **06**).

---

## 10. O que o passo 04 deixou pronto

Depois do `git pull` na branch `checkout4`:

```bash
npm install
npm test
```

Você deve ver **unit** + **api** (incluindo o resolver) passando, algo parecido com:

```text
✓ tests/unit/smoke.test.js
✓ tests/unit/fotos-denuncia.test.js
✓ tests/unit/gerar-protocolo.test.js
✓ tests/api/denuncias-get.test.js
✓ tests/api/denuncias-post.test.js
✓ tests/api/denuncias-resolver.test.js
Test Files  6 passed (6)
Tests  35 passed (35)
```

(O número exato pode crescer nos passos 05–06; o importante é **passed** / verde.)

### Arquivo novo deste passo

| Arquivo | O que testa |
| --- | --- |
| `tests/api/denuncias-resolver.test.js` | `PATCH /api/denuncias/[id]/resolver` (senha + status) |

Código real que estamos cobrindo: `app/api/denuncias/[id]/resolver/route.js` (check-out 3 · passo 08).  
Quem chama essa API no site: a tela `/prefeitura`.

### O que a API faz (lembrete simples)

A prefeitura manda um JSON com a senha:

```json
{ "senha": "valor-do-ADMIN_PASSWORD" }
```

Se a senha estiver certa, o status da denúncia vira **`RESOLVIDO`** no banco.

### Casos que o teste confere

| Caso | Status HTTP | O que significa |
| --- | --- | --- |
| Senha correta + denúncia `PENDENTE` | `200` | Vira `RESOLVIDO` |
| Senha errada | `401` | “Não autorizado” — **não** consulta o banco |
| Protocolo que não existe (senha ok) | `404` | Não achou a denúncia |
| Faltou o campo `senha` | `400` | Pedido incompleto |
| Corpo que não é JSON | `400` | Pedido inválido |
| Já estava `RESOLVIDO` | `200` + `aviso` | Idempotente (clicar duas vezes não quebra) |
| `ADMIN_PASSWORD` ausente no ambiente | `500` | Servidor mal configurado |

### Por que a senha fica no teste e não no `.env`?

Nos testes nós fazemos:

```js
process.env.ADMIN_PASSWORD = "prefeitura-teste";
```

Assim:

1. **Não** dependemos do seu arquivo `.env` local.
2. Qualquer pessoa do grupo roda `npm test` e passa igual.
3. No final do teste, apagamos essa variável (`delete process.env.ADMIN_PASSWORD`) para não “vazar” para outro arquivo da suite.

O Prisma continua **mockado** (igual aos passos 03): não precisa do `dev.db`.

### Detalhe do Next.js 16 (params)

Na rota real, o `[id]` da URL chega assim:

```js
const { id } = await context.params;
```

Por isso o teste passa:

```js
{ params: Promise.resolve({ id: "482913" }) }
```

Se alguém “simplificar” e passar `{ params: { id: "..." } }` sem Promise, o teste (e a rota) podem quebrar no Next 16.

### Como um teste do PATCH se parece (exemplo mínimo)

```js
it("devolve 401 quando a senha está errada", async () => {
  const response = await PATCH(
    requestPatch({ senha: "senha-errada" }),
    contextoComId("482913"),
  );
  const corpo = await response.json();

  expect(response.status).toBe(401);
  expect(corpo.ok).toBe(false);
});
```

1. Montar o pedido com senha (certa ou errada).
2. Chamar a função `PATCH` da rota (sem abrir o Chrome).
3. Conferir o **status** e a mensagem.

### Preciso do `npm run dev` ligado?

**Não** para os passos 01–05. O Vitest chama as funções da rota (API) ou monta a tela no jsdom.  
O `npm run dev` continua sendo para usar o site no navegador.

### Se um teste do passo 04 falhar

1. Leia qual `it("...")` quebrou (nome em português no terminal).
2. Abra `app/api/denuncias/[id]/resolver/route.js` e o `denuncias-resolver.test.js`.
3. Pergunte: alguém mudou a mensagem de erro, o status HTTP ou o nome do campo `senha`?
4. Confira se `ADMIN_PASSWORD` ainda é lido de `process.env` (não “hardcoded” no front).
5. Não apague o teste para “ficar verde” — alinhe o código **ou** o teste se a regra do MVP mudou de propósito.

### Mensagem vermelha no terminal (normal em um caso)

Quando o teste “`ADMIN_PASSWORD` não está no ambiente” roda, a própria rota imprime um `console.error` no stderr. Isso é **esperado** — o teste está conferindo o erro 500. Não significa que a suite falhou.

### O que o passo 04 **ainda não** fazia (já coberto no 05 / ainda pendente)

* ~~Não testa botões / textos das telas React~~ → **feito no passo 05**.
* Não abre o navegador de verdade (passo **06** — Playwright).

Com os passos **01–04**, o **núcleo** do check-out 4 (helpers + APIs críticas do MVP) já estava coberto. O passo **05** reforça as telas.

---

## 11. O que o passo 05 deixou pronto

Depois do `git pull` na branch `checkout4`:

```bash
npm install
npm test
```

Você deve ver **unit** + **api** + **components** passando, algo parecido com:

```text
✓ tests/unit/smoke.test.js
✓ tests/unit/fotos-denuncia.test.js
✓ tests/unit/gerar-protocolo.test.js
✓ tests/api/denuncias-get.test.js
✓ tests/api/denuncias-post.test.js
✓ tests/api/denuncias-resolver.test.js
✓ tests/components/TelaAcompanhar.test.jsx
✓ tests/components/TelaPrefeitura.test.jsx
Test Files  8 passed (8)
Tests  46 passed (46)
```

(O número exato pode incluir o E2E no passo 06; aqui o `npm test` continua só com Vitest.)

### Pacotes novos deste passo

| Pacote | Para quê (em português) |
| --- | --- |
| `@testing-library/react` | Monta o componente na memória e procura textos/botões |
| `@testing-library/jest-dom` | Frases extras: `toBeInTheDocument()`, `toHaveValue()`… |
| `@testing-library/user-event` | Simula digitação e clique como uma pessoa |
| `jsdom` | Navegador falso (sem abrir Chrome) |
| `@vitejs/plugin-react` | Deixa o Vitest entender JSX nos `.test.jsx` |
| `@babel/core` + `@babel/preset-react` | Converte JSX das telas em `components/*.js` nos testes |

Tudo isso fica em **`devDependencies`** (só para desenvolver/testar, não para o site no ar).

### Arquivos novos / alterados

| Arquivo | O que faz |
| --- | --- |
| `tests/setup-components.js` | Liga os matchers (`toBeInTheDocument`) antes dos testes |
| `tests/components/helpers-telas.js` | Denúncia de exemplo + `respostaJson` para mock do `fetch` |
| `tests/components/TelaAcompanhar.test.jsx` | Estados da tela `/acompanhar` |
| `tests/components/TelaPrefeitura.test.jsx` | Senha + lista + marcar resolvido |
| `vitest.config.mjs` | Ambiente jsdom nas telas + plugin Babel para `.js` com JSX |

### O que cada tela cobre (em português)

#### A) Acompanhar (`TelaAcompanhar`)

| Caso | O que a tela deve fazer |
| --- | --- |
| Estado inicial | Mostra título, campo e botão Buscar |
| Protocolo vazio + Buscar | **Não** chama `fetch` |
| API 200 com denúncia | Mostra protocolo, endereço e status |
| API 404 | Mostra “Não achamos esse protocolo” |
| Rede falhou | Mostra alerta de falha de rede |
| URL com `?protocolo=` | Campo já vem preenchido |

#### B) Prefeitura (`TelaPrefeitura`)

| Caso | O que a tela deve fazer |
| --- | --- |
| Estado inicial | Formulário de senha |
| Senha vazia | Avisa para digitar (sem `fetch`) |
| Senha errada (401) | Mostra erro; continua no login |
| Senha ok (404 no protocolo de teste) + lista | Entra e lista só `PENDENTE` |
| Marcar resolvido | Some o item da lista |

### Como o mock do `fetch` funciona (ideia simples)

Nos testes de tela **não** ligamos o servidor. Em vez disso:

```js
global.fetch = vi.fn();
global.fetch.mockResolvedValueOnce(
  respostaJson({ ok: true, denuncia: ... }, 200),
);
```

A tela chama `fetch(...)` igual ao navegador; o teste **responde** com o JSON que quisermos.  
Assim testamos a UI sem depender do `.env` nem do `dev.db`.

### Detalhe importante: `.test.jsx` e o comentário jsdom

1. Os arquivos de tela usam **`.test.jsx`** (não `.test.js`) porque o próprio teste tem JSX: `render(<TelaAcompanhar />)`.
2. No topo do arquivo aparece:

```js
/** @vitest-environment jsdom */
```

Isso avisa o Vitest: “este arquivo precisa de navegador falso”. Sem isso, aparece `document is not defined`.

### Preciso do `npm run dev` ligado?

**Não** para os passos 01–05. O Vitest monta a tela no jsdom.  
O `npm run dev` continua sendo para usar o site no Chrome de verdade.

### Se um teste do passo 05 falhar

1. Leia qual `it("...")` quebrou.
2. Abra o componente em `components/...` e o `.test.jsx`.
3. Pergunte: alguém mudou o texto do botão, o `aria-label` ou a mensagem de erro?
4. Confira se o mock do `fetch` ainda devolve o status certo (200 / 401 / 404).
5. Não apague o teste para “ficar verde” — alinhe o código **ou** o teste se a regra da tela mudou de propósito.

### O que o passo 05 **ainda não** fazia (já coberto no 06 / ainda pendente)

* ~~Não abre Chrome/Firefox de verdade~~ → **feito no passo 06** (Playwright).
* Não testa o mapa Leaflet a fundo (tiles, zoom) — fora do foco do MVP.
* Não testa GPS real do celular — o E2E **mocka** o `/api/geocode` (não depende da internet).

---

## 12. O que o passo 06 deixou pronto

Depois do `git pull` na branch `checkout4`:

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

Na **primeira** vez no computador de cada pessoa, o `npx playwright install chromium` baixa o navegador do Playwright (só Chromium — mais leve). Isso **não** vai para o Git.

Você deve ver algo parecido com:

```text
✓ e2e/fluxo-denuncia.spec.js
  1 passed
```

### Pacotes / arquivos novos deste passo

| Pacote / arquivo | Para quê (em português) |
| --- | --- |
| `@playwright/test` | Biblioteca que abre o Chromium e clica/digita como uma pessoa |
| `playwright.config.mjs` | Diz a URL (`http://localhost:3000`), pasta `e2e/` e sobe o `npm run dev` sozinho |
| `e2e/helpers-e2e.js` | Lê `ADMIN_PASSWORD` do `.env` e **mocka** `/api/geocode` |
| `e2e/fluxo-denuncia.spec.js` | O fluxo completo do MVP no navegador |
| `e2e/fixtures/foto-teste.jpg` | Foto ≥ 2 KB (a API rejeita arquivo menor) |
| `next.config.mjs` → `allowedDevOrigins` | Evita o Next bloquear scripts no modo dev (localhost / 127.0.0.1) |

### Comandos npm

| Comando | O que faz |
| --- | --- |
| `npm test` | Só Vitest (passos 01–05) — **rápido**, sem Chrome |
| `npm run test:e2e` | Só Playwright (passo 06) — abre o navegador |
| `npm run test:all` | Os dois, um depois do outro |

### O que o fluxo E2E cobre (em português)

| Etapa | O que o teste faz |
| --- | --- |
| 1. Denúncia | Abre `/denuncia`, digita endereço, escolhe sugestão (mock), anexa foto, envia |
| 2. Sucesso | Confere URL `/denuncia/sucesso?protocolo=XXXXXX` e o número na tela |
| 3. Acompanhar | Clica em Acompanhar → Buscar → vê endereço e status **Pendente** |
| 4. Prefeitura | Digita a senha do `.env` → marca a denúncia como resolvida |
| 5. Conferência | Volta no Acompanhar e vê status **Resolvido** |

### Por que mockamos o geocode?

O formulário busca endereços no Nominatim (internet). Nos testes **não** queremos depender de rede externa.  
O helper `mockarGeocode` responde na hora com um endereço fixo (“Rua E2E Teste…”).

### Preciso do `npm run dev` ligado?

**Não obrigatório.** O Playwright sobe o servidor sozinho (`webServer` no `playwright.config.mjs`).  
Se você **já** tiver o `npm run dev` rodando, ele **reaproveita** (não abre duas vezes).

### Preciso do `.env`?

**Sim** para o E2E. O teste lê `ADMIN_PASSWORD` (igual à tela `/prefeitura`).  
Exemplo no `.env`:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="prefeitura"
```

### Se o teste E2E falhar

1. Leia a mensagem no terminal (qual clique / texto não apareceu).
2. Olhe a captura em `test-results/` (só quando falha; pasta **não** vai para o Git).
3. Confira se o `.env` tem `ADMIN_PASSWORD`.
4. Confira se rodou `npx playwright install chromium` nesta máquina.
5. Use **`http://localhost:3000`** (não só `127.0.0.1`) — o Next 16 pode bloquear scripts no IP.
6. Não apague o teste para “ficar verde” — alinhe o app **ou** o teste se a tela mudou de propósito.

### O que o passo 06 **ainda não** faz

* Não testa Firefox/Safari (só Chromium no MVP).
* Não testa o mapa Leaflet a fundo (zoom, tiles).
* Não substitui o Vitest — continue rodando `npm test` também.

---

## 13. Próximo passo (07)

A documentação técnica dos passos **01–06** (este guia, README, glossário, bibliotecas, estrutura) **já está pronta**.  
O passo 07 é fechar a entrega: **commit na `checkout4`** + **merge na `main`** (versão final da disciplina).

Checklist rápido antes do merge:

1. `npm test` verde — **ok** (46 testes)  
2. `npm run test:e2e` verde — **ok** (1 fluxo)  
3. README / este guia atualizados — **ok** (passos 01–06)  
4. Commit na branch `checkout4` + abrir PR / merge na `main` — **pendente**

Depois do merge, marcar o passo 07 como **Feito** neste guia e no [09-planejamento-checkouts.md](./09-planejamento-checkouts.md).

---

## 14. Lembretes rápidos

* Rode `npm test` **e** (quando mexer no fluxo das telas) `npm run test:e2e` antes de pedir review.
* Vitest (01–05) **não** precisa do `npm run dev`. Playwright (06) sobe o servidor sozinho.
* Se alguém adicionar biblioteca de teste, atualize também o [07-bibliotecas.md](./07-bibliotecas.md).
* Dúvida de Git: [05-como-contribuir.md](./05-como-contribuir.md).

---

## Referências

| Documento | Uso |
| --- | --- |
| [09-planejamento-checkouts.md](./09-planejamento-checkouts.md) | Plano dos check-outs 2–4 |
| [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md) | APIs e banco que os testes cobrem |
| [07-bibliotecas.md](./07-bibliotecas.md) | O que cada pacote npm faz |
| [02-glossario.md](./02-glossario.md) | Palavras técnicas em linguagem simples |
