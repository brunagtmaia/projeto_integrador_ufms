> Comece pelo índice: [README.md](./README.md). Estrutura de pastas: [03-estrutura-do-projeto.md](./03-estrutura-do-projeto.md).

## Arquitetura, tecnologias e como configurar o projeto na sua máquina

Hoje o repositório já tem o **Next.js** (JavaScript + App Router + Tailwind). Banco (Prisma + SQLite), mapa (Leaflet) e as telas de denúncia ainda entram nos próximos passos do MVP.

## O que é este projeto?

É um **site** (aplicativo web) em que a pessoa:

1.  registra uma denúncia **sem criar conta** (localização + foto → recebe um **protocolo**);
2.  consulta o andamento **só com o protocolo**;
3.  vê os pontos no **mapa**;
4.  e a “prefeitura” marca como resolvido com uma **senha** no arquivo `.env` (não há cadastro de usuários).

Você não instala um app na loja: abre no **navegador** (Chrome, Safari, Firefox). No celular, o site deve funcionar como página responsiva.

## Palavras que vão aparecer (sem jargão)

| Palavra | Em linguagem simples |
| --- | --- |
| **JavaScript** | Linguagem em que o código deste projeto está escrito. |
| **Node.js** | Programa que deixa o computador **entender e executar** JavaScript fora do navegador. Sem ele, `npm` e o Next.js não rodam. |
| **npm** | “Gerenciador de pacotes”: baixa as bibliotecas que o projeto precisa (React, Next.js, etc.). Vem junto com o Node.js. |
| **Next.js** | Ferramenta que monta o site (páginas + API no mesmo projeto). |
| **App Router** | Jeito moderno de organizar as páginas na pasta `app/`. |
| **Tailwind** | Forma de estilizar (cores, espaçamento, layout) com classes no HTML/JSX. |
| **API** | Endereço no próprio site (ex.: `/api/denuncias`) que grava ou busca dados. |
| **SQLite** | Banco de dados em **um arquivo** no disco (`dev.db`). Não precisa instalar MySQL nem PostgreSQL. |
| **Prisma** | Programa que cria/atualiza esse arquivo de banco a partir de um modelo (`schema.prisma`). |
| `**.env**` | Arquivo **local** com senhas e caminhos. Não se envia para o GitHub. |
| **Terminal** | Tela preta (ou integrada no Cursor/VS Code) onde você digita comandos. No macOS: Terminal ou o painel do Cursor. |

## O que você precisa instalar (só uma vez)

### 1\. Node.js (obrigatório)

