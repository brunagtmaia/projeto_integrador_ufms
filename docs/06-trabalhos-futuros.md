# Trabalhos futuros (fora do MVP)

O [mpv.md](./mpv.md) lista o que **não** entra nesta entrega. Este arquivo explica o **porquê**, para ninguém gastar semana em uma tela que o grupo combinou deixar para depois.

Bibliotecas que **não** vamos adicionar agora (login, PostGIS, PWA) versus o que o MVP **já entrega** no check-out 3 (Prisma, APIs e telas ligadas ao banco). O Leaflet do mapa **já está** no projeto: [07-bibliotecas.md](./07-bibliotecas.md). Guia do check-out 3: [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md).

## Não implementar agora

| Ideia | Por que ficou de fora |
| --- | --- |
| Cadastro, login, “esqueci a senha” | O cidadão denuncia **sem conta**. Login pede e-mail, senha, recuperação — outro sistema inteiro. |
| “Minhas denúncias” | Exige saber **quem** é a pessoa. Sem login, o identificador é o **protocolo**. |
| Denúncia anônima **e** com conta ao mesmo tempo | Duas regras de negócio misturadas; o MVP escolheu só o protocolo. |
| Vídeo | Só **foto**, para simplificar upload e tamanho. |
| Busca por CEP como tela extra | O formulário já tem GPS + autocomplete de endereço (`/api/geocode`). CEP dedicado (ViaCEP etc.) continua fora do MVP. |
| Papéis admin/cidadão no banco | A “prefeitura” usa **uma senha** no `.env`, não uma tabela de usuários. |
| E-mail (avisos) | Precisa de serviço externo e configuração. Fora do mínimo. |
| PostGIS | Banco geográfico avançado. O MVP usa SQLite + pontos no mapa. |
| PWA (instalar na tela inicial) | Extra de “app”. O site responsivo no celular já atende. |

## O que o MVP **já tem** (ordem cumprida no check-out 3)

Isso **entra** no produto mínimo e **já está** no código da branch `checkout3`:

1. Home + navegação ← **feito**
2. Formulário de denúncia → gravar no SQLite → mostrar protocolo ← **feito** (passos 02–06 + **09**)
3. Consulta por protocolo ← **feita** (passo 10: tela chama `GET ?protocolo=`)
4. Mapa com os registros ← **feito** (passo 11: lista do banco)
5. Marcar como resolvido (senha `.env`) ← **feito** (API passo 08 + tela passo 12)
6. Ajustar CSS no celular (a `/mapa` já é responsiva) ← **feito** no check-out 2
7. Teste ponta a ponta (roteiro) ← **feito** (passo 13)

Se você for criar `/login`, pare e releia o MVP. O módulo atual da disciplina (check-out 4) é **testes automatizados** — passos **01–06** já cobrem Vitest, helpers, APIs, Testing Library e Playwright E2E; falta o passo 07 (docs finais + merge na `main`). Guia: [12-checkout4-testes.md](./12-checkout4-testes.md).

## Quando o trabalho da disciplina acabar

Aí sim o grupo pode (se quiser) desenhar cadastro, PWA, e-mail, etc. Até lá, **não crie rotas** para essas telas: elas confundem quem for testar o produto mínimo.
