# Trabalhos futuros (fora do MVP)

O [mpv.md](./mpv.md) lista o que **não** entra nesta entrega. Este arquivo explica o **porquê**, para ninguém gastar semana em uma tela que o grupo combinou deixar para depois.

Bibliotecas que **não** vamos adicionar agora (login, PostGIS, PWA) versus o que **ainda falta no MVP** (Prisma + SQLite para gravar denúncia). O Leaflet do mapa **já está** no projeto: [07-bibliotecas.md](./07-bibliotecas.md).

## Não implementar agora

| Ideia | Por que ficou de fora |
| --- | --- |
| Cadastro, login, “esqueci a senha” | O cidadão denuncia **sem conta**. Login pede e-mail, senha, recuperação — outro sistema inteiro. |
| “Minhas denúncias” | Exige saber **quem** é a pessoa. Sem login, o identificador é o **protocolo**. |
| Denúncia anônima **e** com conta ao mesmo tempo | Duas regras de negócio misturadas; o MVP escolheu só o protocolo. |
| Vídeo | Só **foto**, para simplificar upload e tamanho. |
| Busca por CEP/endereço como tela extra | Localização no MVP pode ser mais simples (mapa/clique/GPS). |
| Papéis admin/cidadão no banco | A “prefeitura” usa **uma senha** no `.env`, não uma tabela de usuários. |
| E-mail (avisos) | Precisa de serviço externo e configuração. Fora do mínimo. |
| PostGIS | Banco geográfico avançado. O MVP usa SQLite + pontos no mapa. |
| PWA (instalar na tela inicial) | Extra de “app”. O site responsivo no celular já atende. |

## O que o MVP **ainda vai ter** (não é “futuro”, é a ordem)

Isso **entra**, só não está todo pronto no código hoje:

1. Home + navegação ← **feito**
2. Formulário de denúncia → gravar no SQLite → mostrar protocolo
3. Consulta por protocolo
4. Mapa com os registros ← **feito no front** (dados de exemplo; banco depois)
5. Marcar como resolvido (senha `.env`)
6. Ajustar CSS no celular (a `/mapa` já é responsiva)

Se você for implementar o item 2, 3, 5 ou o banco da lista do mapa, está no escopo. Se for criar `/login`, pare e releia o MVP.

## Quando o trabalho da disciplina acabar

Aí sim o grupo pode (se quiser) desenhar cadastro, PWA, e-mail, etc. Até lá, **não crie rotas** para essas telas: elas confundem quem for testar o produto mínimo.
