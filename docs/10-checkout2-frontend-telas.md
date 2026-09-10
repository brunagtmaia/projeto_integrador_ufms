## Check-out 2 — Guia das telas (Frontend)

Este texto é o **mapa de trabalho** do check-out 2. Foi escrito para quem está começando: explica o que já existe, o que falta, as regras do grupo e como saber que terminou.

**Branch Git:** `checkout2`  
**Escopo:** só **telas** (HTML/CSS/React). **Não** inclui banco, API nem upload real de foto (isso é check-out 3).

Plano geral dos check-outs: [09-planejamento-checkouts.md](./09-planejamento-checkouts.md).  
Cores e menu: [08-identidade-e-menu.md](./08-identidade-e-menu.md).  
Imagens de referência: pasta [`ideias_layouts/`](./ideias_layouts/).

## 1\. Objetivo (em uma frase)

Deixar **todas** as telas do MVP usáveis na tela (com dados de mentira onde ainda não houver banco), sem misturar backend nesta branch.

## 2\. Decisões do grupo (não mudar sem combinar)

| Decisão | Valor combinado |
| --- | --- |
| Branch | `checkout2` |
| Layout de `/denuncia` | **Não redesenhar.** Quem fez o visual fica como está. |
| Tela de sucesso (protocolo) | Nova rota `/denuncia/sucesso?protocolo=748393` |
| Como gerar o protocolo (mock) | **Aleatório entre os** `**id**`**s** de `lib/denuncias-exemplo.js` (assim Acompanhar acha o mesmo número) |
| Como sair da denúncia sem mudar o visual | Só um `onClick` mínimo no botão **Enviar** (não mexer em CSS/aparência) |
| Senha de teste da prefeitura (só front) | `prefeitura` (no check-out 3 vira `ADMIN_PASSWORD` no `.env`) |
| Home neste check-out | Sim: visual FiscalizApp (saudação + 4 ações), **sem** ilustração e **sem** ícone de perfil/login |
| Dados fictícios | Reutilizar / estender `lib/denuncias-exemplo.js` |

### O que **não** fazer neste check-out

*   Login, cadastro, “minhas denúncias”, perfil
*   Vídeo, e-mail, Prisma, `app/api`, upload real
*   Barra de navegação embaixo estilo app nativo (o menu do projeto é **lateral**)

Detalhes do que fica fora: [06-trabalhos-futuros.md](./06-trabalhos-futuros.md).

## 3\. Tabela: tela → arquivo → status

| URL | Arquivo principal | Status hoje | O que fazer no check-out 2 |
| --- | --- | --- | --- |
| `/` | `app/page.js` | **Feito (fase 5)** | Visual FiscalizApp: saudação + 4 ações, sem ilustração e sem perfil |
| `/denuncia` | `app/denuncia/page.js` + `BotaoEnviarDenuncia` | Layout visual **já feito** | **Não mexer no layout.** Enviar sorteia `id` do mock → sucesso |
| `/denuncia/sucesso` | `app/denuncia/sucesso/page.js` | **Feito (fase 2)** | Mostra protocolo, copiar, links para Acompanhar / Home |
| `/acompanhar` | `app/acompanhar/page.js` + `TelaAcompanhar` | **Feito (fase 3)** | Consulta por protocolo (mock); pré-preenche `?protocolo=` |
| `/mapa` | `app/mapa/page.js` + `components/mapa/` | **Feito (fase 6)** | Polimento visual (cartões/selos iguais às outras telas); dados reais no check-out 3 |
| `/prefeitura` | `app/prefeitura/page.js` + `TelaPrefeitura` | **Feito (fase 4)** | Senha `prefeitura` + lista + “marcar resolvido” (só na tela) |

Menu (todas as telas): `components/MenuLateral.js`  
Identidade (cores/botões): `app/globals.css`

## 4\. Fluxo do cidadão (o que a pessoa vê)

```plaintext
Home (/)
  → Nova denúncia (/denuncia)
       → clica Enviar (onClick mínimo)
            → Sucesso (/denuncia/sucesso?protocolo=...)
                 → pode ir para Acompanhar ou Home
  → Acompanhar (/acompanhar)  → digita protocolo → vê status
  → Mapa (/mapa)             → vê pontos e lista
```

### Tela de sucesso (como vai funcionar)

1.  A pessoa está em `/denuncia` e clica **Enviar Denúncia**.
2.  O front **ainda não grava no banco**. A função `sortearProtocoloExemplo()` em `lib/denuncias-exemplo.js` escolhe **um** `**id**` **aleatório** da lista mock (ex.: `748393`, `748401`…).
3.  O navegador vai para algo como:

```plaintext
/denuncia/sucesso?protocolo=748393
```

1.  A tela mostra o número, um botão para **copiar**, e links para **Acompanhar** e **Home**.

**Por que sortear um** `**id**` **do mock?**  
Assim, na demo, a tela Acompanhar (e o mapa) já “conhecem” aquele protocolo. Se gerássemos um número inventado, Acompanhar diria “não encontrado”.

**Por que** `**?protocolo=**`**?**  
É um jeito simples de passar o número na URL sem banco. No check-out 3, a API cria o protocolo de verdade; a tela de sucesso pode continuar quase igual.

## 5\. Fluxo da prefeitura (só front)

