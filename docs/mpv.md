> Índice da documentação (para iniciantes): [README.md](./README.md).

## O que simplificar no produto

**MVP mínimo**

*   Home com os botões
*   Denúncia **sem login** (localização + foto + gerar protocolo)
*   Acompanhar **só por protocolo**
*   Tela de mapa com os pontos (pode ser lista + mapa simples)
*   Um jeito de marcar como resolvido (senha de “prefeitura” no `.env`, não um sistema de usuários completo)

**Deixar de fora (e escrever como “trabalhos futuros”)**

*   Cadastro, login, “esqueci a senha”, “minhas denúncias”
*   Busca por CEP/endereço e “buscar como resolvido” como tela extra
*   Vídeo (só foto)
*   Denúncia anônima **e** conta ao mesmo tempo
*   E-mail, papéis admin/cidadão, PostGIS, PWA

## Stack mínima

| Camada | Usar |   
| --- | --- |
| Linguagem | **JavaScript** (sem ) |   
| Front | **Next.js (App Router)** + **CSS modules** ou **Tailwind só o básico** |   
| Back | **mesmas rotas do Next** (`app/api/...` ou Server Actions) |   
| Banco | **SQLite** + **Prisma** (um arquivo `dev.db`) |  
| Mapa | **Leaflet** + OpenStreetMap |  
| Foto | salvar em `public/uploads` |  
| Deploy | **Vercel** | 

O que cada item da stack **é** (e o que já está instalado hoje): [07-bibliotecas.md](./07-bibliotecas.md). 

## Ordem de implementação

1.  Home + navegação ← feito (check-out 2)
2.  Formulário denúncia → grava no SQLite → mostra protocolo ← feito (check-out 3)
3.  Consulta por protocolo ← feito (check-out 3)
4.  Mapa com os registros ← feito (check-out 3)
5.  Marcar resolvido ← feito (check-out 3)
6.  Ajustar CSS no celular ← feito (check-out 2)

Guia do banco/backend (iniciantes): [11-checkout3-banco-backend.md](./11-checkout3-banco-backend.md).  
Roteiro ponta a ponta: seção do **passo 13** nesse guia.