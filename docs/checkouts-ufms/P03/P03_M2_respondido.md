**PLANO DE TESTES**

**AVALIAÇÃO DO MÓDULO 2 \- TESTE DE SOFTWARE APLICADO**

**Projeto de Extensão:** Programa de Extensão UFMS Digital (95DX7.200525)

**Nome completo: BRUNA DE OLIVEIRA MAIA GONTIJO**

**EMANUELLE GIOVANA DE ALMEIDA RODRIGUES**

**THAIS SOUZA OLIVEIRA**

**THAYZA DE OLIVEIRA SILVA DA CRUZ**

**YASMIM CARVALHO MOREIRA**

**Disciplina:** Projeto Integrador de Tecnologia da Informação III

**Semestre letivo:** 2026.2

**Curso:** Tecnologia da Informação

**Público-alvo:** Comunidades que enfrentam problemas motivados pelo mato alto.

**Local de realização:** Inspeção técnica realizada de forma remota sobre o repositório do projeto (GitHub). Sessão de validação com representantes do público-alvo em São Carlos (SP) e Divinópolis (MG).

**Título da ação:** LOTES VAGOS NO ESPAÇO URBANO: DESAFIOS E POTENCIAIS PERIGOS

**Resumo:** Este documento apresenta o plano de testes do *FiscalizApp*, aplicação web para registro e acompanhamento de denúncias de lotes vagos com mato alto. O plano foi construído a partir dos 30 defeitos encontrados na inspeção do Módulo 1 e define estratégias de teste unitário, de API, de componentes, ponta a ponta, de segurança e de acessibilidade, com seus ambientes, responsáveis e critérios de priorização de defeitos. Também são apresentados um cronograma com estimativas de esforço e os riscos do plano com suas mitigações, de modo que as próximas etapas do projeto sejam verificáveis e rastreáveis.

**Palavras-chave:** Lotes vagos. Saúde pública. Desenvolvimento web. Participação social.

**Introdução**

* O *FiscalizApp* é uma aplicação web criada para aproximar moradores de São Carlos (SP) e Divinópolis (MG) da gestão municipal no combate aos problemas causados por lotes vagos com mato alto, como acúmulo de lixo, animais peçonhentos e mosquitos como o *Aedes aegypti*. O MVP desenvolvido no Projeto Integrador II permite que o cidadão registre uma denúncia sem login (com foto e localização), consulte o andamento por protocolo e visualize os casos em um mapa interativo, enquanto a prefeitura, autenticada por senha, marca as denúncias como resolvidas. A aplicação foi construída com Next.js (App Router), Prisma com SQLite, Leaflet com OpenStreetMap e armazenamento de fotos em `public/uploads`.
* O objetivo deste plano de testes é organizar, de forma planejada e rastreável, como o *FiscalizApp* será verificado e validado. Na inspeção do Módulo 1 identificamos 30 defeitos (4 de alta, 16 de média e 10 de baixa severidade) e vimos que, embora os 46 testes automatizados existentes passem, eles não cobrem situações importantes, como coordenadas fora do intervalo válido, upload de arquivos inválidos, o formulário de denúncia e o mapa. O plano é importante porque transforma esses achados em casos de teste concretos, define quem executa cada atividade e em que ordem, e evita que os mesmos defeitos reapareçam nas próximas alterações do código.
* O escopo testado é o do MVP, e o escopo foi definido assim por duas razões: (i) o escopo ideal do PI I (cadastro, login, busca por CEP, vídeo, e-mail) foi conscientemente retirado do produto e registrado como trabalhos futuros, então não faz sentido testar o que não existe; e (ii) a equipe tem tempo e pessoas limitados no semestre, e concentrar o esforço nos fluxos críticos gera mais valor. Estão **dentro do escopo**: tela inicial (`/`), criação de denúncia (`/denuncia` e `/denuncia/sucesso`), acompanhamento por protocolo (`/acompanhar`), mapa (`/mapa`), painel da prefeitura (`/prefeitura`) e as APIs `POST/GET /api/denuncias`, `PATCH /api/denuncias/{id}/resolver` e `GET /api/geocode`, além do modelo de dados (Prisma). Estão **fora do escopo**: login e cadastro de cidadãos, busca por CEP, vídeos, notificações por e-mail e testes de carga em escala real, por não fazerem parte do MVP.
* Para construir os testes serão considerados os seguintes recursos do projeto: o relatório de inspeção do Módulo 1 (lista de defeitos e matriz de rastreabilidade), a especificação de requisitos (RF-01 a RF-16) e o `docs/mpv.md`, o código-fonte (`app/`, `components/`, `lib/`), o esquema `prisma/schema.prisma`, a suíte já existente (`tests/` com Vitest e `e2e/` com Playwright) e as configurações `vitest.config.mjs` e `playwright.config.mjs`.

