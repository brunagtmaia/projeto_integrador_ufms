## Check-out 3 — Banco de dados e Backend (guia para iniciantes)

Este texto é o **mapa de trabalho** do check-out 3. Foi escrito para quem está começando: o que é Prisma, o que já foi feito, o que falta e em que ordem fazer.

**Branch Git:** `checkout3`  
**Escopo:** banco (SQLite + Prisma), rotas de API no Next.js, upload de foto, ligar as telas aos dados reais, **localização amigável** (GPS + autocomplete de endereço) e **teste ponta a ponta** (passo 13).  
**Não inclui:** login, cadastro, testes **automatizados** (isso é check-out 4).

Plano geral dos check-outs: [09-planejamento-checkouts.md](./09-planejamento-checkouts.md).  
MVP: [mpv.md](./mpv.md).  
Telas do front (já feitas): [10-checkout2-frontend-telas.md](./10-checkout2-frontend-telas.md).

---

## 1. Objetivo (em uma frase)

Fazer a denúncia **gravar de verdade** no banco, devolver um protocolo real, e as telas Acompanhar / Mapa / Prefeitura usarem esses dados (não mais só o mock).

---

## 2. Palavras que você vai ver (bem simples)

| Palavra | Significado |
| --- | --- |
| **Banco de dados** | Lugar onde as denúncias ficam salvas depois que a página fecha. |
| **SQLite** | Tipo de banco em **um arquivo** (`prisma/dev.db`). Não precisa instalar MySQL. |
| **Prisma** | Ferramenta que lê o arquivo `schema.prisma` e cria/atualiza esse `.db`. Também gera código para gravar/buscar sem escrever SQL. |
| **`schema.prisma`** | “Desenho” das tabelas (quais campos a denúncia tem). |
| **`model`** | Bloco dentro do schema que descreve **uma tabela** (ex.: `model Denuncia`). |
| **Migração** | Comando que aplica o desenho no arquivo do banco (`npm run db:migrate`). |
| **API** | Endereço tipo `/api/denuncias` que **grava ou busca** dados. Não é uma tela com botão. |
| **Geocode** | Transformar **texto de endereço** em números GPS (`lat`/`lng`), ou o contrário (GPS → nome da rua). |
| **Autocomplete** | Enquanto a pessoa digita, o site sugere endereços para ela **clicar e completar**. |
| **Nominatim** | Serviço **grátis** do OpenStreetMap que faz geocode. O formulário chama `/api/geocode` (nosso proxy); o proxy fala com o Nominatim. |
| **`.env`** | Arquivo **local** com `DATABASE_URL` e `ADMIN_PASSWORD`. Não vai para o GitHub. |
| **Prisma Studio** | Gerenciador visual no **navegador** (`npm run db:studio`) para ver tabelas e linhas. |
| **DB Browser for SQLite** | App de desktop (parecido com phpMyAdmin) que abre o arquivo `prisma/dev.db`. |

Mais palavras: [02-glossario.md](./02-glossario.md). Bibliotecas: [07-bibliotecas.md](./07-bibliotecas.md).

---

## 3. Decisões do grupo

| Decisão | Valor |
| --- | --- |
| Branch | `checkout3` |
| Banco | SQLite + Prisma |
| Backend | Rotas do Next.js em `app/api/...` (mesmo projeto do front) |
| Foto | Salvar em `public/uploads/` (arquivos **não** vão para o Git). A pessoa pode enviar **até 5 fotos** por denúncia |
| Senha da prefeitura | Só no `.env` (`ADMIN_PASSWORD`) — **sem** tabela de usuários |
| Campos no front | Manter nomes do mock: `id`, `endereco`, `descricao`, `status`, `lat`, `lng` |

### O que **não** fazer neste check-out

* Login, cadastro, “minhas denúncias”, e-mail
* PostGIS, PWA, vídeo
* Redesign das telas (o visual do check-out 2 fica)

---

## 4. Passos (ordem) e status

| Passo | O que é | Status |
| --- | --- | --- |
| **01** | Branch `checkout3` + arquivo `.env` | **Feito** |
| **02** | Instalar Prisma (`prisma` + `@prisma/client`) + `schema.prisma` base | **Feito** |
| **03** | Modelo `Denuncia` no `schema.prisma` | **Feito** |
| **04** | Migração (`npm run db:migrate`) → tabela no `dev.db` | **Feito** |
| **05** | `lib/prisma.js` + função de gerar protocolo | **Feito** |
| **06** | `POST /api/denuncias` (criar + upload de foto) | **Feito** |
| **07** | `GET` por protocolo e listagem | **Feito** |
| **08** | API marcar como resolvido (valida senha do `.env`) | **Feito** |
| **09** | Ligar tela `/denuncia` à API | **Feito** |
| **10** | Ligar `/acompanhar` | **Feito** |
| **11** | Ligar `/mapa` | **Feito** |
| **12** | Ligar `/prefeitura` | **Feito** |
| **13** | Teste ponta a ponta | **Feito** |

---

## 5. O que o passo 02 deixou pronto

Depois do `git pull` na branch `checkout3`, na pasta do projeto:

```bash
npm install
```

Isso baixa o **Prisma** junto com o resto.

### Pacotes

| Pacote | Onde no `package.json` | Para quê |
| --- | --- | --- |
| `@prisma/client` | `dependencies` | Código das APIs usa para falar com o banco |
| `prisma` | `devDependencies` | Comandos no terminal (`migrate`, `studio`, …) |

### Comandos npm (atalhos)

| Comando | O que faz |
| --- | --- |
| `npm run db:generate` | Atualiza o cliente Prisma sem criar migração |
| `npm run db:migrate` | Cria/atualiza o `dev.db` a partir do schema (**passo 04**) |
| `npm run db:studio` | Abre uma tela no navegador para **ver** as tabelas (útil para testar) |

### `.env` (lembrete)

```bash
cp .env.example .env
```

