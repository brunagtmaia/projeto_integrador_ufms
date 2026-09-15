// =============================================================================
// DADOS DE EXEMPLO DAS DENÚNCIAS (mock do check-out 2 — quase aposentado)
// =============================================================================
// No check-out 2 este arquivo “mentia” para o visual: lista falsa de casos.
// No check-out 3 as telas do MVP já usam a API + banco:
//   /denuncia, /acompanhar, /mapa e /prefeitura → NÃO usam mais
//   DENUNCIAS_EXEMPLO (passos 09, 10, 11 e 12).
//
// O que ainda importa daqui:
//   CENTRO_MAPA — ponto inicial do Leaflet (São Paulo) quando a lista
//   ainda está vazia ou antes do fitBounds. O /mapa importa só isso.
//
// Os nomes dos campos (id, endereco, status, lat, lng) continuam iguais
// aos do model Denuncia / da API — por isso o front quase não mudou.
//
// O que cada campo significa:
//   id        → número de protocolo (texto, para não perder zeros)
//   endereco  → o que aparece em negrito no cartão
//   descricao → o problema (mato, buraco, luz…)
//   status    → "PENDENTE" ou "RESOLVIDO" (tem que ser exatamente assim)
//   lat, lng  → latitude e longitude (GPS). O mapa não entende “Rua X”
//               sozinho: precisa desses dois números.
//
// São Paulo fica perto de lat -23.55 e lng -46.63 (sul e oeste).
// =============================================================================

export const DENUNCIAS_EXEMPLO = [
  {
    id: "748393",
    endereco: "Av. Paulista, 1578",
    descricao: "Mato alto em terreno",
    status: "PENDENTE",
    lat: -23.561414,
    lng: -46.655881,
  },
  {
    id: "748401",
    endereco: "Rua Augusta, 400",
    descricao: "Entulho na calçada",
    status: "PENDENTE",
    lat: -23.5538,
    lng: -46.6602,
  },
  {
    id: "748410",
    endereco: "Praça da Sé, s/n",
    descricao: "Iluminação quebrada",
    status: "RESOLVIDO",
    lat: -23.550385,
    lng: -46.633956,
  },
  {
    id: "748422",
    endereco: "Rua da Consolação, 2100",
    descricao: "Buraco na via",
    status: "PENDENTE",
    lat: -23.5552,
    lng: -46.6621,
  },
  {
    id: "748430",
    endereco: "Av. Brigadeiro Luís Antônio, 500",
    descricao: "Calçada irregular",
    status: "RESOLVIDO",
    lat: -23.5579,
    lng: -46.6418,
  },
];

// Primeiro enquadramento do mapa (meio da região dos pontos acima).
// Formato [latitude, longitude] — a ordem importa (lat primeiro).
export const CENTRO_MAPA = [-23.555, -46.65];

// =============================================================================
// Protocolo “simulado” no check-out 2 (sem banco)
// =============================================================================
// No Enviar da denúncia, escolhemos UM id que JÁ existe nesta lista.
// Assim a tela Acompanhar encontra o mesmo número no mock.
// No check-out 3 a API gera o protocolo de verdade.
export function sortearProtocoloExemplo() {
  const indice = Math.floor(Math.random() * DENUNCIAS_EXEMPLO.length);
  return DENUNCIAS_EXEMPLO[indice].id;
}

// Busca uma denúncia pelo protocolo (campo id) — SÓ no mock.
// A tela /acompanhar NÃO usa mais esta função (passo 10 usa a API).
// Mantido só como referência histórica / testes manuais pontuais.
// As telas do MVP não importam mais estas funções.
// Retorna o objeto ou null se não existir.
// trim() remove espaços; a comparação é pelo texto exato do id.
export function buscarDenunciaPorProtocolo(protocolo) {
  const limpo = String(protocolo || "").trim();
  if (!limpo) return null;
  return DENUNCIAS_EXEMPLO.find((d) => d.id === limpo) || null;
}

// Lista só as denúncias com status PENDENTE (tela da prefeitura).
// Aceita um array opcional: a prefeitura passa a cópia em memória
// (depois de marcar resolvido). Sem argumento, usa o mock original.
export function listarDenunciasPendentes(lista = DENUNCIAS_EXEMPLO) {
  return lista.filter((d) => d.status === "PENDENTE");
}