**Estratégias de teste**

As escolhas abaixo foram feitas com base nas características do *FiscalizApp*: aplicação web em JavaScript, com muita interação de tela (formulário, mapa), APIs que recebem arquivos e dados sensíveis (localização, fotos), e uma equipe iniciante, o que favorece ferramentas simples e já instaladas no projeto. Seguimos a ideia da pirâmide de testes (muitos testes unitários e de API, menos testes de componentes e poucos testes ponta a ponta), conforme Valente (2020).

**1. Testes unitários**

* **Objetivos:** verificar, de forma isolada e rápida, as funções auxiliares e as regras de validação, garantindo que cada pedaço pequeno do código se comporte como esperado (inclusive nos casos de borda).
* **Escopo:** funções de `lib/` (`gerar-protocolo.js`, `fotos-denuncia.js`), validação de latitude (-90 a 90) e longitude (-180 a 180), validação dos valores permitidos de status, validação de tamanho e formato de fotos e geração de protocolo com `crypto.randomInt`.
* **Ferramentas:** Vitest (`npm test`).

**2. Testes de API (integração)**

* **Objetivos:** verificar o contrato das rotas (status HTTP, formato do JSON, mensagens de erro) e as regras de negócio no servidor, como criação de denúncia, consulta por protocolo, resolução apenas pela prefeitura autenticada e paginação.
* **Escopo:** `POST /api/denuncias` (campos obrigatórios, coordenadas inválidas, arquivo inválido ou grande demais, arquivo com extensão trocada), `GET /api/denuncias` (lista e paginação), `GET ?protocolo=` (protocolo existente, inexistente e malformado), `PATCH /api/denuncias/{id}/resolver` (senha correta, senha errada, sem senha, denúncia já resolvida) e `GET /api/geocode` (resposta do serviço e falha do serviço externo).
* **Ferramentas:** Vitest com *mocks* do Prisma e do serviço Nominatim, para não depender do banco de desenvolvimento nem da internet.

**3. Testes de componentes (interface)**

* **Objetivos:** garantir que as telas exibam e reajam corretamente à ação da usuária, como se uma pessoa estivesse usando, cobrindo as lacunas de teste encontradas na inspeção.
* **Escopo:** `FormularioDenuncia` (validações, mensagens de erro, envio), `TelaMapa` (marcadores, legenda e cores pendente/resolvida), `TelaSucessoDenuncia` (protocolo exibido e botão de copiar), `TelaAcompanhar` e `TelaPrefeitura` (já cobertas, serão ampliadas), e `MenuLateral`.
* **Ferramentas:** Vitest, Testing Library, `user-event` e jsdom (o Leaflet será simulado por *mock* nos testes de componente).

**4. Testes ponta a ponta (E2E)**

* **Objetivos:** validar os fluxos completos do ponto de vista do usuário real, passando por tela, API e banco.
* **Escopo:** (a) cidadão cria denúncia com foto, recebe o protocolo e consulta o andamento; (b) a denúncia aparece no mapa; (c) a prefeitura entra com a senha e marca a denúncia como resolvida; (d) o cidadão consulta o protocolo e vê o status "resolvida"; (e) cenários de erro (protocolo inexistente, senha incorreta, foto inválida).
* **Ferramentas:** Playwright (Chromium) com `npm run test:e2e`, usando um banco de dados exclusivo de testes via `DATABASE_URL` e limpeza dos dados ao final.

