# Rotas e telas

Este texto explica **como o Next.js liga pasta → URL → página**, e o que já está pronto neste repositório.

O que é Next.js (e as outras bibliotecas): [07-bibliotecas.md](./07-bibliotecas.md).

## A regra (App Router)

1. Tudo que é página fica dentro de `app/`.
2. O arquivo **precisa** se chamar `page.js` (esse nome é especial).
3. O **nome da pasta** vira o caminho:

```text
app/page.js                        →  http://localhost:3000/
app/denuncia/page.js               →  http://localhost:3000/denuncia
app/denuncia/sucesso/page.js       →  http://localhost:3000/denuncia/sucesso
app/acompanhar/page.js             →  http://localhost:3000/acompanhar
app/mapa/page.js                   →  http://localhost:3000/mapa
app/prefeitura/page.js             →  http://localhost:3000/prefeitura
```

A tela de sucesso usa query string, por exemplo:

```text
/denuncia/sucesso?protocolo=748393
```

Plano completo das telas do check-out 2: [10-checkout2-frontend-telas.md](./10-checkout2-frontend-telas.md).

Não existe um arquivo `routes.js` listando URLs. A **árvore de pastas** é a lista de rotas.

## Layout: o que envolve todas as telas

`app/layout.js` não tem URL própria. Ele desenha o `<html>` e o `<body>`, coloca o **menu lateral** e a página atual em `{children}`.

Por isso fontes (Poppins), idioma (`pt-BR`), CSS global e o menu valem para Home, Mapa, etc., sem copiar em cada arquivo.

Como o menu abre e fecha: [08-identidade-e-menu.md](./08-identidade-e-menu.md).

Cada `page.js` pode exportar `metadata` só com o **título da aba** (`Nova denúncia`, `Mapa de denúncias`, …).

## Home: os botões

`app/page.js` tem um array chamado `telas`. Cada item tem:

- `href` — a URL (tem que existir o `page.js` correspondente);
- `titulo` e `descricao` — texto do botão.

O `.map` percorre o array e cria um `Link` do Next.js para cada tela. **Para adicionar um botão**, acrescente um objeto no array, crie a pasta com `page.js` **e** inclua o mesmo destino em `components/MenuLateral.js`.

## Situação das telas (check-out 2)

| Rota | Situação |
| --- | --- |
| `/` (Home) | Implementada; no check-out 2 aproxima do mockup FiscalizApp |
| `/denuncia` | **Passo 09:** formulário real → `POST /api/denuncias` → sucesso com protocolo do banco (visual do check-out 2 mantido) |
| `/denuncia/sucesso` | **Feita** — mostra o protocolo (`?protocolo=`), copiar e links |
| `/acompanhar` | **Passo 10:** consulta por protocolo no **banco** (`GET ?protocolo=`); estados vazio / carregando / encontrado / não encontrado / erro |
| `/mapa` | **Passo 11:** mapa + lista + Centralizar — pontos do **banco** (`GET /api/denuncias`) |
| `/prefeitura` | **Passo 12:** senha do `.env` (`ADMIN_PASSWORD`) + lista do banco + marcar resolvido com `PATCH` |

`/denuncia`, `/acompanhar`, `/mapa` e `/prefeitura` já usam a API do check-out 3.

Detalhes do front (check-out 2): [10-checkout2-frontend-telas.md](./10-checkout2-frontend-telas.md).  
Backend, passos 09–12 e **teste ponta a ponta (passo 13):** [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md).

## Por que `Link` e não `<a>`?

`<a href="/mapa">` recarrega o site inteiro. `<Link href="/mapa">` (do `next/link`) troca só o conteúdo da página, mais rápido. Use `Link` para rotas **internas**. Use `<a>` para sites **externos** (ex.: documentação do Next na internet).

## O que o MVP **não** tem como rota

De propósito **não** criamos:

- `/cadastro`, `/login`, `/esqueci-senha`
- `/minhas-denuncias`

Isso está em [06-trabalhos-futuros.md](./06-trabalhos-futuros.md) e no [mpv.md](./mpv.md).

## Como testar

1. No terminal, na pasta do projeto: `npm run dev`
2. Abra [http://localhost:3000](http://localhost:3000)
3. No canto superior esquerdo, clique no ícone de menu (três linhas) para **abrir** o menu lateral. O X, o fundo escuro ou a tecla Esc **fecham**.
4. Clique em cada item do menu. A URL na barra deve mudar (`/denuncia`, `/mapa`, …).
5. Em `/prefeitura`, use a senha do seu `.env` (`ADMIN_PASSWORD`), marque um item como resolvido e confira que ele some da lista **e** continua resolvido depois de recarregar. Em `/mapa`, teste o mapa, o filtro e o botão **Centralizar**.  
   Roteiro **completo** (denunciar → acompanhar → mapa → resolver): [guia do check-out 3 · passo 13](./11-checkout3-banco-backend.md#16-passo-13--teste-ponta-a-ponta--o-que-acabamos-de-fazer).  
   Roteiro só do front antigo: [guia do check-out 2](./10-checkout2-frontend-telas.md#11-como-testar-passo-a-passo).
