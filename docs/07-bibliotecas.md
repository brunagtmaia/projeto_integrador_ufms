# Bibliotecas do projeto

Este texto lista **tudo que o site usa** (e o que o MVP ainda vai usar) e explica **para que serve**, em linguagem de quem está começando.

**Biblioteca** = um pedaço de código que outra pessoa já escreveu. Em vez de inventar “como desenhar um botão no navegador”, usamos React, Next.js, etc.

A lista oficial de nomes e versões fica no arquivo `package.json` na raiz. O comando `npm install` lê esse arquivo e baixa tudo para a pasta `node_modules/` (não edite essa pasta).

Há três grupos:

1. **Já instaladas** — estão no `package.json` hoje.
2. **Não são npm, mas o site usa** — fonte e ícones (Google Fonts).
3. **Combinadas no MVP, ainda não instaladas** — banco e mapa.

---

## 1. Já instaladas (`package.json`)

### Dependências (`dependencies`)

São as bibliotecas que o site **precisa para funcionar** (na sua máquina e, depois, na internet).

| Nome no `package.json` | Versão no projeto | Para que serve |
| --- | --- | --- |
| **next** | 16.3.1 | **Next.js.** Monta o site: páginas na pasta `app/`, endereços (`/mapa`), e depois as APIs (`/api/...`). O comando `npm run dev` é o Next.js. Sem ele não existe o projeto como está. |
| **react** | 19.2.8 | **React.** Permite escrever a tela em **componentes** (funções que devolvem JSX, tipo `Home` ou `Icone`). O Next.js **usa** o React por baixo. |
| **react-dom** | 19.2.8 | Liga o React ao **navegador** (coloca o HTML na página). Quase sempre vem junto com o React; não mexemos nela no dia a dia. |

Por que Next **e** React? O React desenha os pedaços da tela. O Next.js organiza pastas, rotas, servidor e o comando de desenvolvimento.

### Dependências de desenvolvimento (`devDependencies`)

Servem **enquanto programamos**. Não são “a tela da denúncia”; ajudam a estilizar e a achar erro no código.

| Nome no `package.json` | Para que serve |
| --- | --- |
| **tailwindcss** | **Tailwind CSS.** Estilo com classes no `className` (`flex`, `bg-primary`, `rounded-full`). Também usamos classes nossas no `globals.css` (`btn-primario`, `cartao`). |
| **@tailwindcss/postcss** | “Cola” o Tailwind no processo de CSS do projeto. Sem isso, as classes do Tailwind não viram estilo de verdade. Em geral **não se edita**. |
| **eslint** | Programa que **lê o código** e avisa coisa estranha (variável não usada, erro de sintaxe). Roda com `npm run lint`. |
| **eslint-config-next** | Conjunto de regras do ESLint **feitas para Next.js**. Assim o lint entende `page.js`, `layout.js`, etc. |

**PostCSS** aparece no arquivo `postcss.config.mjs`. Não está listado à parte no `package.json` porque entra junto com o plugin do Tailwind. Função: transformar o CSS (incluindo `@import "tailwindcss"`) no CSS que o navegador entende.

---

## 2. O site usa, mas não está no `package.json`

Essas coisas vêm da **internet** quando a página abre (ou o Next baixa a fonte). Não precisa `npm install` para elas.

| O quê | Onde está no código | Para que serve |
| --- | --- | --- |
| **Poppins** | `next/font/google` em `app/layout.js` | Fonte do app (o guia visual mostrava Inter; o grupo pediu **Poppins**). |
| **Material Icons Outlined** | `<link>` no `app/layout.js` + componente `components/Icone.js` | Ícones do **Material Design** (casinha, lupa, mapa…). O nome em inglês vira o desenho (`home`, `search`, `map`). Catálogo: [fonts.google.com/icons](https://fonts.google.com/icons). |

---

## 3. Ferramentas que não são “biblioteca npm”, mas o grupo usa

| Nome | É biblioteca do projeto? | Para que serve |
| --- | --- | --- |
| **Node.js** | Não. Instala **no computador**. | Executa JavaScript fora do navegador. Sem Node, `npm` e `next` não rodam. |
| **npm** | Não. Vem com o Node. | Lê o `package.json` e instala as bibliotecas. |
| **Git** | Não. | Histórico do código e GitHub. |
| **JavaScript** | Linguagem, não pacote. | Tudo que escrevemos em `.js`. |
| **SQLite** | Motor de banco (arquivo `dev.db`). | Guardar denúncias. No MVP entra **junto com o Prisma**. Hoje o Prisma ainda não está no `package.json`. |
| **Vercel** | Serviço na nuvem. | Colocar o site no ar (combinado no MVP). Não é um pacote que se importa no código. |

---

## 4. Combinadas no MVP, **ainda não** estão no `package.json`

O [mpv.md](./mpv.md) pediu estas camadas. Elas **entram nos próximos passos**. Quando alguém instalar, este arquivo deve ser atualizado.

| Nome | Para que serve | Quando usar |
| --- | --- | --- |
| **Prisma** (`prisma` + em geral `@prisma/client`) | Desenha as tabelas (`schema.prisma`) e conversa com o banco sem escrever SQL na mão. | Passo de **gravar denúncia** e consultar protocolo. |
| **SQLite** | Banco em **um arquivo** (`prisma/dev.db`). Não instala MySQL. | Junto com o Prisma. |
| **Leaflet** | Biblioteca de **mapa** no navegador. | Tela `/mapa`. |
| **OpenStreetMap** | Mapas de fundo **gratuitos** (ruas, bairros). O Leaflet desenha; o OSM é o “papel de parede” do mapa. Não é um pacote npm obrigatório: o Leaflet aponta para os tiles do OSM. |
| **react-leaflet** (comum, ainda não definido pelo grupo) | Facilita usar Leaflet **dentro de componentes React**. Se o grupo só usar Leaflet “puro”, pode não entrar. |

**Não instalar agora** (trabalhos futuros): PostGIS, bibliotecas de login/e-mail, PWA.

---

## Como saber o que está instalado de verdade

1. Abra `package.json`.
2. O que está em `dependencies` e `devDependencies` **já** foi escolhido.
3. Depois de `npm install`, a pasta `node_modules/` enche (não commitar).

Se o `package.json` mudar no GitHub, cada pessoa roda de novo:

```bash
npm install
```

---

## Relação rápida (quem usa o quê)

```text
Você escreve JSX  →  React desenha os componentes
                     Next.js escolhe a página pela URL e sobe o servidor
                     Tailwind / globals.css pintam botões e cartões
                     Poppins + Material Icons = identidade visual
                     Menu lateral (abre/fecha) em todas as páginas
Próximos passos   →  Prisma + SQLite gravam denúncia
                     Leaflet + OpenStreetMap mostram o mapa
```

Mais detalhes de pastas: [03-estrutura-do-projeto.md](./03-estrutura-do-projeto.md).  
Visual e menu: [08-identidade-e-menu.md](./08-identidade-e-menu.md).  
Como ligar o projeto: [arquitetura_e_tecnologias.md](./arquitetura_e_tecnologias.md).