**5. Testes de segurança e privacidade**

* **Objetivos:** verificar os defeitos de segurança encontrados na inspeção e reduzir o risco de exposição de dados pessoais, em linha com a LGPD.
* **Escopo:** autenticação da prefeitura (bloqueio após várias tentativas), upload de arquivos (tipo real do arquivo pela assinatura, tamanho máximo, remoção de metadados EXIF), tentativa de enumeração de protocolos, entradas com caracteres especiais (XSS/injeção) nos campos de texto e verificação do que a API pública devolve (dados desnecessários).
* **Ferramentas:** Vitest/Playwright para os casos automatizados, ESLint com regras de segurança e `npm audit` para dependências. A revisão manual seguirá o checklist de código seguro usado na inspeção.

**6. Análise estática e qualidade de código**

* **Objetivos:** detectar problemas antes da execução, mantendo o código consistente. A inspeção apontou quatro erros e dois avisos do ESLint que precisam chegar a zero.
* **Escopo:** todo o código em `app/`, `components/`, `lib/`, `tests/` e `e2e/`.
* **Ferramentas:** ESLint (`npm run lint`), executado localmente e na integração contínua.

**7. Testes de usabilidade, acessibilidade e responsividade**

* **Objetivos:** verificar se o público-alvo consegue usar o app em celulares comuns, já que a maior parte das denúncias será feita em campo, e se a interface respeita boas práticas de acessibilidade.
* **Escopo:** telas de denúncia, mapa e acompanhamento em tamanho de celular e computador, contraste, textos alternativos, foco por teclado e legenda de cores do mapa.
* **Ferramentas:** emulação de dispositivos do Playwright e Chrome DevTools (Lighthouse), mais uma sessão de validação com representantes do público-alvo de São Carlos e Divinópolis.

**8. Testes de regressão**

* **Objetivos:** garantir que as correções dos defeitos não quebrem o que já funcionava.
* **Escopo:** toda a suíte (unitária, API, componentes e E2E) a cada alteração.
* **Ferramentas:** GitHub Actions executando `npm run lint`, `npm test` e `npm run test:e2e` a cada *push* e *pull request*.

**Recursos e ambientes**

* **Hardware:** computadores pessoais das integrantes (mínimo de 8 GB de RAM, processador com 4 núcleos e cerca de 5 GB livres em disco, para o Node.js, o Chromium do Playwright e o projeto), conexão com a internet (necessária para os tiles do OpenStreetMap, para o Nominatim e para o GitHub) e um celular com Android ou iOS para os testes de usabilidade. Na integração contínua usaremos os executores gratuitos do GitHub Actions (Ubuntu).
* **Software e dependências:** Node.js (versão LTS), npm, Git e GitHub; Next.js 16 e React 19; Prisma 6 e SQLite; Vitest, Testing Library, `@testing-library/user-event`, `@testing-library/jest-dom` e jsdom; Playwright com Chromium; ESLint 9 com `eslint-config-next`; Leaflet e react-leaflet; Visual Studio Code como editor. Variáveis de ambiente: `DATABASE_URL` (banco de testes separado, por exemplo `test.db`) e `ADMIN_PASSWORD` (senha fictícia, só para testes). Os testes **não** usarão o banco `dev.db` de desenvolvimento.
* **Ambientes:** (1) *local*, onde cada integrante executa os testes antes do commit; (2) *integração contínua*, que roda a suíte completa em ambiente limpo a cada *push* e *pull request*; (3) *teste/homologação*, com banco isolado e dados fictícios, usado nos testes E2E e na validação com o público-alvo.
* **Equipe e responsabilidades:**