1.  Abra [https://nodejs.org](https://nodejs.org).
2.  Baixe a versão **LTS** (Long Term Support — a mais estável).
3.  Instale como qualquer outro programa (Next, Next, Finish).
4.  **Feche e abra de novo** o terminal (ou o Cursor) para o sistema reconhecer o Node.

Para conferir, no terminal:

```plaintext
node -v
npm -v
```

Deve aparecer algo como `v20...` ou `v22...` e um número do npm. Se disser “command not found”, o Node não está no PATH: reinstale e reabra o terminal.

**Windows:** na instalação, marque a opção de adicionar o Node ao PATH, se aparecer.

### 2\. Git (recomendado)

Serve para baixar o código do GitHub.

*   macOS: muitas vezes já vem instalado. Teste com `git --version`.
*   Windows: [https://git-scm.com](https://git-scm.com).
*   Linux: `sudo apt install git` (Ubuntu/Debian) ou o equivalente da sua distro.

### 3\. Um editor (recomendado)

Visual Studio Code. Não é obrigatório para **rodar** o projeto; só facilita editar o código.

### 4\. Um navegador

Qualquer um atualizado. Para testar no celular, o computador e o celular precisam estar na mesma rede Wi‑Fi (depois você usa o IP da máquina; no começo, `localhost` no próprio computador basta).

**Você não precisa instalar:** Java, Python, Docker, PostgreSQL, PostGIS.

## Baixar o código

No terminal, vá até a pasta onde você guarda projetos e clone o repositório (troque a URL se a do grupo for outra):

```plaintext
git clone https://github.com/brunagtmaia/projeto_integrador_ufms.git
cd projeto_integrador_ufms
```

O `package.json` é a “lista de ingredientes”: se essa pasta não tiver esse arquivo, você não está na raiz do projeto.

## Configurar e ligar o site (toda vez que for desenvolver)

### Passo 1 — Instalar as bibliotecas

Ainda na pasta do projeto:

```plaintext
npm install
```

Isso lê o `package.json` e cria a pasta `node_modules` (pesada; **não** se commita no Git). Precisa de internet. Na primeira vez pode demorar alguns minutos.

Se der erro de permissão no macOS/Linux, **não** use `sudo npm install` na pasta do projeto. Confira se o Node foi instalado para o seu usuário.

### Passo 2 — Arquivo de segredos (`.env`)

Na raiz do projeto deve existir um modelo chamado `.env.example`.

Copie para `.env`:

**macOS / Linux:**

```plaintext
cp .env.example .env
```

**Windows (PowerShell):**

```plaintext
Copy-Item .env.example .env
```

Abra o `.env` no editor. Conteúdo esperado:

```plaintext
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="troque-esta-senha"
```

*   `DATABASE_URL` — onde o SQLite vai viver (quando o Prisma estiver no projeto).
*   `ADMIN_PASSWORD` — senha da tela da prefeitura. **Troque** para algo que só o grupo saiba. Não compartilhe no WhatsApp público nem no GitHub.

O `.env` já está no `.gitignore`: o Git **não** deve enviar esse arquivo.

### Passo 3 — Subir o servidor de desenvolvimento

```plaintext
npm run dev
```

Deixe essa janela **aberta**. O Next.js avisa quando estiver pronto.

No navegador, abra:

[http://localhost:3000](http://localhost:3000)

`localhost` = “este computador”. A porta `3000` é o “número da porta” do Next. Se a 3000 estiver ocupada, o terminal mostra outra (ex.: 3001): use essa.

Para **parar**: no terminal, `Ctrl + C`.

Para **voltar a trabalhar** no dia seguinte: `cd` na pasta do projeto e de novo `npm run dev`. Só precisa de `npm install` de novo se alguém mudar o `package.json` ou se você apagar `node_modules`.

## Como o projeto está organizado (visão de iniciante)

```plaintext
projeto_integrador_ufms/
├── app/                 # páginas do site (e, depois, app/api/...)
├── public/              # arquivos estáticos; fotos em public/uploads/
├── docs/                # textos do trabalho (este arquivo, MVP, etc.)
├── package.json         # dependências e comandos npm
├── .env.example         # modelo das variáveis (pode ir para o Git)
├── .env                 # suas senhas (só na sua máquina)
└── node_modules/        # bibliotecas baixadas (não edite à mão)
```

Depois entram, pelo MVP:

*   `prisma/` — modelo do banco e o arquivo `dev.db`;
*   `components/` — pedaços de tela reutilizáveis (menu, mapa);
*   `lib/` — funções auxiliares (ex.: gerar protocolo).

**Arquitetura em uma frase:** o Next.js serve as telas **e** as rotas `/api/...` no mesmo programa. O navegador fala com essas rotas; elas gravam no SQLite e salvam fotos em `public/uploads`.

## Banco de dados (quando o Prisma for adicionado)

Ainda não é obrigatório se o Prisma não estiver no `package.json`. Quando o grupo chegar nesse passo, o fluxo típico será:

```plaintext
npx prisma migrate dev
```

Isso cria/atualiza o arquivo `dev.db`. Se o colega mandar um banco novo, cada um roda o migrate **na própria máquina** (o `dev.db` também não vai para o Git).

## Problemas comuns

| O que aparece | O que fazer |
| --- | --- |
| `command not found: node` ou `npm` | Instale o Node LTS e **reabra** o terminal. |
| `npm install` trava ou falha de rede | Confira a internet; tente de novo. VPN corporativa às vezes bloqueia o registro do npm. |
| Porta 3000 em uso | Feche outro `npm run dev` ou use a porta que o Next sugerir. |
| Página em branco / erro após `git pull` | Rode `npm install` de novo e copie o `.env` se ele não existir. |
| “Cannot find module …” | Apague `node_modules` e rode `npm install` outra vez. |
| Foto ou denúncia some no deploy | No computador local os arquivos ficam na pasta; na **Vercel** o disco é temporário. Para a disciplina, demonstrar com `npm run dev` na máquina é o caminho do MVP. |

## O que não fazer

*   Não suba `.env`, `dev.db` nem fotos de `public/uploads` para o GitHub.
*   Não commite `node_modules`.
*   Não precisa de login, e-mail, PWA ou PostGIS neste MVP.

## Checklist rápido (“está configurado?”)

*   `node -v` e `npm -v` funcionam
*   Estou na pasta que tem `package.json`
*   `npm install` terminou sem erro
*   Existe um `.env` (copiado do `.env.example`)
*   `npm run dev` está rodando
*   [http://localhost:3000](http://localhost:3000) abre no navegador