```plaintext
Home → Prefeitura (/prefeitura)
  → digita a senha de teste: prefeitura
  → se estiver certa, vê a lista de denúncias pendentes (mock)
  → clica “Marcar como resolvido”
  → o status muda **só na memória da tela**
     (se recarregar a página, volta ao mock — normal no check-out 2)
```

| Situação | O que mostrar |
| --- | --- |
| Senha errada | Mensagem de erro clara |
| Senha certa | Lista + ações |
| Marcou resolvido | Item some da lista de pendentes ou muda o selo para RESOLVIDO |

**Importante:** a senha `prefeitura` é **só para testar o visual**. No check-out 3 ela sai do código e vai para o arquivo `.env` (`ADMIN_PASSWORD`).

## 6\. Estados da tela Acompanhar

Quem for programar `/acompanhar` deve prever estes estados (mesmo com dados de mentira):

| Estado | Quando | O que a pessoa vê |
| --- | --- | --- |
| Vazio | Acabou de abrir a tela | Campo de protocolo + botão Buscar |
| Carregando | Clicou em Buscar | “Buscando…” (pode ser curto, simulado) |
| Encontrado | Protocolo existe no mock | Endereço, descrição, status (PENDENTE / RESOLVIDO) |
| Não encontrado | Protocolo não existe no mock | Mensagem amigável (“Não achamos esse protocolo”) |

Os dados de exemplo hoje estão em `lib/denuncias-exemplo.js` (campo `id` = protocolo).  
Exemplos que já existem no arquivo: `748393`, `748401`, `748410`, …

**Pré-preencher:** se a URL for `/acompanhar?protocolo=748393` (link vindo do sucesso), o campo já abre com esse número.

## 7\. Mock agora × backend depois

| Agora (check-out 2) | Depois (check-out 3) |
| --- | --- |
| Lista em `lib/denuncias-exemplo.js` | Dados no SQLite via Prisma |
| Protocolo simulado no Enviar / URL | API cria o protocolo de verdade |
| Senha `prefeitura` no código do front | Senha só no `.env` |
| “Resolver” só muda o estado do React | API grava `RESOLVIDO` no banco |
| Foto só visual / escolha local | Upload em `public/uploads` |

**Dica:** mantenha os **mesmos nomes de campo** (`id`, `endereco`, `descricao`, `status`, `lat`, `lng`). Assim, quando ligar a API, as telas quase não mudam.

## 8\. Identidade visual (resumo)

*   **Fonte:** Poppins (não Inter — o guia antigo mostrava Inter; o projeto usa Poppins).
*   **Verde principal:** `#2D6A4F` (`--primary` no CSS).
*   **Classes prontas:** `btn-primario`, `btn-secundario`, `btn-invertido`, `btn-contorno`, `cartao`, `headline`, `body-text`, `label-text`.
*   **Ícones:** Material Icons Outlined via componente `Icone`.
*   **Referências:** fotos em [`ideias_layouts/`](./ideias_layouts/) (Home FiscalizApp, formulário de denúncia, guia de cores).

A tela `/denuncia` tem CSS **próprio** (inline). As **outras** telas novas devem preferir `globals.css` + classes do projeto, para ficarem iguais à Home/Mapa.

## 9\. Ordem sugerida de implementação

1.  **Documentação** ← Fase 1 (feita).
2.  **Sucesso** — `app/denuncia/sucesso/page.js` ← Fase 2 (feita).
3.  **Enviar** — `BotaoEnviarDenuncia` sorteia `id` do mock → sucesso ← Fase 2 (feita).
4.  **Acompanhar** — tirar o `PlaceholderTela` ← Fase 3 (feita).
5.  **Prefeitura** — senha `prefeitura` + lista mock ← Fase 4 (feita).
6.  **Home** — visual FiscalizApp (sem perfil, sem ilustração) ← Fase 5 (feita).
7.  **Mapa** — polimento visual (fase 6, opção B) ← feita.

## 10\. Como testar (passo a passo)

1.  `git checkout checkout2` (ou confirme que já está nela).
2.  `npm run dev`
3.  Abra [http://localhost:3000](http://localhost:3000)
4.  Percorra: Home → Denúncia → Enviar → Sucesso → Acompanhar (use um `id` do mock) → Mapa → Prefeitura (senha `prefeitura`).
5.  No celular (ou DevTools → modo responsivo): menu abre/fecha e os formulários cabem na tela.

## 11\. Palavras rápidas (glossário mínimo)

| Palavra | Significado simples |
| --- | --- |
| **Rota / URL** | O endereço na barra do navegador (`/mapa`) |
| `**page.js**` | Arquivo que o Next.js usa para desenhar aquela URL |
| **Placeholder** | Página temporária (“ainda não implementada”) |
| **Mock** | Dados de mentira só para o visual funcionar |
| `**onClick**` | Função que roda quando a pessoa clica num botão |
| `**"use client"**` | Aviso no topo do arquivo: esta tela precisa de estado no navegador |

Mais termos: [02-glossario.md](./02-glossario.md).

## Referências

| Documento | Para quê |
| --- | --- |
| [09-planejamento-checkouts.md](./09-planejamento-checkouts.md) | Check-outs 2, 3 e 4 + branches |
| [04-rotas-e-telas.md](./04-rotas-e-telas.md) | Como pasta vira URL |
| [08-identidade-e-menu.md](./08-identidade-e-menu.md) | Cores, Poppins, menu |
| [mpv.md](./mpv.md) | O que entra no produto mínimo |
| [`ideias_layouts/`](./ideias_layouts/) | Fotos do guia visual do grupo |