| Integrante | Responsabilidades no processo de testes |
| :---- | :---- |
| Bruna de Oliveira Maia Gontijo | Coordenação do plano; testes de componentes e E2E do mapa; configuração do GitHub Actions e do banco de testes; manutenção da matriz de rastreabilidade. |
| Emanuelle Giovana de Almeida Rodrigues | Testes de API e de segurança da área da prefeitura (autenticação, limite de tentativas, rota de resolver); testes E2E do fluxo da prefeitura. |
| Thais Souza Oliveira | Testes do formulário de criação de denúncia (componentes e validações), testes de upload de arquivos (assinatura, tamanho, EXIF) e testes unitários de coordenadas. |
| Thayza de Oliveira Silva da Cruz | Testes da tela inicial e do menu, testes de usabilidade, acessibilidade e responsividade, e organização da sessão de validação com o público-alvo. |
| Yasmim Carvalho Moreira | Testes da tela de acompanhamento e do protocolo (geração segura, consulta, enumeração), testes do geocode e registro dos defeitos no controle de erros. |

Todas as integrantes revisam os *pull requests* umas das outras e participam da priorização dos defeitos.

**Gestão de erros e defeitos**

* **Registro:** todo defeito encontrado nos testes (manuais ou automáticos) será aberto como *issue* no GitHub, com o modelo: identificador (D-01, D-02…), título, artefato afetado, passos para reproduzir, resultado esperado, resultado obtido, evidência (print, log ou teste que falha), severidade, tipo, responsável e requisito relacionado. Os identificadores seguirão a numeração do relatório de inspeção, quando o defeito for o mesmo, para manter a rastreabilidade.
* **Acompanhamento:** as *issues* serão organizadas em um quadro (GitHub Projects) com as colunas *Aberto*, *Em análise*, *Em correção*, *Em reteste* e *Fechado*. A equipe revisa o quadro na reunião semanal. Cada correção é feita em uma *branch* própria, passa pelo *pull request* com ESLint e testes verdes e só depois é integrada à `main`.
* **Resolução:** um defeito só é considerado fechado depois de (i) corrigido, (ii) existir um teste automatizado que falhava antes e passa depois (teste de regressão) e (iii) outra integrante, que não escreveu a correção, refazer o reteste. Defeitos que não forem corrigidos no semestre serão registrados como trabalhos futuros, com justificativa.
* **Política de priorização:**

| Severidade | Critério | Prazo para tratar |
| :---- | :---- | :---- |
| Alta | Compromete segurança, privacidade ou o fluxo principal (denunciar, consultar, resolver), ou impede a continuidade dos testes. | Imediato, antes de qualquer outra tarefa; bloqueia a integração na `main`. |
| Média | Funcionalidade com comportamento incorreto ou inconsistente com o requisito, com alternativa de uso. | Até o fim da iteração em andamento. |
| Baixa | Problema cosmético, de texto, de organização de código ou de documentação, sem impacto no uso. | Quando houver tempo, na melhoria contínua. |

  Em caso de empate, damos prioridade ao defeito que (a) afeta mais telas ou APIs, (b) bloqueia outros testes ou (c) expõe dados pessoais. A ordem geral segue a priorização do Módulo 1: requisitos e ESLint; coordenadas, cobertura e isolamento do banco de testes; serviços web seguros; integração e entrega contínua; e, por fim, a melhoria contínua.

**Cronograma**

O esforço foi estimado em horas de trabalho da equipe e a complexidade em Baixa, Média ou Alta, considerando a experiência iniciante do grupo.

