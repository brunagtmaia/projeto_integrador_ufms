# O que é este projeto

Somos um grupo da UFMS fazendo um **projeto integrador**. O produto é um **site** (não um aplicativo da loja da Apple/Google) para registrar **denúncias** (por exemplo, problema na rua) e acompanhar o andamento.

Você abre o site no navegador: Chrome, Safari, Firefox, no computador ou no celular.

## O que a pessoa consegue fazer (MVP)

MVP = a versão **mais simples** que ainda é útil. Combinamos o seguinte:

1. **Home** — tela inicial com botões para as outras telas.
2. **Nova denúncia** — **sem criar conta**. A pessoa informa localização, envia **foto** e recebe um **número de protocolo**.
3. **Acompanhar** — consulta o status **só com o protocolo** (não tem “minhas denúncias” nem login).
4. **Mapa** — vê os pontos das denúncias (mapa simples + lista).
5. **Prefeitura** — alguém da prefeitura marca como **resolvido** usando uma **senha** guardada no arquivo `.env`. Não existe cadastro de usuários.

## O que ainda não está pronto

Hoje as **rotas** (endereços das telas) já existem. Há um **menu lateral** (abre/fecha) em todas as páginas. As telas de denúncia, acompanhar, mapa e prefeitura ainda são **placeholders** (página temporária). Quem for implementar o formulário, o mapa e a senha edita o `page.js` de cada pasta.

Visual (cores, fonte, ícones): [08-identidade-e-menu.md](./08-identidade-e-menu.md).

Banco de dados (Prisma + SQLite), salvar foto e Leaflet entram nos próximos passos. Veja a ordem em [mpv.md](./mpv.md).

## Por que JavaScript e Next.js?

- **JavaScript** — linguagem do navegador; o grupo não precisa aprender TypeScript agora.
- **Next.js (App Router)** — um único projeto serve as **páginas** e, depois, as **APIs** (`/api/...`) que gravam no banco.
- **Tailwind** — estilo com classes no próprio JSX (`className="..."`), sem criar um arquivo CSS por botão.

Lista completa de bibliotecas (instaladas e as do MVP que ainda faltam): [07-bibliotecas.md](./07-bibliotecas.md).

Detalhes de instalação: [arquitetura_e_tecnologias.md](./arquitetura_e_tecnologias.md).
