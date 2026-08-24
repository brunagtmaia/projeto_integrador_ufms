# Como contribuir (sem bagunçar o trabalho das outras)

Este guia é o “modo de usar” o repositório no dia a dia.

## Antes de escrever código

1. Leia [01-o-projeto.md](./01-o-projeto.md) e o [mpv.md](./mpv.md) — para não implementar login sem o grupo ter pedido.
2. Se não souber o que é Next, React ou Tailwind: [07-bibliotecas.md](./07-bibliotecas.md).
3. Rode o site na sua máquina ([arquitetura_e_tecnologias.md](./arquitetura_e_tecnologias.md)).
4. Avise no grupo **qual tela** você vai fazer (`/denuncia`, `/mapa`, …) para duas pessoas não editarem o mesmo arquivo ao mesmo tempo.

## Onde mexer em cada tarefa

| Tarefa | Arquivos típicos |
| --- | --- |
| Mudar texto/botões da Home | `app/page.js` |
| Incluir a mesma tela no menu | `components/MenuLateral.js` (array `itens`) |
| Cores / estilo dos botões | `app/globals.css` (ver [08-identidade-e-menu.md](./08-identidade-e-menu.md)) |
| Implementar o formulário de denúncia | `app/denuncia/page.js` (e depois API + Prisma) |
| Consulta por protocolo | `app/acompanhar/page.js` |
| Mapa | `app/mapa/page.js` (e instalar Leaflet no passo certo) |
| Marcar resolvido | `app/prefeitura/page.js` + senha no `.env` |
| Componente usado em várias telas | pasta `components/` |
| Função auxiliar (gerar protocolo) | pasta `lib/` (criar o arquivo quando precisar) |
| Explicar algo para o grupo | pasta `docs/` |

## Comentários no código

O grupo combinou **comentar bastante**, em **português**, porque várias pessoas estão começando.

- Explique **o que** o bloco faz e **por quê** (não só “aqui tem um if”).
- Não apague os comentários das rotas sem necessidade: elas servem de aula.
- Quando você criar um arquivo novo, comece com 4–8 linhas dizendo: rota, o que o MVP pede, o que ainda falta.

## Git: o mínimo que você precisa

No terminal, **sempre** na pasta que tem o `package.json`:

```bash
git status          # o que mudou
git pull            # puxar o que as outras já enviaram
# ... edite os arquivos ...
git add app/denuncia/page.js    # só o que você fez (exemplo)
git commit -m "Mensagem clara em português"
git push
```

**Não faça** (a menos que o grupo peça com clareza):

- `git push --force` na branch principal;
- commitar `.env`, `node_modules`, fotos de denúncia, `dev.db`;
- pular o `git pull` antes de começar o dia (dá conflito depois).

Mensagens de commit boas: “Adiciona formulário de denúncia”, “Corrige link da Home”. Ruins: “ajuste”, “aaaa”, “final”.

## Se o código das outras veio diferente do seu

Isso se chama **conflito**. O Git marca os dois trechos no arquivo. Não chute: parem, comparem juntos e escolham o que fica. Se tiver medo de perder trabalho, avise antes de apagar.

## Checklist rápido antes de dizer “terminei”

- [ ] `npm run dev` abre sem erro vermelho no terminal
- [ ] A Home ainda leva a todas as telas
- [ ] O menu lateral abre, fecha (X / fundo / Esc) e marca a tela atual
- [ ] A tela que você fez funciona no caminho combinado (`/denuncia`, etc.)
- [ ] Comentários em português nos trechos novos
- [ ] `git status` **não** mostra `.env` nem `node_modules`