| Etapa | Atividades | Complexidade | Esforço estimado | Responsáveis |
| :---- | :---- | :---- | :---- | :---- |
| 1. Preparação | Revisar defeitos do Módulo 1, atualizar a matriz de rastreabilidade, corrigir os 4 erros e 2 avisos do ESLint, criar banco de testes (`DATABASE_URL`) | Média | 10 h | Bruna, Todas |
| 2. Testes unitários | Coordenadas, status, protocolo com `crypto.randomInt`, validação de foto | Baixa | 8 h | Thais, Yasmim |
| 3. Testes de API | Casos de borda do `POST`, paginação, protocolo, resolver, geocode com *mock* | Média | 14 h | Emanuelle, Yasmim |
| 4. Testes de componentes | Formulário, mapa, tela de sucesso, menu e ampliação de acompanhar/prefeitura | Alta | 18 h | Thais, Bruna, Thayza |
| 5. Testes de segurança | Autenticação e limite de tentativas, upload (assinatura e EXIF), enumeração de protocolo, XSS | Alta | 14 h | Emanuelle, Thais |
| 6. Testes E2E | Fluxo completo e cenários de erro, com banco isolado e limpeza | Alta | 14 h | Bruna, Emanuelle |
| 7. Usabilidade e acessibilidade | Responsividade, Lighthouse, sessão com o público-alvo | Média | 10 h | Thayza, Todas |
| 8. Integração contínua | Fluxo no GitHub Actions (lint, Vitest, Playwright) | Média | 6 h | Bruna |
| 9. Correção e reteste | Correção dos defeitos e testes de regressão | Alta | 20 h | Todas |
| 10. Fechamento | Relatório de resultados, atualização da documentação e revisão final | Baixa | 6 h | Todas |
| **Total** |  |  | **120 h** (cerca de 24 h por integrante) |  |

Distribuição prevista ao longo de oito semanas: semanas 1 a 2 (etapas 1 e 2); semanas 3 a 4 (etapas 3 e 4); semana 5 (etapa 5 e início da 8); semanas 6 a 7 (etapas 6, 7 e 9); semana 8 (etapas 9 e 10). A etapa 8 é antecipada para que a integração contínua já proteja as demais.

**Riscos e mitigações**

| \# | Risco | Probabilidade / Impacto | Estratégia de mitigação |
| :---- | :---- | :---- | :---- |
| R1 | Pouco tempo da equipe por causa de outras disciplinas e provas. | Alta / Alta | Priorizar defeitos de alta severidade e fluxos críticos; dividir tarefas por integrante; deixar testes de baixa severidade para o fim. |
| R2 | Pouca experiência da equipe com testes automatizados e segurança. | Média / Média | Usar as ferramentas já instaladas, trabalhar em pares, seguir o guia `docs/12-checkout4-testes.md` e consultar o material da disciplina. |
| R3 | Testes E2E alterarem ou corromperem os dados de desenvolvimento (`dev.db`). | Média / Alta | Banco exclusivo de testes via `DATABASE_URL`, limpeza ao final e um único *worker* no Playwright. |
| R4 | Testes instáveis (*flaky*) por causa do mapa, do Nominatim e de tempo de resposta. | Alta / Média | *Mocks* do Nominatim e dos tiles, esperas explícitas do Playwright e repetição de teste suspeito antes de abrir defeito. |
| R5 | Dependência de serviços externos (Nominatim, OpenStreetMap, GitHub Actions) fora do ar ou com limite de uso. | Média / Média | *Mocks* nos testes automáticos, respeito à política de uso do Nominatim, cache e testes manuais como alternativa. |
| R6 | Ao corrigir um defeito, quebrar outra funcionalidade. | Média / Alta | Testes de regressão automáticos na integração contínua e *pull request* obrigatório com revisão. |
| R7 | Mudança de requisitos (por exemplo, quem pode marcar como resolvida) invalidar casos de teste. | Média / Média | Manter a matriz de rastreabilidade atualizada e validar a decisão com o público-alvo antes de escrever os testes afetados. |
| R8 | Falta de acesso do público-alvo de São Carlos e Divinópolis na data da sessão de validação. | Média / Média | Combinar a data com antecedência, ter plano B por videochamada e usar um roteiro curto de tarefas. |
| R9 | Uso de dados pessoais reais nos testes (fotos de pessoas, placas, endereços). | Baixa / Alta | Usar apenas dados e imagens fictícias e bloquear o commit de arquivos de `public/uploads`. |
| R10 | Arquitetura de implantação (SQLite e arquivos locais) incompatível com o ambiente de hospedagem, impedindo testes em ambiente semelhante ao real. | Média / Alta | Formalizar a decisão arquitetural (demonstração local ou banco e armazenamento persistentes) e testar no ambiente escolhido. |