Conteúdo esperado (troque a senha se quiser):

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="prefeitura"
```

* `DATABASE_URL` — caminho do SQLite (arquivo em `prisma/dev.db`)
* `ADMIN_PASSWORD` — senha da tela Prefeitura (no check-out 3 sai do código e fica só aqui)

**Nunca** faça `git add .env`.

---

## 6. Passo 03 — o model `Denuncia` (o que acabamos de fazer)

### Em uma frase

Desenhamos **quais colunas** a tabela de denúncias tem. A tabela no arquivo `dev.db` foi criada no **passo 04** (logo abaixo).

### Onde olhar

Abra o arquivo:

```text
prisma/schema.prisma
```

Além da base (generator + datasource), existe o bloco:

```prisma
model Denuncia {
  id        String   @id
  endereco  String
  descricao String
  status    String
  lat       Float
  lng       Float
  foto      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### O que cada campo significa (para iniciantes)

| Campo | Tipo | Para quê |
| --- | --- | --- |
| `id` | texto (`String`) | Número do **protocolo** (ex.: `"748393"`). É a chave (`@id`). Usamos texto, não número, para não perder zeros. |
| `endereco` | texto | Rua / bairro que aparece na lista e nos cartões. |
| `descricao` | texto | O problema (mato alto, entulho…). |
| `status` | texto | Só dois valores no MVP: `"PENDENTE"` ou `"RESOLVIDO"` (maiúsculas, igual ao mock). |
| `lat` / `lng` | número decimal (`Float`) | GPS para o **mapa**. Endereço sozinho não coloca o pin. |
| `foto` | texto opcional (`String?`) | Caminho(s) da imagem. Com **uma** foto: `"/uploads/abc.jpg"`. Com **várias**: um texto JSON, ex.: `'["/uploads/a.jpg","/uploads/b.jpg"]'`. O `?` significa “pode ficar vazio”. (A API e o helper `lib/fotos-denuncia.js` leem os dois formatos.) |
| `createdAt` | data/hora | Quando a denúncia foi criada (Prisma preenche sozinho). |
| `updatedAt` | data/hora | Última alteração, ex.: marcar resolvido (Prisma atualiza sozinho). |

### Por que esses nomes?

O mock do front (`lib/denuncias-exemplo.js`) já usa `id`, `endereco`, `descricao`, `status`, `lat`, `lng`.  
Se o banco usar os **mesmos nomes**, as telas do check-out 2 quase não mudam quando ligarmos a API.

### Como conferir se o schema está ok

Na pasta do projeto (com `.env` existindo):

```bash
npx prisma validate
```

Se aparecer algo como “The schema … is valid”, o desenho está correto.

---

## 7. Passo 04 — migração (o que acabamos de fazer)

### Em uma frase

Pegamos o **desenho** do `schema.prisma` e **criamos a tabela de verdade** dentro do arquivo `prisma/dev.db`.

Pense assim:

* Passo 03 = planta da casa no papel  
* Passo 04 = a casa construída no terreno (o arquivo `.db`)

### O que foi gerado no projeto

| Item | Onde | Vai para o GitHub? |
| --- | --- | --- |
| Pasta da migração | `prisma/migrations/20260913201055_init_denuncia/` | **Sim** (é o histórico compartilhado) |
| SQL da tabela | `…/migration.sql` | **Sim** |
| Arquivo do banco | `prisma/dev.db` | **Não** (cada pessoa cria o seu) |

O arquivo `migration.sql` é o “recibo” em SQL do que o Prisma criou. Você **não precisa** editar esse SQL no dia a dia.

### O que cada pessoa do grupo precisa fazer (na própria máquina)

Depois de `git pull` na branch `checkout3`:

```bash
# 1) Na pasta que tem o package.json
npm install

# 2) Se ainda não tiver .env
cp .env.example .env

# 3) Aplicar a migração → cria/atualiza o SEU prisma/dev.db
npm run db:migrate
```

Se o terminal pedir um **nome** para a migração e a pasta `migrations/` **já** tiver a `init_denuncia`, em geral o Prisma só aplica o que falta (não cria outra). Se criar uma migração vazia, avise o grupo antes de commitir.

### Como conferir se deu certo

**Opção A — status no terminal**

```bash
npx prisma migrate status
```

Deve dizer algo como: banco em dia / “Database schema is up to date”.

**Opção B — ver a tabela no navegador (mais visual)**

```bash
npm run db:studio
```

Abre o Prisma Studio. Na lista de models, clique em **Denuncia**. A tabela existe (ainda sem linhas — as denúncias entram nas APIs, passo 06).

**Opção C — DB Browser for SQLite (app no computador, estilo phpMyAdmin)**

Útil na apresentação da faculdade para mostrar a **estrutura** e os **dados** do banco. O app é instalado no Mac; o arquivo do banco **continua só na pasta do projeto** (`prisma/dev.db` no SSD).

1. Instale o [DB Browser for SQLite](https://sqlitebrowser.org/) (Mac: site oficial ou `brew install --cask db-browser-for-sqlite`).
2. Abra o app e clique em **Open Database**.
3. No Finder, vá até a pasta do projeto e abra:

```text
…/projeto_integrador_ufms/prisma/dev.db
```

Exemplo no SSD deste grupo:

```text
/Volumes/SSD/development/ufms/projeto_integrador_ufms/prisma/dev.db
```

4. Aba **Database Structure** → veja a tabela **Denuncia** e as colunas.  
5. Aba **Browse Data** → veja as linhas (registros) da denúncia.

O banco **não** é copiado para fora do projeto: o DB Browser só abre o `.db` que já está em `prisma/`.

### O que o passo 04 **não** faz

| Ainda não | Isso é o passo… |
| --- | --- |
| Arquivo `lib/prisma.js` para o código das APIs | **05** |
| Rotas `/api/denuncias` (criar, buscar, listar, resolver) | **06–08** |
| Telas deixarem de usar o mock | **09–12** |

Ou seja: o **armário** (tabela) já existe; ainda não temos o **atendente** (API) guardando denúncias nele.

### Se o `dev.db` antigo der erro (“drift” / reset)

Às vezes existe um `dev.db` velho de testes anteriores, diferente do schema novo. Sintoma típico: o `migrate` pede para **resetar** o banco.

No MVP da disciplina (dados de teste local), pode apagar o banco antigo e migrar de novo:

```bash
# Cuidado: apaga as denúncias LOCAIS desse arquivo (não afeta o GitHub)
rm -f prisma/dev.db prisma/dev.db-journal
npm run db:migrate
```

**Não** delete a pasta `prisma/migrations/` — ela é o histórico que o grupo compartilha.

---

## 8. Passo 05 — `lib/prisma.js` + gerar protocolo (o que acabamos de fazer)

### Em uma frase

Criamos duas “ferramentas” na pasta `lib/` que as **APIs** vão usar: uma para **falar com o banco** e outra para **inventar um protocolo novo** sem repetir número.

Pense assim:

* Passo 04 = a **casa** (tabela no `dev.db`) já existe  
* Passo 05 = o **telefone** e o **carimbo de protocolo** prontos na mesa  
* Passo 06 = o **atendente** (API) que atende o cidadão e grava a denúncia

### O que foi criado

| Arquivo | Para quê |
| --- | --- |
| `lib/prisma.js` | Exporta `prisma` — a conexão única com o SQLite. Em vez de cada API fazer `new PrismaClient()`, todas importam daqui. |
| `lib/gerar-protocolo.js` | Exporta `gerarProtocoloUnico()` — sorteia um texto de **6 dígitos** (ex.: `"392847"`) e **confere no banco** se aquele `id` já existe. |

### Por que `lib/prisma.js` existe? (para iniciantes)

O PrismaClient é o objeto que faz coisas como:

```js
await prisma.denuncia.create({ ... })
await prisma.denuncia.findMany()
```

Se você criar `new PrismaClient()` em **vários** arquivos, no modo desenvolvimento (`npm run dev`) o Next.js recarrega o código muitas vezes e pode abrir **muitas** conexões com o mesmo `dev.db`. Por isso guardamos **uma** instância e a reaproveitamos.

**Como importar** (nas rotas de API, a partir do passo 06):

```js
import { prisma } from "@/lib/prisma";
// ou, se preferir caminho relativo:
// import { prisma } from "../../../lib/prisma";
```

O atalho `@/` aponta para a raiz do projeto (veja `jsconfig.json`).

### Por que `gerar-protocolo.js`?

No check-out 2 o botão Enviar **sorteava** um `id` da lista falsa (`sortearProtocoloExemplo`). Isso era só para demo.

No check-out 3 o protocolo precisa ser:

1. **Novo** — não pode ser um número que já está no banco  
2. **Texto** — igual ao campo `id` do schema (`String`)  
3. **Parecido com o mock** — 6 dígitos, para a tela de sucesso continuar igual (`?protocolo=748393`)

A função é **assíncrona** (`async` / `await`) porque precisa perguntar ao banco:

```js
import { gerarProtocoloUnico } from "@/lib/gerar-protocolo";

const protocolo = await gerarProtocoloUnico();
// protocolo === "482913" (exemplo)
```

**Quem chama?** Só o **servidor** (API). O navegador / as telas React **não** importam este arquivo. A tela só recebe o número depois que a API responder (passo 06).

### O que o passo 05 **não** faz

| Ainda não | Isso é o passo… |
| --- | --- |
| Rota `POST /api/denuncias` que grava a denúncia | **06** (já feito) |
| Buscar / listar (`GET`) | **07** (já feito) |
| Marcar resolvido (`PATCH`) | **08** (já feito) |
| Telas pararem de usar o mock | **09–12** |

Ou seja: no passo 05 as ferramentas estão na pasta `lib/`. As URLs `/api/denuncias` (criar, buscar) e `/api/denuncias/[id]/resolver` (marcar resolvido) já existem — veja as seções dos passos **06**, **07** e **08**.

### Como conferir (rápido)

1. Os dois arquivos existem em `lib/`.  
2. Depois de `npm install`, o Prisma Client já foi gerado (`npx prisma generate` ou `npm run db:generate`).  
3. O teste “de verdade” (gravar denúncia) é o **passo 06** abaixo.

---

## 9. Passo 06 — `POST /api/denuncias` (criar + upload) — o que acabamos de fazer

### Em uma frase

Criamos o **atendente no servidor**: a URL `/api/denuncias` recebe os dados + a(s) foto(s), grava no SQLite e devolve um **protocolo novo**.

Pense assim:

* Passo 04 = a **casa** (tabela)  
* Passo 05 = o **telefone** (`prisma`) e o **carimbo** (protocolo)  
* Passo 06 = alguém **atendendo** a chamada e guardando a denúncia

### Onde está o código?

```text
app/api/denuncias/route.js
```

No App Router do Next.js:

* pasta `app/api/denuncias/` + arquivo **`route.js`**  
* vira a URL: `http://localhost:3000/api/denuncias`

Isso **não** é uma tela com botão. É um endereço que o navegador (ou o `curl`) chama com `POST`. A tela `/denuncia` só vai usar isso no **passo 09**.

### O que a rota faz (passo a passo mental)

1. Lê um **FormData** (texto + arquivo(s) na mesma requisição).  
2. Confere se veio `endereco`, `descricao`, `lat`, `lng` e **pelo menos uma** `foto`.  
3. Lê **todas** as fotos com `formData.getAll("foto")` (pode vir 1 até **5** arquivos com o mesmo nome de campo).  
4. Salva cada imagem em `public/uploads/` com um nome único.  
5. Monta o texto do campo `foto` no banco (caminho único **ou** JSON se houver várias — ver `lib/fotos-denuncia.js`).  
6. Gera um protocolo com `gerarProtocoloUnico()`.  
7. Grava a linha no banco com `prisma.denuncia.create` (`status: "PENDENTE"`).  
8. Responde JSON com o protocolo (código HTTP **201** = criado).

### Campos que o `POST` espera (FormData)

| Campo | Tipo | Obrigatório? | Exemplo |
| --- | --- | --- | --- |
| `endereco` | texto | Sim | `Rua das Flores, 120` |
| `descricao` | texto | Sim | `Mato alto no terreno` |
| `lat` | texto número | Sim | `-23.561414` |
| `lng` | texto número | Sim | `-46.655881` |
| `foto` | arquivo de imagem (pode repetir) | Sim (MVP) — **1 a 5** arquivos | `foto.jpg` (JPG, PNG, WEBP ou GIF; máx. 5 MB **cada**) |

**Para iniciantes — o que é `getAll("foto")`?**  
No FormData, o nome do campo pode aparecer **mais de uma vez**.  
`formData.get("foto")` pega só a **primeira**.  
`formData.getAll("foto")` pega a **lista completa**. É assim que a API aceita várias fotos sem inventar campos `foto2`, `foto3`…

Se faltar algo, a API responde **400** com:

```json
{ "ok": false, "erro": "mensagem em português" }
```

### Resposta de sucesso (201)

```json
{
  "ok": true,
  "id": "125172",
  "protocolo": "125172",
  "denuncia": {
    "id": "125172",
    "endereco": "Rua Teste, 100",
    "descricao": "Mato alto no terreno",
    "status": "PENDENTE",
    "lat": -23.561414,
    "lng": -46.655881,
    "foto": "/uploads/1789404750654-4a5153e3-2b2.png",
    "fotos": ["/uploads/1789404750654-4a5153e3-2b2.png"],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

* `id` e `protocolo` são o **mesmo** número (texto de 6 dígitos).  
* `foto` na resposta JSON é a **primeira** imagem (caminho público). Assim as telas antigas que usam um único `<img src={denuncia.foto}>` continuam funcionando.  
* `fotos` é a **lista completa** (array). Se a pessoa enviou 3 imagens, aqui vêm as 3.  
* No disco, cada arquivo fica em `public/uploads/...` e o navegador abre em `http://localhost:3000/uploads/...`.  
* As fotos **não** sobem para o GitHub (já estão no `.gitignore`).

### Como testar agora (sem a tela pronta)

Com o site ligado (`npm run dev`), no **outro** terminal (na pasta do projeto):

```bash
# Troque o caminho da foto por uma imagem sua (jpg/png)
curl -s -X POST http://localhost:3000/api/denuncias \
  -F "endereco=Rua Teste, 100" \
  -F "descricao=Mato alto no terreno (teste passo 06)" \
  -F "lat=-23.561414" \
  -F "lng=-46.655881" \
  -F "foto=@./public/uploads/.gitkeep;type=image/png"
```

**Atenção:** o `.gitkeep` **não** é uma imagem de verdade — use um `.jpg` ou `.png` real da sua máquina, por exemplo:

```bash
curl -s -X POST http://localhost:3000/api/denuncias \
  -F "endereco=Av. Paulista, 1000" \
  -F "descricao=Entulho na calçada" \
  -F "lat=-23.561414" \
  -F "lng=-46.655881" \
  -F "foto=@/caminho/para/sua-foto.jpg;type=image/jpeg"
```

**Várias fotos no mesmo `POST`:** repita o `-F "foto=@..."` (até 5 vezes). Exemplo com duas:

```bash
curl -s -X POST http://localhost:3000/api/denuncias \
  -F "endereco=Av. Paulista, 1000" \
  -F "descricao=Entulho na calçada (duas fotos)" \
  -F "lat=-23.561414" \
  -F "lng=-46.655881" \
  -F "foto=@/caminho/para/foto1.jpg;type=image/jpeg" \
  -F "foto=@/caminho/para/foto2.jpg;type=image/jpeg"
```

Se der certo, você vê `"ok": true`, um `"protocolo"` e o array `"fotos"`.

**Conferir no banco (visual):**

```bash
npm run db:studio
```

Abra o model **Denuncia** — deve aparecer a linha nova com status `PENDENTE`.  
Se houver **várias** fotos, o campo `foto` no Studio pode aparecer como texto JSON (lista entre colchetes). Isso é **normal**.

**Conferir a foto:** na pasta `public/uploads/` deve ter um arquivo novo por imagem; no navegador, abra `http://localhost:3000` + um caminho de `fotos` da resposta (ex.: `/uploads/....png`).

### O que o passo 06 **não** faz

| Ainda não | Isso é o passo… |
| --- | --- |
| Buscar / listar (`GET`) | **07** (já feito) |
| Marcar como resolvido (senha do `.env`) | **08** (já feito — veja a seção do passo 08) |
| Botão Enviar da tela `/denuncia` chamar o `POST` | **09** (já feito — veja a seção do passo 09) |
| Acompanhar / mapa / prefeitura saírem do mock | **10–12** (já feitos) |

Ou seja: o backend **já sabe criar, buscar e resolver** denúncia. As telas `/denuncia`, `/acompanhar`, `/mapa` e `/prefeitura` **já usam** a API.

### Arquivos relacionados

| Arquivo | Papel neste passo |
| --- | --- |
| `app/api/denuncias/route.js` | A rota `POST` (e também o `GET` do passo 07) |
| `lib/prisma.js` | Conexão com o banco |
| `lib/gerar-protocolo.js` | Protocolo único |
| `lib/fotos-denuncia.js` | Lê/grava 1 ou várias fotos no campo `foto` (caminho ou JSON) |
| `public/uploads/` | Onde as fotos são salvas |
| `prisma/schema.prisma` | Campos da tabela `Denuncia` |

---

## 10. Passo 07 — `GET /api/denuncias` (buscar e listar) — o que acabamos de fazer

### Em uma frase

O mesmo endereço `/api/denuncias` agora também **lê** o banco: lista todas as denúncias **ou** acha uma pelo número do protocolo.

Pense assim:

* Passo 06 = **guardar** a denúncia (POST)  
* Passo 07 = **consultar** o que já está guardado (GET)

### Onde está o código?

No **mesmo** arquivo do POST:

```text
app/api/denuncias/route.js
```

No Next.js App Router, um `route.js` pode exportar várias funções:

* `export async function POST` → criar  
* `export async function GET` → buscar / listar  

A URL continua `http://localhost:3000/api/denuncias`. O que muda é o **método HTTP** (GET em vez de POST) e, às vezes, a **query string** (o pedaço depois do `?`).

### Duas formas de usar (importante para iniciantes)

| O que você quer | Como chamar | O que volta |
| --- | --- | --- |
| **Listar todas** (mapa / prefeitura depois) | `GET /api/denuncias` | `{ ok: true, denuncias: [ ... ] }` |
| **Buscar uma** pelo protocolo (acompanhar depois) | `GET /api/denuncias?protocolo=125172` | `{ ok: true, denuncia: { ... } }` |

**O que é query string?** É o texto depois do `?` na URL.  
Exemplo: em `/api/denuncias?protocolo=125172`, o parâmetro se chama `protocolo` e o valor é `125172`.

No código isso aparece assim:

```js
const { searchParams } = new URL(request.url);
const protocolo = searchParams.get("protocolo");
```

### O que a rota faz (passo a passo mental)

1. Lê a URL e pergunta: “veio `?protocolo=`?”  
2. **Se veio protocolo** → usa `prisma.denuncia.findUnique` (acha pelo `id`).  
   - Achou → **200** com `denuncia`.  
   - Não achou → **404** com mensagem em português.  
   - Protocolo vazio (`?protocolo=`) → **400**.  
3. **Se não veio protocolo** → usa `prisma.denuncia.findMany` (lista tudo).  
   - Ordena da **mais nova** para a **mais antiga** (`createdAt desc`).  
   - Responde **200** com `denuncias` (array; pode ser `[]` se o banco estiver vazio).

### Campos de cada denúncia na resposta

São os **mesmos nomes** do mock e do POST (para o front quase não mudar depois):

| Campo | Exemplo | Para quê |
| --- | --- | --- |
| `id` | `"125172"` | Protocolo |
| `endereco` | `"Rua Teste, 100"` | Título do cartão |
| `descricao` | `"Mato alto..."` | Texto do problema |
| `status` | `"PENDENTE"` ou `"RESOLVIDO"` | Selo / filtro |
| `lat`, `lng` | `-23.56`, `-46.65` | Pin no mapa |
| `foto` | `"/uploads/...jpg"` | **Primeira** imagem (compatível com um único `<img>`) |
| `fotos` | `["/uploads/...jpg", ...]` | Lista **completa** (1 a 5 caminhos) |
| `createdAt`, `updatedAt` | datas ISO | Quando criou / atualizou |

**Lembrete:** no banco o campo continua se chamando só `foto`. A API **monta** `foto` + `fotos` na resposta JSON com ajuda de `lib/fotos-denuncia.js`.

### Exemplos de JSON

**Lista (200):**

```json
{
  "ok": true,
  "denuncias": [
    {
      "id": "125172",
      "endereco": "Rua Teste, 100",
      "descricao": "Mato alto no terreno",
      "status": "PENDENTE",
      "lat": -23.561414,
      "lng": -46.655881,
      "foto": "/uploads/....png",
      "fotos": ["/uploads/....png"],
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

**Uma denúncia (200):**

```json
{
  "ok": true,
  "denuncia": {
    "id": "125172",
    "endereco": "Rua Teste, 100",
    "descricao": "Mato alto no terreno",
    "status": "PENDENTE",
    "lat": -23.561414,
    "lng": -46.655881,
    "foto": "/uploads/....png",
    "fotos": ["/uploads/....png"],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Não encontrada (404):**

```json
{
  "ok": false,
  "erro": "Não achamos nenhuma denúncia com esse protocolo."
}
```

### Como testar agora (sem as telas ligadas)

1. Deixe o `npm run dev` rodando.  
2. Crie uma denúncia com o `curl` do **passo 06** e anote o `"protocolo"`.  
3. No **outro** terminal:

```bash
# Listar todas
curl -s http://localhost:3000/api/denuncias

# Buscar uma (troque 125172 pelo protocolo que você recebeu)
curl -s "http://localhost:3000/api/denuncias?protocolo=125172"

# Protocolo que não existe → deve vir 404 e "ok": false
curl -s -o /dev/null -w "%{http_code}\n" \
  "http://localhost:3000/api/denuncias?protocolo=000000"
```

Dica: no navegador você também pode abrir  
`http://localhost:3000/api/denuncias`  
e ver o JSON da lista (GET é o método padrão do navegador).

### O que o passo 07 **não** faz

| Ainda não | Isso é o passo… |
| --- | --- |
| Marcar como resolvido (senha do `.env`) | **08** (já feito — veja a seção seguinte) |
| Tela `/acompanhar` chamar este GET | **10** (já feito — veja a seção do passo 10) |
| Tela `/mapa` usar a lista real | **11** (já feito — veja a seção do passo 11) |
| Tela `/prefeitura` filtrar pendentes do banco | **12** (já feito — veja a seção do passo 12) |

As telas **Acompanhar**, **Mapa** e **Prefeitura** já chamam este `GET` (passos 10, 11 e 12). A tela `/denuncia` já grava de verdade (passo 09).

### Arquivos relacionados

| Arquivo | Papel neste passo |
| --- | --- |
| `app/api/denuncias/route.js` | Função `GET` (+ `POST` do passo 06) |
| `lib/prisma.js` | `findUnique` / `findMany` |
| `prisma/schema.prisma` | Campo `id` = protocolo |

---

## 11. Passo 08 — marcar como resolvido (senha do `.env`) — o que acabamos de fazer

### Em uma frase

Criamos um endereço que a **prefeitura** chama para mudar o status de `PENDENTE` para `RESOLVIDO` **no banco**, mas **só** se a senha bater com a do arquivo `.env` (`ADMIN_PASSWORD`).

Pense assim:

* Passo 06 = **criar** a denúncia  
* Passo 07 = **ler** a denúncia  
* Passo 08 = **atualizar** o status (com senha)

Não existe tabela de usuários. É só **uma senha** no `.env` — combinado no MVP.

### Onde está o código?

```text
app/api/denuncias/[id]/resolver/route.js
```

### O que significa a pasta `[id]`? (para iniciantes)

No Next.js App Router, colchetes no nome da pasta = pedaço **dinâmico** da URL.

| Pasta no disco | URL de exemplo | Valor de `id` |
| --- | --- | --- |
| `app/api/denuncias/[id]/resolver/` | `/api/denuncias/125172/resolver` | `"125172"` |
| mesma pasta | `/api/denuncias/748393/resolver` | `"748393"` |

No código (Next.js 16) o `id` vem assim:

```js
export async function PATCH(request, context) {
  const { id } = await context.params; // precisa de await!
  // ...
}
```

### Método HTTP: `PATCH`

| Método | Ideia simples |
| --- | --- |
| `GET` | “Me mostre os dados” |
| `POST` | “Crie algo novo” |
| `PATCH` | “Mude só uma parte do que já existe” (aqui: o `status`) |

A URL completa fica:

```text
PATCH http://localhost:3000/api/denuncias/125172/resolver
```

### Corpo da requisição (JSON)

Não é FormData (isso era só no upload da foto). Aqui o corpo é **JSON**:

```json
{
  "senha": "prefeitura"
}
```

* O valor de `"senha"` deve ser **igual** ao `ADMIN_PASSWORD` do seu `.env`.  
* No `.env.example` o modelo usa `troque-esta-senha`; no guia do check-out 3 muitos usam `prefeitura` no `.env` local — use **o que estiver no seu** `.env`.  
* A senha **não** fica no código da tela (no passo 12 o front só **envia** o que a pessoa digitou; a comparação é no servidor).

### O que a rota faz (passo a passo mental)

1. Lê o `id` da URL (protocolo).  
2. Lê o JSON e confere se veio `senha`.  
3. Lê `process.env.ADMIN_PASSWORD` (do `.env`).  
4. Se a senha estiver **errada** → **401** (`"Senha incorreta."`) — **sem** mudar o banco.  
5. Se o protocolo **não existir** → **404**.  
6. Se já estiver `RESOLVIDO` → **200** de sucesso (não dá erro se clicar duas vezes).  
7. Se estiver `PENDENTE` → `prisma.denuncia.update` com `status: "RESOLVIDO"`.  
8. Responde **200** com a denúncia atualizada.

### Exemplos de JSON de resposta

**Sucesso (200):**

```json
{
  "ok": true,
  "denuncia": {
    "id": "125172",
    "endereco": "Rua Teste, 100",
    "descricao": "Mato alto no terreno",
    "status": "RESOLVIDO",
    "lat": -23.561414,
    "lng": -46.655881,
    "foto": "/uploads/....png",
    "fotos": ["/uploads/....png"],
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Senha errada (401):**

```json
{
  "ok": false,
  "erro": "Senha incorreta."
}
```

**Protocolo inexistente (404):**

```json
{
  "ok": false,
  "erro": "Não achamos nenhuma denúncia com esse protocolo."
}
```

### Como testar agora (sem a tela da prefeitura ligada)

1. Confira o `.env` — precisa ter `ADMIN_PASSWORD=...` (ex.: `prefeitura`).  
2. Deixe o `npm run dev` rodando.  
3. Crie uma denúncia com o `curl` do **passo 06** e anote o `"protocolo"`.  
4. No **outro** terminal (troque `125172` e a senha pelos seus):

```bash
# Marcar como resolvido (senha certa)
curl -s -X PATCH http://localhost:3000/api/denuncias/125172/resolver \
  -H "Content-Type: application/json" \
  -d '{"senha":"prefeitura"}'

# Senha errada → deve vir 401
curl -s -o /dev/null -w "%{http_code}\n" \
  -X PATCH http://localhost:3000/api/denuncias/125172/resolver \
  -H "Content-Type: application/json" \
  -d '{"senha":"errada"}'

# Conferir no GET se o status mudou
curl -s "http://localhost:3000/api/denuncias?protocolo=125172"
```

**Conferir no Prisma Studio:**

```bash
npm run db:studio
```

Abra **Denuncia** — o `status` deve ser `RESOLVIDO` e o `updatedAt` mais recente.

### O que o passo 08 **não** faz

| Ainda não | Isso é o passo… |
| --- | --- |
| Ligar `/denuncia` ao `POST` | **09** (já feito) |
| Ligar `/acompanhar` | **10** (já feito) |
| Ligar `/mapa` | **11** (já feito) |
| Tela `/prefeitura` chamar este `PATCH` | **12** (já feito — veja a seção do passo 12) |

Ou seja: o backend **já sabe** resolver denúncia. As quatro telas do fluxo (`/denuncia`, `/acompanhar`, `/mapa`, `/prefeitura`) já usam a API.

### Arquivos relacionados

| Arquivo | Papel neste passo |
| --- | --- |
| `app/api/denuncias/[id]/resolver/route.js` | A rota `PATCH` |
| `.env` / `.env.example` | `ADMIN_PASSWORD` |
| `lib/prisma.js` | `findUnique` + `update` |
| `prisma/schema.prisma` | Campo `status` (`PENDENTE` / `RESOLVIDO`) |

---

## 12. Passo 09 — ligar a tela `/denuncia` à API — o que acabamos de fazer

### Em uma frase

A tela **Nova denúncia** deixou de sortear um protocolo falso: agora ela **envia** endereço, descrição, lat/lng e **uma ou mais fotos** para `POST /api/denuncias` e, se der certo, abre a tela de sucesso com o **protocolo real** do banco.

Pense assim:

* Passo 06 = o **atendente** no servidor (API) já sabia gravar  
* Passo 09 = o **balcão** (formulário) finalmente fala com esse atendente

### O que mudou no código?

| Antes (check-out 2) | Agora (passo 09) |
| --- | --- |
| `BotaoEnviarDenuncia` sorteava um `id` do mock | Removido — não usamos mais |
| Campos eram só “desenho” (div / botão sem gravar) | Inputs de verdade + `FormData` |
| Protocolo vinha de `sortearProtocoloExemplo()` | Protocolo vem da resposta da API |
| Só “Tirar Foto” sem prévia clara | **Carrossel** com pré-visualização, excluir e adicionar mais fotos |
| Localização era texto solto (sem GPS útil na prática) | **GPS** + **autocomplete** de endereço; lat/lng vão escondidos para o mapa |

### Arquivos importantes

| Arquivo | Papel |
| --- | --- |
| `app/denuncia/page.js` | Página da rota `/denuncia`: só o **título da aba** (`metadata`) + chama o formulário. Continua **sem** `"use client"` para o metadata funcionar. |
| `components/denuncia/FormularioDenuncia.js` | Formulário **cliente**: localização (GPS + autocomplete), carrossel de fotos, `fetch` do `POST`, mensagens de erro e o CSS (mesmo visual do check-out 2). |
| `app/api/denuncias/route.js` | API que já existia (passo 06) — o front só passou a chamá-la. |
| `app/api/geocode/route.js` | Proxy de endereços: busca sugestões e “traduz” GPS → texto (Nominatim). |
| `lib/fotos-denuncia.js` | Helper compartilhado: transforma caminho / JSON do banco em lista de fotos na resposta. |
| `app/denuncia/sucesso/page.js` | Quase igual: continua lendo `?protocolo=` na URL. |

### Por que o formulário é um arquivo separado?

No Next.js App Router:

* Arquivos com `"use client"` **não** podem exportar `metadata` (título da aba).  
* Por isso: `page.js` no servidor + `FormularioDenuncia.js` no navegador.

É o mesmo motivo pelo qual, no check-out 2, o botão Enviar era um componente separado.

### O que a pessoa preenche

| Campo na tela | Nome no FormData | Obrigatório? |
| --- | --- | --- |
| Localização (texto) | `endereco` | Sim |
| Latitude / Longitude | `lat` / `lng` | Sim para a API e o mapa — mas a pessoa **não digita** esses números (veja a melhoria abaixo) |
| Foto(s) | `foto` (repetido) | Sim — **pelo menos 1**, até **5** (JPG, PNG, WEBP ou GIF; máx. 5 MB cada) |
| Descrição | `descricao` | Sim |

**Ideia importante (para iniciantes):**  
O pin no mapa **não entende** “Rua das Flores, 120” sozinho. Ele precisa de dois números: `lat` e `lng`.  
Por isso o formulário **ainda envia** `lat` e `lng` no `FormData` — só que a pessoa não vê caixas com números. Ela usa o **GPS** ou **escolhe um endereço da lista**.

### Melhoria: localização com GPS + autocomplete (para iniciantes)

Digitar latitude e longitude à mão é difícil para quem não é programador. Por isso a tela `/denuncia` ficou assim:

#### O que a pessoa vê na tela

| Situação | O que aparece |
| --- | --- |
| Começo | Botão **Usar minha localização** + campo para digitar o endereço |
| Clicou no GPS e o navegador autorizou | O endereço é preenchido sozinho (quando possível) e aparece **Localização pronta para o mapa** |
| GPS falhou ou a pessoa negou a permissão | Mensagem pedindo para **digitar o endereço** (o campo ganha foco) |
| Digitando o endereço (3+ letras) | Lista de **sugestões**; a pessoa **clica** numa para completar |
| Ainda não tem GPS nem sugestão escolhida | O botão **Enviar** avisa: precisa escolher da lista ou usar o GPS |

A pessoa **não** vê mais os campos “Latitude” e “Longitude”.

#### Duas formas de obter o ponto no mapa

```text
Opção A — GPS
  [ Usar minha localização ]
           ↓
  navegador pede permissão
           ↓
  lat/lng do celular/computador
           ↓
  GET /api/geocode?lat=...&lng=...   ← “reverse” = GPS vira nome da rua
           ↓
  campo Localização preenchido

Opção B — Digitar
  digita "Av. Paulista..."
           ↓
  espera um pouquinho (debounce)
           ↓
  GET /api/geocode?q=Av.+Paulista...  ← busca sugestões
           ↓
  pessoa clica numa sugestão
           ↓
  endereco + lat + lng preenchidos
```

#### Por que existe `/api/geocode`?

O formulário **não** conversa direto com o Nominatim (OpenStreetMap). Ele chama **nossa** API:

| URL | O que faz |
| --- | --- |
| `GET /api/geocode?q=Paulista` | Devolve até 5 sugestões `{ label, lat, lng }` |
| `GET /api/geocode?lat=-23.56&lng=-46.65` | Devolve o texto do endereço perto desse ponto |

Arquivo: `app/api/geocode/route.js`.

**Por que um “proxy”?**  
O Nominatim pede um `User-Agent` identificando o app e não gosta de muitas requisições. No servidor fica mais fácil cumprir isso. O front só faz `fetch("/api/geocode?...")`.

#### Teste rápido só da API de endereço (`curl`)

Com o `npm run dev` ligado:

```bash
# Busca (autocomplete)
curl -s "http://localhost:3000/api/geocode?q=Av.%20Paulista%20Sao%20Paulo"

# Reverse (GPS → texto)
curl -s "http://localhost:3000/api/geocode?lat=-23.561414&lng=-46.655881"
```

Você deve ver JSON com `"ok": true`.

#### Palavras novas nesta melhoria

| Palavra | Significado simples |
| --- | --- |
| **Geolocalização do navegador** | `navigator.geolocation` — o Chrome/Firefox perguntam “pode usar sua localização?” e devolvem `lat`/`lng`. |
| **Reverse geocode** | Números GPS → texto de rua. |
| **Debounce** | Esperar a pessoa **parar de digitar** um pouco antes de buscar (ex.: 400 ms). Evita mil pedidos enquanto ela digita. |
| **Sugestão** | Um item da lista; ao clicar, preenche endereço **e** coordenadas. |

Isso **não** muda o `POST /api/denuncias`: a API continua recebendo `endereco`, `lat`, `lng` e foto(s). Só mudou **como** a pessoa informa o lugar.

### Melhoria: várias fotos com carrossel (para iniciantes)

Na seção **Adicionar Mídia** a pessoa não vê só o nome do arquivo. Ela vê a **foto de verdade** e pode juntar mais de uma.

#### O que a pessoa vê na tela

| Situação | O que aparece |
| --- | --- |
| Nenhuma foto ainda | Botão **Adicionar foto** (área tracejada) |
| Já tem foto(s) | **Carrossel**: imagem grande + setas (se tiver mais de uma) + contador `1 / 3` + bolinhas |
| Em cada foto | Botão **X** no canto para **excluir** aquela imagem |
| Ainda cabe mais (máx. 5) | Botão **Adicionar outra foto** embaixo do carrossel |

#### Ideia em português (sem jargão)

1. Cada foto escolhida vira um item na lista `fotos` (arquivo + URL de prévia).  
2. A **pré-visualização** usa `URL.createObjectURL(arquivo)` — o navegador cria um endereço temporário só para mostrar a imagem **antes** de enviar.  
3. Ao **excluir**, a gente tira o item da lista e libera essa URL (`URL.revokeObjectURL`) para não gastar memória à toa.  
4. No **Enviar**, o formulário faz `formData.append("foto", arquivo)` **uma vez por foto**. A API recebe todas com `getAll("foto")`.

```text
[ Adicionar foto ]  →  escolhe imagem  →  aparece no carrossel
                              ↓
                    [ ← ]  [ foto + X ]  [ → ]
                              ↓
                    [ Adicionar outra foto ]
```

#### Por que não criamos 5 colunas no banco?

O schema já tinha **um** campo `foto` (texto). Em vez de uma migração grande, guardamos:

* 1 foto → `"/uploads/a.jpg"` (igual ao MVP antigo)  
* várias → `'["/uploads/a.jpg","/uploads/b.jpg"]'` (texto JSON)

O arquivo `lib/fotos-denuncia.js` esconde essa diferença: as telas recebem sempre `foto` (a primeira) e `fotos` (a lista).

### O que o clique em “Enviar Denúncia” faz (passo a passo mental)

1. Confere se endereço, descrição, lat, lng e **pelo menos uma foto** estão preenchidos.  
   (lat/lng vêm do GPS ou da sugestão clicada — a pessoa não digita os números.)  
2. Monta um `FormData` com esses campos (todas as fotos no campo `foto`).  
3. Chama `fetch("/api/denuncias", { method: "POST", body: formData })`.  
4. Se a API responder erro (`ok: false`) → mostra a mensagem em vermelho na tela.  
5. Se responder sucesso (`201` + `protocolo`) → navega para:

```text
/denuncia/sucesso?protocolo=482913
```

(o número é o que o banco gerou — não é mais um id do mock)

### Como testar na tela (sem curl)

1. `npm run dev` e abra [http://localhost:3000/denuncia](http://localhost:3000/denuncia).  
2. Clique em **Usar minha localização** (aceite a permissão) **ou** digite um endereço (ex.: `Av. Paulista São Paulo`) e **escolha uma sugestão** da lista.  
3. Confira se aparece **Localização pronta para o mapa**.  
4. Preencha a descrição.  
5. Clique em **Adicionar foto** e escolha uma imagem pequena — deve aparecer a **pré-visualização**.  
6. (Opcional) Clique em **Adicionar outra foto**, navegue com as setas e teste o **X** para excluir.  
7. Clique em **Enviar Denúncia**.  
8. Deve abrir a tela de sucesso com um protocolo **novo** (6 dígitos).  
9. Confira no banco:

```bash
npm run db:studio
```

Abra **Denuncia** — a linha nova deve ter o mesmo protocolo e `status: PENDENTE`.  
As fotos devem existir em `public/uploads/` (um arquivo por imagem).

### O que o passo 09 **não** faz

| Ainda não | Isso é o passo… |
| --- | --- |
| Tela Acompanhar buscar no banco | **10** (já feito — veja a seção seguinte) |
| Prefeitura usar senha do `.env` + `PATCH` | **12** (já feito — veja a seção do passo 12) |

### Arquivos relacionados

| Arquivo | Papel neste passo |
| --- | --- |
| `components/denuncia/FormularioDenuncia.js` | Formulário + GPS/autocomplete + carrossel + `fetch` |
| `app/denuncia/page.js` | Rota `/denuncia` + metadata |
| `app/api/denuncias/route.js` | `POST` (já feito no passo 06; aceita várias fotos) |
| `app/api/geocode/route.js` | Busca de endereço e reverse do GPS |
| `lib/fotos-denuncia.js` | Serializar / ler lista de fotos |
| `components/denuncia/TelaSucessoDenuncia.js` | Mostra o protocolo da URL |

---

## 13. Passo 10 — ligar a tela `/acompanhar` à API — o que acabamos de fazer

### Em uma frase

A tela **Acompanhar denúncia** deixou de procurar na lista falsa (`lib/denuncias-exemplo.js`) e passou a chamar `GET /api/denuncias?protocolo=...` — ou seja, consulta o **mesmo banco** em que a denúncia foi gravada no passo 09.

Pense assim:

* Passo 07 = o **atendente** no servidor já sabia buscar pelo protocolo  
* Passo 09 = a pessoa **cria** a denúncia e ganha um número  
* Passo 10 = a pessoa **consulta** esse número na tela Acompanhar

### O que mudou no código?

| Antes (check-out 2) | Agora (passo 10) |
| --- | --- |
| `buscarDenunciaPorProtocolo()` no mock | Removido desta tela |
| `setTimeout` de 500 ms (só para animar “Buscando…”) | `await fetch(...)` de verdade |
| Só achava ids tipo `748393` da lista exemplo | Acha **qualquer** protocolo que exista no `dev.db` |
| Não mostrava foto | Se a API devolver `foto` / `fotos`, a(s) imagem(ns) aparecem (dá para deslizar se houver mais de uma) |

### Arquivos importantes

| Arquivo | Papel |
| --- | --- |
| `components/acompanhar/TelaAcompanhar.js` | Formulário + estados + `fetch` do `GET` |
| `app/acompanhar/page.js` | Rota `/acompanhar` + `metadata` + `Suspense` (não mudou a ideia) |
| `app/api/denuncias/route.js` | Função `GET` (já existia no passo 07) |

### Estados da tela (para iniciantes)

A UI continua com os mesmos “modos” do check-out 2, mais um de erro de rede:

| Estado | Quando | O que a pessoa vê |
| --- | --- | --- |
| Vazio (`null`) | Acabou de abrir / campo vazio no Buscar | Só o formulário |
| Carregando | Clicou em Buscar | “Buscando protocolo…” |
| Encontrado | API respondeu `200` com `denuncia` | Protocolo, endereço, descrição, selo, foto(s) (se houver) |
| Não encontrado | API respondeu `404` | “Não achamos esse protocolo” |
| Erro | Rede caiu ou servidor respondeu mal | Mensagem amigável (ex.: “Confira se o npm run dev está rodando”) |

### O que o clique em “Buscar” faz (passo a passo mental)

1. Lê o texto do campo e tira espaços (`trim`).  
2. Se estiver vazio → limpa o resultado e não chama a API.  
3. Mostra “Buscando…”.  
4. Chama:

```text
GET /api/denuncias?protocolo=482913
```

5. Se vier **404** → estado “não encontrado”.  
6. Se vier **200** com `{ ok: true, denuncia: { ... } }` → mostra o cartão.  
7. Se a rede falhar → estado “erro” (não confunde com “não encontrado”).

### Pré-preencher pela URL (igual ao check-out 2)

Se a pessoa veio da tela de sucesso, a URL pode ser:

```text
/acompanhar?protocolo=482913
```

O campo já abre com esse número. Ela ainda precisa clicar em **Buscar** (assim fica claro que a consulta aconteceu).

### Como testar na tela (fluxo completo com o passo 09)

1. `npm run dev` e abra [http://localhost:3000/denuncia](http://localhost:3000/denuncia).  
2. Envie uma denúncia com **uma ou mais fotos** → anote o protocolo da tela de sucesso.  
3. Vá em **Acompanhar** (ou use o link da tela de sucesso).  
4. Digite (ou confira) o protocolo e clique em **Buscar**.  
5. Deve aparecer **Pendente**, endereço, descrição e a(s) **foto(s)** (se enviou várias, deslize horizontalmente).  
6. Teste um número inventado (ex.: `000000`) → “Não achamos esse protocolo”.

**Dica:** o protocolo `748393` do mock antigo **só** aparece no Acompanhar se alguém criou essa denúncia de verdade no **seu** `dev.db`. Depois do passo 10, a fonte da verdade é o banco, não o arquivo `denuncias-exemplo.js`.

### O que o passo 10 **não** faz

| Ainda não | Isso é o passo… |
| --- | --- |
| Mapa listar denúncias do banco | **11** (já feito — veja a seção seguinte) |
| Prefeitura usar senha do `.env` + `PATCH` | **12** (já feito) |
| Teste ponta a ponta documentado (denunciar → acompanhar → mapa → resolver) | **13** (já feito — veja a seção do passo 13) |

### Arquivos relacionados

| Arquivo | Papel neste passo |
| --- | --- |
| `components/acompanhar/TelaAcompanhar.js` | UI + `fetch` |
| `app/acompanhar/page.js` | Rota `/acompanhar` |
| `app/api/denuncias/route.js` | `GET ?protocolo=` (passo 07) |
| `lib/denuncias-exemplo.js` | **Não** usado mais por esta tela |

---

## 14. Passo 11 — ligar a tela `/mapa` à API — o que acabamos de fazer

### Em uma frase

A tela **Mapa** deixou de desenhar os 5 pontos falsos de `lib/denuncias-exemplo.js` e passou a chamar `GET /api/denuncias` (sem `?protocolo=`) — ou seja, mostra **todas** as denúncias que estão no **seu** `dev.db`.

Pense assim:

* Passo 07 = o **atendente** no servidor já sabia **listar** tudo  
* Passo 09 = a pessoa **cria** a denúncia (com lat/lng)  
* Passo 11 = o **mapa** e a **lista** ao lado usam essa lista real

### O que mudou no código?

| Antes (check-out 2) | Agora (passo 11) |
| --- | --- |
| `import { DENUNCIAS_EXEMPLO, CENTRO_MAPA }` | Só importa `CENTRO_MAPA` (ponto inicial do mapa) |
| Lista fixa no arquivo | `useState` + `fetch("/api/denuncias")` ao abrir a tela |
| Sem estado de carregamento / erro de rede | “Carregando…”, erro com “Tentar de novo”, lista vazia amigável |
| Rodapé dizia “pontos de exemplo” | Diz que os pontos vêm do banco |

### Arquivos importantes

| Arquivo | Papel |
| --- | --- |
| `components/mapa/TelaMapa.js` | Busca a lista, filtro, cartões e passa os pontos ao Leaflet |
| `components/mapa/MapaLeaflet.js` | Desenha o mapa (quase igual — continua recebendo `denuncias={lista}`) |
| `app/mapa/page.js` | Rota `/mapa` + título da aba (não mudou a ideia) |
| `app/api/denuncias/route.js` | Função `GET` **sem** query → `{ ok, denuncias: [...] }` (passo 07) |

### Por que ainda existe `CENTRO_MAPA`?

O Leaflet precisa de um **centro inicial** (latitude/longitude) antes de saber onde estão os pins.  
`CENTRO_MAPA` continua sendo um ponto em São Paulo (perto dos exemplos antigos). Quando a lista chega, o botão **Centralizar** / o `fitBounds` enquadra os pontos reais.

**Não** confundir: a **lista de casos** não vem mais do mock — só o centro padrão.

### Estados da tela (para iniciantes)

| Estado | Quando | O que a pessoa vê |
| --- | --- | --- |
| Carregando | Acabou de abrir / pediu “Tentar de novo” | “Carregando denúncias do banco…” |
| Erro | Rede caiu ou a API respondeu mal | Mensagem + botão **Tentar de novo** |
| Lista vazia (banco vazio) | API ok, mas `denuncias: []` | “Nenhuma denúncia no banco” + dica de criar em Nova denúncia |
| Filtro sem resultado | Há denúncias, mas nenhuma com aquele status | “Nenhum caso neste filtro” |
| Ok | Há itens no filtro atual | Mapa com pins + cartões (Pendentes / Resolvidos / Todos) |

### O que acontece ao abrir `/mapa` (passo a passo mental)

1. A tela mostra “Carregando…”.  
2. Chama:

```text
GET /api/denuncias
```

3. Se der erro de rede / 500 → estado “erro”.  
4. Se vier `{ ok: true, denuncias: [ ... ] }` → guarda o array no `useState`.  
5. O botão **Filtrar** continua só no **front**: filtra esse array por `PENDENTE` / `RESOLVIDO` / todos (não chama a API de novo).  
6. Clicar num cartão ainda faz o mapa voar até aquele `lat`/`lng` (igual ao check-out 2).

### Como testar na tela (fluxo com os passos 09 e 10)

1. `npm run dev` e abra [http://localhost:3000/denuncia](http://localhost:3000/denuncia).  
2. Envie uma denúncia (use o GPS **ou** digite o endereço e escolha uma sugestão).  
3. Abra [http://localhost:3000/mapa](http://localhost:3000/mapa).  
4. Deve aparecer o **pin** e o **cartão** com o endereço e o protocolo novo.  
5. Teste o filtro (Todos → Pendentes → Resolvidos).  
6. Se o banco estiver vazio (máquina nova), a mensagem “Nenhuma denúncia no banco” é **normal** — não é bug.

**Dica:** os protocolos `748393`, `748401`… do mock antigo **só** aparecem no mapa se alguém criou essas denúncias de verdade no **seu** `dev.db`. Depois do passo 11, a fonte da verdade é o banco.

**Atualizar a lista:** recarregue a página (F5). O MVP não faz “ao vivo” (WebSocket) — isso fica fora do escopo.

### O que o passo 11 **não** faz

| Ainda não | Isso é o passo… |
| --- | --- |
| Prefeitura usar senha do `.env` + `PATCH` | **12** (já feito) |
| Teste ponta a ponta documentado (denunciar → acompanhar → mapa → resolver) | **13** (já feito — veja a seção do passo 13) |

Marcar como resolvido **no mapa** (o quadradinho do cartão) continua só visual — a ação de verdade é na tela **Prefeitura**.

### Arquivos relacionados

| Arquivo | Papel neste passo |
| --- | --- |
| `components/mapa/TelaMapa.js` | UI + `fetch` da lista |
| `components/mapa/MapaLeaflet.js` | Pins no OpenStreetMap |
| `app/mapa/page.js` | Rota `/mapa` |
| `app/api/denuncias/route.js` | `GET` listar (passo 07) |
| `lib/denuncias-exemplo.js` | Só `CENTRO_MAPA` para o mapa (lista mock aposentada) |

---

## 15. Passo 12 — ligar a tela `/prefeitura` à API — o que acabamos de fazer

### Em uma frase

A tela **Prefeitura** deixou de usar a senha fixa `prefeitura` no código e a lista falsa: agora ela **confere a senha no servidor** (`.env` → `ADMIN_PASSWORD`), **lista pendentes do banco** e **grava** `RESOLVIDO` com o `PATCH` do passo 08.

Pense assim:

* Passo 08 = o **atendente** no servidor já sabia validar senha e mudar o status  
* Passo 07 = o atendente já sabia **listar** todas as denúncias  
* Passo 12 = o **balcão** (tela Prefeitura) finalmente usa os dois

### O que mudou no código?

| Antes (check-out 2) | Agora (passo 12) |
| --- | --- |
| `const SENHA_TESTE = "prefeitura"` no JS | Removido — senha só no `.env` |
| Lista vinha de `DENUNCIAS_EXEMPLO` | `GET /api/denuncias` + filtro `PENDENTE` |
| “Resolver” só mudava `useState` | `PATCH /api/denuncias/[id]/resolver` |
| Recarregar a página “desfazia” o resolvido | Continua `RESOLVIDO` no SQLite |

### Arquivos importantes

| Arquivo | Papel |
| --- | --- |
| `components/prefeitura/TelaPrefeitura.js` | Senha + lista + `fetch` (GET e PATCH) |
| `app/prefeitura/page.js` | Rota `/prefeitura` + `metadata` |
| `app/api/denuncias/route.js` | `GET` listar (passo 07) |
| `app/api/denuncias/[id]/resolver/route.js` | `PATCH` resolver (passo 08) |
| `.env` | `ADMIN_PASSWORD` (não vai para o Git) |

### Como a senha é conferida? (para iniciantes)

Não existe uma URL `/api/login`. Para não inventar uma API nova, a tela faz assim ao clicar em **Entrar**:

1. Manda um `PATCH` com um protocolo **inventado** (`__teste_senha__`) e a senha digitada.  
2. A API do passo 08 **sempre** confere a senha **antes** de procurar o protocolo.  
3. Se a senha estiver **errada** → responde **401** → a tela mostra erro e **não** abre a lista.  
4. Se a senha estiver **certa** → o protocolo de teste não existe → responde **404** → a tela entende “senha ok” e aí chama o `GET` da lista.

Depois, em cada **Marcar como resolvido**, a mesma senha (ainda na memória da tela) vai de novo no corpo do `PATCH` com o protocolo real.

```text
Entrar:
  PATCH /api/denuncias/__teste_senha__/resolver  +  { "senha": "..." }
  → 401 = senha errada
  → 404 = senha certa (protocolo fake não existe)
  GET  /api/denuncias
  → filtra status === "PENDENTE"

Marcar resolvido:
  PATCH /api/denuncias/482913/resolver  +  { "senha": "..." }
  → 200 = sumiu da lista (agora está RESOLVIDO no banco)
```

### Estados da tela

| Situação | O que a pessoa vê |
| --- | --- |
| Não autenticado | Campo de senha + botão Entrar |
| Senha errada / `.env` faltando | Mensagem vermelha (401 ou 500 explicado) |
| Entrando / carregando lista | “Entrando…” / “Carregando pendentes…” |
| Lista vazia | “Nenhuma pendente” + dica de criar em Nova denúncia |
| Com pendentes | Cartões + botão **Marcar como resolvido** |
| Salvando um item | Botão daquele cartão vira “Salvando…” |
| Erro de rede | Mensagem pedindo para checar o `npm run dev` |

### Como testar na tela

1. Confira o `.env`:

```text
ADMIN_PASSWORD="prefeitura"
```

(Use o valor que **você** colocou; depois de editar, **reinicie** o `npm run dev`.)

2. Crie uma denúncia em [http://localhost:3000/denuncia](http://localhost:3000/denuncia) e anote o protocolo.  
3. Abra [http://localhost:3000/prefeitura](http://localhost:3000/prefeitura).  
4. Digite a senha **errada** → deve aparecer erro e **não** mostrar a lista.  
5. Digite a senha **certa** → deve listar as pendentes (incluindo a que você criou).  
6. Clique em **Marcar como resolvido** → o cartão some.  
7. Abra Acompanhar com o mesmo protocolo → selo **Resolvido**.  
8. Abra o Mapa (recarregue) → o ponto deve aparecer como resolvido no filtro.  
9. Recarregue `/prefeitura`, entre de novo → aquela denúncia **não** volta como pendente (prova de que gravou no banco).

### O que o passo 12 **não** faz

| Ainda não | Isso é o passo… |
| --- | --- |
| Roteiro único denunciar → … → resolver (conferido) | **13** (já feito — veja a seção seguinte) |
| Login com usuários / papéis admin | Fora do MVP ([06-trabalhos-futuros.md](./06-trabalhos-futuros.md)) |

### Arquivos relacionados (resumo)

| Arquivo | Papel neste passo |
| --- | --- |
| `components/prefeitura/TelaPrefeitura.js` | UI + autenticação simples + `fetch` |
| `app/api/denuncias/[id]/resolver/route.js` | Compara senha com `ADMIN_PASSWORD` |
| `.env` / `.env.example` | Modelo da senha |

---

## 16. Passo 13 — teste ponta a ponta — o que acabamos de fazer

### Em uma frase

Rodamos (e documentamos) o caminho **inteiro** do MVP: criar denúncia → ver protocolo → acompanhar → ver no mapa → marcar resolvido na prefeitura — e conferimos que **tudo ficou gravado no banco** (não some ao recarregar).

Pense assim:

* Passos 01–12 = construir as peças (banco, APIs, telas)  
* Passo 13 = **montar o brinquedo e apertar o botão** para ver se funciona de ponta a ponta

**“Ponta a ponta”** = do primeiro clique do cidadão até o último clique da prefeitura, sem “buracos” (mock, senha no código, status que some no F5).

### Por que este passo existe?

No check-out 2 cada tela podia “mentir” sozinha (lista falsa). No check-out 3 as peças já estão ligadas — mas uma pessoa pode testar só `/denuncia` e outra só `/mapa`. O passo 13 força **um único protocolo** a atravessar **todas** as telas.

### Antes de começar (checklist rápido)

Na pasta do projeto (a que tem `package.json`):

```bash
# 1) Branch certa
git checkout checkout3
git pull

# 2) Bibliotecas + banco local
npm install
cp .env.example .env   # só se ainda não tiver .env
npm run db:migrate

# 3) Ligar o site (deixe este terminal aberto)
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).  
Se a porta 3000 estiver ocupada, o terminal mostra outra (ex.: `3010`) — use **essa**.

Confira o `.env`:

```env
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="prefeitura"
```

Use **o valor que você colocou** em `ADMIN_PASSWORD` (depois de editar, **reinicie** o `npm run dev`).

### Roteiro A — no navegador (o que a professora / o grupo vai ver)

Faça **nesta ordem**, anotando o protocolo em um papel ou no bloco de notas.

| # | Onde | O que fazer | O que deve acontecer |
| --- | --- | --- | --- |
| 1 | `/denuncia` | Use **Usar minha localização** **ou** digite o endereço e **escolha uma sugestão**; preencha descrição; adicione **1 ou mais fotos** (pré-visualização no carrossel) e clique em **Enviar Denúncia** | Vai para `/denuncia/sucesso?protocolo=XXXXXX` com um número **novo** de 6 dígitos |
| 2 | Sucesso | Anote o protocolo. Clique em **Acompanhar** (ou abra `/acompanhar`) | Campo pode já vir com o número |
| 3 | `/acompanhar` | Clique em **Buscar** | Cartão com endereço, descrição, selo **Pendente** e a(s) **foto(s)** |
| 4 | `/mapa` | Abra a tela e, se precisar, **recarregue** (F5) | Pin + cartão com o mesmo protocolo; filtro “Pendentes” deve mostrar |
| 5 | `/prefeitura` | Digite a senha **errada** → Entrar | Mensagem de erro; **não** abre a lista |
| 6 | `/prefeitura` | Digite a senha **certa** (do `.env`) → Entrar | Lista de pendentes inclui a denúncia nova |
| 7 | `/prefeitura` | **Marcar como resolvido** nessa denúncia | O cartão some da lista de pendentes |
| 8 | `/acompanhar` | Busque de novo o **mesmo** protocolo (F5 se precisar) | Selo **Resolvido** |
| 9 | `/mapa` | Recarregue e filtre “Resolvidos” / “Todos” | O ponto aparece como resolvido |
| 10 | Prova do banco | Em `/prefeitura`, clique em **Sair**, entre de novo **ou** feche a aba e abra de novo | Aquela denúncia **não** volta como pendente |

Se os 10 itens passaram: o check-out 3 está **funcional** na sua máquina.

### Roteiro B — só com a API (`curl`) — para quem gosta de terminal

Útil quando a tela “parece estranha”, mas você quer saber se o **backend** está ok. Com o `npm run dev` rodando, em **outro** terminal:

```bash
# Troque a porta se o Next avisou outra (ex.: 3010)
BASE=http://localhost:3000

# 1) Criar (use um .jpg/.png real da sua máquina)
curl -s -X POST "$BASE/api/denuncias" \
  -F "endereco=Rua Passo 13, 100" \
  -F "descricao=Teste ponta a ponta" \
  -F "lat=-23.561414" \
  -F "lng=-46.655881" \
  -F "foto=@/caminho/para/sua-foto.png;type=image/png"
# Anote o "protocolo" da resposta (HTTP 201)

# 2) Buscar uma
curl -s "$BASE/api/denuncias?protocolo=SEU_PROTOCOLO"

# 3) Listar todas
curl -s "$BASE/api/denuncias"

# 4) Senha errada → deve vir 401
curl -s -o /dev/null -w "%{http_code}\n" \
  -X PATCH "$BASE/api/denuncias/SEU_PROTOCOLO/resolver" \
  -H "Content-Type: application/json" \
  -d '{"senha":"errada"}'

# 5) Senha certa → 200 e status RESOLVIDO
#    (troque prefeitura pelo ADMIN_PASSWORD do seu .env)
curl -s -X PATCH "$BASE/api/denuncias/SEU_PROTOCOLO/resolver" \
  -H "Content-Type: application/json" \
  -d '{"senha":"prefeitura"}'

# 6) Conferir status
curl -s "$BASE/api/denuncias?protocolo=SEU_PROTOCOLO"
```

**O que já foi conferido neste passo (exemplo real):** criar → buscar → listar → 401 com senha errada → 200 com senha certa → status `RESOLVIDO` → arquivo da foto em `public/uploads/`.

### Conferir no Prisma Studio ou no DB Browser (opcional, bem visual)

**Prisma Studio (navegador):**

```bash
npm run db:studio
```

Abra o model **Denuncia**.

**DB Browser for SQLite (app):** **Open Database** → selecione `prisma/dev.db` na pasta do projeto → aba **Browse Data** → tabela **Denuncia**.  
(Passo a passo completo: **Opção C** no passo 04.)

A linha do seu protocolo deve ter:

* `status` = `RESOLVIDO` (depois do passo 7 do roteiro A)  
* `foto` começando com `/uploads/...` **ou** um JSON com vários caminhos se enviou mais de uma imagem  
* `updatedAt` mais novo que `createdAt` depois de resolver

### Critério de “pronto” (marque mentalmente)

- [x] Denunciar com foto(s) → protocolo novo  
- [x] Localização via GPS **ou** autocomplete (sem digitar lat/lng à mão)  
- [x] Acompanhar acha o protocolo (e mostra a(s) foto(s))  
- [x] Ponto no mapa  
- [x] Prefeitura (senha só no `.env`) resolve e **permanece** após recarregar  
- [x] Foto(s) salva(s) em `public/uploads/` e referenciada(s) no registro  

### O que o passo 13 **não** é

| Não confundir com… | Isso é… |
| --- | --- |
| Testes automatizados (`npm test`, Jest, Playwright…) | **Check-out 4** |
| Merge da branch `checkout3` na `main` | Decisão do grupo / PR no GitHub |
| Deploy na Vercel com fotos permanentes | Limitação do MVP (disco temporário na nuvem) — demo local com `npm run dev` |

### Arquivos relacionados (nenhum código novo obrigatório)

O passo 13 é sobretudo **conferência + documentação**. As peças já existem nos passos 06–12:

| Peça | Onde |
| --- | --- |
| Criar | `POST` em `app/api/denuncias/route.js` + `FormularioDenuncia.js` |
| Endereço (GPS / sugestões) | `GET` em `app/api/geocode/route.js` + formulário |
| Acompanhar | `GET ?protocolo=` + `TelaAcompanhar.js` |
| Mapa | `GET` lista + `TelaMapa.js` |
| Resolver | `PATCH .../resolver` + `TelaPrefeitura.js` |
| Senha | `.env` → `ADMIN_PASSWORD` |

---

## 17. Critério de “pronto” do check-out 3 inteiro

Com os passos **01–13** feitos:

1. Criar denúncia com foto(s) → recebe protocolo novo  
2. Localização via GPS ou autocomplete (lat/lng vão para o banco sem a pessoa digitar números)  
3. Acompanhar acha esse protocolo (e mostra a(s) foto(s))  
4. Ponto aparece no mapa  
5. Prefeitura (senha do `.env`) marca resolvido e **permanece** após recarregar a página  

Roteiro detalhado: seção do **passo 13** acima.

O que ainda pode faltar **fora** deste guia: merge da branch `checkout3` na `main` (combinar no grupo) e o check-out 4 (testes automatizados).

---

## 18. Se algo der errado

| Problema | O que tentar |
| --- | --- |
| `Cannot find module '@prisma/client'` | Na raiz do projeto: `npm install` e depois `npm run db:generate` |
| `Environment variable not found: DATABASE_URL` | Copie o `.env.example` para `.env` |
| Mudou o schema e o app “não vê” a tabela | Rode `npm run db:migrate` **na sua máquina** |
| `dev.db` apareceu no `git status` | Não adicione. Confira o `.gitignore` |
| Erro ao validar o schema | Abra `prisma/schema.prisma` e confira vírgulas, nomes e se o `model Denuncia` está completo |
| Drift / “We need to reset the SQLite database” | Veja a seção do passo 04 acima (apagar `dev.db` local e rodar `db:migrate` de novo) |
| `migrate` pede nome e você não sabe o que digitar | Se a pasta `migrations/` **já** tem `init_denuncia`, cancele (`Ctrl+C`) e rode de novo depois do `git pull`. Não invente uma segunda migração sem necessidade |
| Erro ao importar `lib/prisma.js` | Confirme que rodou `npm install` e `npm run db:generate` depois de puxar a branch |
| `Não foi possível gerar um protocolo único` | Quase nunca acontece com 6 dígitos. Rode de novo; se insistir, avise o grupo |
| `POST /api/denuncias` devolve 400 | Leia o campo `erro` no JSON — falta `endereco`, `descricao`, `lat`, `lng` ou `foto` (ou passou de 5 fotos / arquivo grande demais) |
| `POST` devolve 500 | Olhe o terminal do `npm run dev` (log `[POST /api/denuncias]`). Confira se o `.env` e o `db:migrate` estão ok |
| Foto não aparece no navegador | Confira se o arquivo está em `public/uploads/` e se a URL começa com `/uploads/` |
| No formulário só aparece o nome do arquivo, não a imagem | A prévia usa `URL.createObjectURL`. Recarregue a página e escolha a foto de novo; confira `FormularioDenuncia.js` |
| No Prisma Studio o campo `foto` tem `[` e `]` | Normal quando há **várias** fotos: é um JSON com a lista de caminhos |
| Enviou 3 fotos mas no Acompanhar só vê 1 | Confira se a API devolve `fotos` (array). A tela desliza horizontalmente se `fotos.length > 1` |
| `curl: Failed to connect` | O `npm run dev` não está rodando, ou a porta não é 3000 |
| `GET /api/denuncias` devolve lista vazia `[]` | Ainda não há denúncias no **seu** `dev.db`. Crie uma com o `POST` do passo 06 |
| `GET ?protocolo=...` devolve 404 | O número não existe neste banco (talvez você criou noutra máquina, ou digitou errado). Liste todas e confira o `id` |
| `GET` devolve 500 | Olhe o terminal do `npm run dev` (log `[GET /api/denuncias]`). Confira migrate + `.env` |
| `PATCH .../resolver` devolve 401 | A senha do JSON **não** é igual ao `ADMIN_PASSWORD` do `.env`. Abra o `.env` e use exatamente esse valor no `-d '{"senha":"..."}'` |
| `PATCH` devolve 404 | O protocolo na URL não existe. Liste com `GET /api/denuncias` e copie o `id` certo |
| `PATCH` devolve 500 com “não está configurada” | Falta `ADMIN_PASSWORD` no `.env`. Copie do `.env.example` e reinicie o `npm run dev` |
| `PATCH` devolve 400 | Faltou header `Content-Type: application/json` ou o campo `"senha"` no corpo |
| Enviar na tela mostra erro vermelho | Leia a mensagem — falta campo, foto grande demais ou formato inválido. O terminal do `npm run dev` também ajuda |
| Enviar fica em “Enviando…” sem fim | Confira se o `npm run dev` está rodando e se a API não devolveu 500 (log `[POST /api/denuncias]`) |
| Acompanhar não acha o protocolo novo | Confira se você criou a denúncia **nesta** máquina (`dev.db` local). Liste com `GET /api/denuncias` ou abra o Prisma Studio |
| Acompanhar acha `748393` do mock antigo? | Só se esse protocolo existir no banco. Depois do passo 10 a tela **não** lê mais `denuncias-exemplo.js` |
| Acompanhar mostra “Falha de rede” | O `npm run dev` não está rodando, ou a porta não é 3000 |
| Foto não aparece no Acompanhar | A denúncia precisa ter `foto` no banco e o arquivo em `public/uploads/`. Denúncias criadas só no curl sem imagem válida podem falhar |
| GPS não preenche a localização | Permissão negada, HTTPS/localhost ok, ou sem GPS — digite o endereço e **escolha uma sugestão** da lista |
| Digitei o endereço mas não aparece sugestão | Espere ~0,5 s (debounce). Digite pelo menos 3 letras. Confira `GET /api/geocode?q=...` no navegador ou no terminal |
| `/api/geocode` devolve 502 ou 500 | Nominatim pode estar lento ou fora. Tente de novo. Veja o log `[GET /api/geocode]` no terminal do `npm run dev` |
| Enviar pede para escolher da lista | Você digitou o texto mas **não clicou** numa sugestão (e também não usou o GPS). Sem `lat`/`lng` a API não grava o pin |
| Não acho mais o arquivo `BotaoEnviarDenuncia.js` | Foi removido no passo 09. O envio ficou em `FormularioDenuncia.js` |
| Mapa fica em “Carregando…” sem fim | Confira o `npm run dev` e abra `http://localhost:3000/api/denuncias` no navegador — deve aparecer JSON |
| Mapa diz “Nenhuma denúncia no banco” | Normal se o **seu** `dev.db` está vazio. Crie uma em `/denuncia` e **recarregue** o mapa |
| Mapa não mostra o pin da denúncia nova | Confira se a denúncia tem `lat` e `lng` no Prisma Studio. Sem GPS a API do passo 06 nem grava |
| Mapa ainda mostra `748393` do mock? | Só se esse protocolo existir no banco. Depois do passo 11 a tela **não** lê mais `DENUNCIAS_EXEMPLO` |
| Filtro “Pendentes” deixa a lista vazia | Todas as denúncias do banco podem estar `RESOLVIDO` (ou o contrário). Toque em Filtrar até “Todos” |
| “Não deu para carregar” no mapa | Use **Tentar de novo**. Veja o terminal (`[GET /api/denuncias]`) e se o migrate foi rodado |
| Prefeitura diz “Senha incorreta” com a senha que eu acho certa | Abra o `.env` e copie **exatamente** o valor de `ADMIN_PASSWORD` (sem espaços a mais). Reinicie o `npm run dev` |
| Prefeitura entra, mas a lista está vazia | Não há `PENDENTE` no **seu** `dev.db`. Crie em `/denuncia` e clique em **Atualizar** |
| Marquei resolvido, mas no Acompanhar ainda diz Pendente | Recarregue a página do Acompanhar (F5) e busque de novo — o MVP não atualiza sozinho em tempo real |
| Depois de Sair, a denúncia “volta” como pendente | Isso era o bug do mock no check-out 2. No passo 12, se voltar, o `PATCH` não gravou — veja o terminal (`[PATCH /api/denuncias/[id]/resolver]`) |
| Ainda vejo a senha `prefeitura` no código da tela? | Não deve. Se aparecer `SENHA_TESTE`, você está numa branch antiga — faça `git pull` na `checkout3` |
| No roteiro ponta a ponta o mapa não mostra a denúncia nova | Recarregue com F5. Confirme lat/lng no Prisma Studio. Sem GPS a API nem grava |
| Resolvi na prefeitura, mas o Acompanhar ainda diz Pendente | F5 + Buscar de novo. O MVP não atualiza “ao vivo” entre abas |
| O `curl` fala “Failed to connect” | `npm run dev` parado ou porta errada — olhe a URL que o Next imprimiu no terminal |
| Quero só validar o backend sem abrir o navegador | Use o **Roteiro B** da seção do passo 13 |

Instalação geral do projeto: [arquitetura_e_tecnologias.md](./arquitetura_e_tecnologias.md).  
Roteiro ponta a ponta: seção do **passo 13** neste arquivo.
