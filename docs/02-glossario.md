# Glossário (para quem está começando)

Quando aparecer uma palavra estranha no código ou nas reuniões, volte nesta lista.

| Palavra | Significado simples |
| --- | --- |
| **Repositório (repo)** | A pasta do projeto no GitHub + o histórico de mudanças. |
| **Git** | Programa que guarda versões do código (commit, pull, push). |
| **Commit** | “Foto” do código com uma mensagem (“adicionei a Home”). |
| **Branch** | Linha de trabalho paralela (ex.: `bruna`) para não bagunçar o `main`. |
| **Clone / pull** | Clone = baixar o projeto. Pull = atualizar com o que as outras enviaram. |
| **Node.js** | Programa que executa JavaScript **fora** do navegador. Sem ele, `npm` não funciona. |
| **npm** | Instala bibliotecas listadas no `package.json`. |
| **`node_modules/`** | Pasta enorme com essas bibliotecas. **Não edite** e **não envie** para o GitHub. |
| **JavaScript (.js)** | Linguagem deste projeto. |
| **React** | Biblioteca para montar telas em pedaços (componentes). O Next.js usa React. |
| **Componente** | Função que devolve HTML/JSX. Ex.: `PlaceholderTela`. |
| **JSX** | Jeito de escrever HTML dentro do JavaScript (`<h1>Olá</h1>`). |
| **Next.js** | Ferramenta que organiza páginas, rotas e (depois) API. |
| **App Router** | Regra: a pasta `app/` define as URLs. `app/mapa/page.js` → `/mapa`. |
| **Rota** | Caminho na barra de endereço (`/denuncia`, `/mapa`). |
| **Página (`page.js`)** | Arquivo especial: o Next.js só desenha a rota se existir esse nome. |
| **Layout (`layout.js`)** | “Moldura” de todas as páginas: fontes, idioma, CSS global. |
| **`Link`** | Componente do Next para ir a outra página **sem recarregar** o site inteiro. Não use `<a href="/mapa">` para páginas internas. |
| **Props** | Dados que um componente recebe. Ex.: `titulo="Mapa"`. |
| **`export default`** | Diz “esta função é a página / o componente principal deste arquivo”. |
| **`import`** | Traz código de outro arquivo. |
| **Tailwind** | Classes de estilo no `className` (`flex`, `text-2xl`, `bg-white`). |
| **CSS** | Folha de estilo. Neste projeto o global é `app/globals.css`. |
| **API** | Endereço que **grava ou busca dados**, não uma tela bonita. Ex.: `/api/denuncias`. |
| **SQLite** | Banco em **um arquivo** (`dev.db`). Não precisa instalar MySQL. |
| **Prisma** | Ferramenta que cria/atualiza o SQLite a partir de um modelo. Ainda entra no próximo passo. |
| **`.env`** | Segredos da **sua** máquina (senha da prefeitura). **Nunca** vá para o GitHub. |
| **`.env.example`** | Modelo **sem senha real**. Esse pode ir para o GitHub. |
| **`localhost:3000`** | “Este computador, porta 3000” — o site em desenvolvimento. |
| **`npm run dev`** | Liga o servidor de desenvolvimento. Deixe o terminal aberto. |
| **Placeholder** | Tela temporária (“ainda não implementada”) só para a rota existir. |
| **MVP** | Produto mínimo viável — só o essencial. |
| **Leaflet / OSM** | Biblioteca de mapa + mapas gratuitos do OpenStreetMap. Ainda não está instalado. |
| **Deploy / Vercel** | Colocar o site na internet. Combinamos Vercel no MVP. |
| **`public/`** | Arquivos que o navegador baixa direto (ícones, fotos em `uploads/`). |

Se faltar uma palavra, acrescentem neste arquivo e avisem o grupo.