**Evidências da linha de base (execução em 03/11/2026)**

Antes de detalhar os novos testes, executamos o projeto (branch `main`) para registrar o ponto de partida. Os arquivos estão na pasta `evidencias/`, ao lado deste documento.

| \# | Verificação | Resultado | Evidência |
| :---- | :---- | :---- | :---- |
| E1 | `npm test` (Vitest) | 8 arquivos e 46 testes, todos aprovados | `01_vitest.txt` |
| E2 | `npx eslint .` | 4 erros e 2 avisos (setState em efeito e ref durante a renderização), confirmando o defeito de telas do Módulo 1 | `02_eslint.txt` |
| E3 | `npx playwright test` | 1 teste E2E aprovado (denunciar, acompanhar e resolver). O teste gravou dados no mesmo banco de desenvolvimento, confirmando o risco de falta de isolamento | `03_playwright_e2e.txt` |
| E4 | Latitude 999 no `POST /api/denuncias` | **Aceita** (HTTP 201) e salva com a coordenada inválida; o defeito se confirma | `04_testes_exploratorios_api.txt` (T1) |
| E5 | Arquivo de texto enviado como `image/jpeg` | Rejeitado quando pequeno (apenas pelo tamanho), mas **aceito** (HTTP 201) com 8 KB; o conteúdo não é verificado | T2 e T2b |
| E6 | Foto salva em `public/uploads` | Idêntica byte a byte à enviada; não há reprocessamento nem remoção de EXIF | T8 (comparação `cmp`) |
| E7 | 10 senhas erradas seguidas na rota de resolver | Todas respondidas com 401, sem bloqueio nem limite de tentativas | T5 |
| E8 | Texto `<script>alert(1)</script>` na descrição | Salvo e exibido como texto, sem executar script (o React escapa o conteúdo); não houve alerta no navegador | `11_xss_resultado.txt` e `10_acompanhar_protocolo_*.png` |
| E9 | Protocolo inexistente e foto ausente | Respondem 404 e 400 com mensagens claras (comportamento correto) | T4 e T6 |
| E10 | Telas em computador (1280 px) e celular (390 px) | Todas abrem e se adaptam; o mapa mostra cartões com um quadrado parecido com caixa de seleção sem função, e os marcadores ficam com o mapa inicial no mundo todo | `05` a `10_*.png` |

Esses resultados mostram que a suíte atual passa, mas não detecta os defeitos de validação e segurança (E4 a E7), o que justifica os testes novos previstos neste plano. Os casos E4 a E7 serão transformados em testes automatizados que devem falhar antes da correção e passar depois.

**Referências**

* DELAMARO, Márcio Eduardo; MALDONADO, José Carlos; JINO, Mario. **Introdução ao teste de software**. Rio de Janeiro: GEN LTC, 2016\.
* FAGAN, Michael E. Design and code inspections to reduce errors in program development. **IBM Systems Journal**, v. 15, n. 3, p. 182-211, 1976\.
* OPENSTREETMAP FOUNDATION. **Nominatim usage policy**. \[S. l.\], \[2024\]. Disponível em: https://operations.osmfoundation.org/policies/nominatim/. Acesso em: 18 out. 2026\.
* SOMMERVILLE, Ian. **Engenharia de software**. 9\. ed. São Paulo: Pearson, 2011\.
* VALENTE, Marco Tulio. **Engenharia de software moderna**: princípios e práticas para desenvolvimento de software com produtividade. Belo Horizonte: Independente, 2020\. Disponível em: https://engsoftmoderna.info. Acesso em: 18 out. 2026\.
