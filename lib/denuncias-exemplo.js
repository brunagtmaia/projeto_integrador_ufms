// =============================================================================
// DADOS DE EXEMPLO DAS DENÚNCIAS (só front — sem banco)
// =============================================================================
// A tela /mapa precisa de uma LISTA e de PONTOS no mapa. O Prisma ainda não
// grava denúncia. Este arquivo “mente” para o visual: finge que a API já
// devolveu os casos.
//
// Como usar em outro arquivo:
//   import { DENUNCIAS_EXEMPLO, CENTRO_MAPA } from "@/lib/denuncias-exemplo";
//   (hoje usamos caminho relativo: ../../lib/denuncias-exemplo)
//
// Quando o grupo ligar o banco:
//   1) criar GET /api/denuncias
//   2) na TelaMapa, em vez deste array, fazer fetch
//   3) manter os MESMOS nomes de campo (id, endereco, status, lat, lng)
//      assim o mapa e os cartões não precisam ser reescritos.
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
