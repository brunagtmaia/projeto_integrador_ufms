# Identidade visual e menu lateral

Este texto descreve **como o site está hoje** na tela: cores, fonte, ícones e o menu que abre e fecha. O desenho de referência está em `docs/ideias_layouts/` (fotos do guia do grupo).

O código correspondente:

| O quê | Onde no projeto |
| --- | --- |
| Cores e classes de botão (`btn-primario`, `cartao`…) | `app/globals.css` |
| Fonte **Poppins** | `app/layout.js` (`next/font/google`) |
| Ícones **Material Icons Outlined** | `app/layout.js` (link do Google) + `components/Icone.js` |
| Menu abrir/fechar | `components/MenuLateral.js` (chamado em `app/layout.js`) |

## Cores (paleta do guia)

| Nome | Hex | Uso típico |
| --- | --- | --- |
| Primary | `#2D6A4F` | Botão principal, item ativo do menu |
| Secondary | `#1B263B` | Textos fortes, botão “invertido” |
| Tertiary | `#D8F3DC` | Fundo claro do botão de abrir o menu |
| Neutral | `#F8F9FA` | Fundo da página |

No CSS elas viram variáveis (`--primary`, etc.). Mudar o verde do app = alterar `--primary` em `globals.css`.

## Fonte e ícones

- **Poppins** em todo o texto (o guia mostrava Inter; o grupo pediu Poppins).
- **Material Icons Outlined**: `<Icone nome="home" />`. O nome é em **inglês** (`search`, `map`, `menu`, `close`). Lista: [fonts.google.com/icons](https://fonts.google.com/icons) (estilo Outlined).

Isso **não** é pacote npm. Detalhe em [07-bibliotecas.md](./07-bibliotecas.md).

## Menu lateral (não é barra embaixo)

O site é um **aplicativo web responsivo**. Por isso o menu **não** fica fixo na parte de baixo (isso é típico de app de celular nativo).

Como a pessoa usa:

1. No **topo**, o botão com três linhas (`menu`) **abre** o painel à esquerda.
2. Para **fechar**: o **X**, clicar no **fundo escuro**, ou a tecla **Esc**.
3. Ao escolher uma tela, o menu **fecha sozinho**.
4. A tela atual fica com fundo **verde**.

O arquivo tem `"use client"` porque precisa lembrar se está aberto (`useState`) e qual é a URL (`usePathname`). Os comentários dentro de `MenuLateral.js` explicam linha a linha.

## Home e menu: duas listas

Os botões grandes da Home (`app/page.js`, array `telas`) e os itens do menu (`MenuLateral.js`, array `itens`) apontam para as **mesmas URLs**.

Se o grupo criar uma tela nova:

1. `app/nome/page.js`
2. objeto em `telas` na Home
3. objeto em `itens` no menu lateral

Esquecer o passo 3 = a tela existe, mas não aparece no menu.

## Classes prontas para as outras telas

Quem for montar o formulário pode reutilizar (definidas em `globals.css`):

- `headline`, `body-text`, `label-text`
- `btn-primario`, `btn-secundario`, `btn-invertido`, `btn-contorno`
- `cartao`

## Tela `/mapa`

Segue o mockup (mapa em cima, “Casos registrados” embaixo). O **menu continua o lateral** do layout — não há barra inferior nem perfil (MVP sem login).

- Mapa: **Leaflet + OpenStreetMap** (gratuito, marca endereços com lat/lng).
- Lista: no check-out 3 os pontos vêm do **banco** (`GET /api/denuncias`). Clicar num caso foca o ponto. **Filtrar** alterna Todos / Pendentes / Resolvidos.
- Visual: cartões com classe `cartao` e selos **Pendente** / **Resolvido** iguais aos de `/acompanhar` e `/prefeitura`.
- Layout **responsivo**: no celular o mapa fica em cima e a lista embaixo; em tela larga, mapa à esquerda e lista à direita.
- Botão **Centralizar** (no mapa): enquadra todas as denúncias visíveis (as do filtro atual).
