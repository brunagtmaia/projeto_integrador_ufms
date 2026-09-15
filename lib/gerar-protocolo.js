// =============================================================================
// GERAR PROTOCOLO — número que a pessoa usa para acompanhar a denúncia
// =============================================================================
// O que é este arquivo?
//   Função que cria um protocolo NOVO (texto de 6 dígitos, ex.: "748393").
//   No check-out 2 o front sorteava um id do mock. Aqui geramos de verdade,
//   conferindo no banco se aquele número já existe.
//
// Por que texto (String) e não número?
//   O campo `id` no schema.prisma é String. Assim não perdemos zeros
//   à esquerda e batemos com o mock do front (`id: "748393"`).
//
// Quem chama esta função?
//   A API POST /api/denuncias (passo 06), quando for criar a denúncia.
//   As telas do navegador NÃO importam este arquivo direto (só o servidor).
//
// Como usar:
//   import { gerarProtocoloUnico } from "@/lib/gerar-protocolo";
//   const protocolo = await gerarProtocoloUnico();
//
// Check-out 3 · passo 05.
// Guia: docs/11-checkout3-banco-backend.md
// =============================================================================

import { prisma } from "./prisma";

/** Quantos dígitos o protocolo tem (igual aos exemplos do mock). */
const TAMANHO = 6;

/** Quantas tentativas máximas se der “colisao” (número já usado). */
const MAX_TENTATIVAS = 20;

/**
 * Sorteia um protocolo de 6 dígitos (ex.: "392847").
 * Sempre devolve string, com zeros à esquerda se precisar.
 */
function sortearSeisDigitos() {
  const max = 10 ** TAMANHO; // 1_000_000
  const numero = Math.floor(Math.random() * max);
  return String(numero).padStart(TAMANHO, "0");
}

/**
 * Gera um protocolo que ainda NÃO existe na tabela Denuncia.
 * Se por acaso o número já estiver no banco, tenta de novo.
 *
 * @returns {Promise<string>} protocolo único (ex.: "748393")
 */
export async function gerarProtocoloUnico() {
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    const candidato = sortearSeisDigitos();

    // findUnique: busca pela chave primária (id = protocolo).
    // Se voltar null, ninguém usa esse número ainda → podemos usar.
    const jaExiste = await prisma.denuncia.findUnique({
      where: { id: candidato },
      select: { id: true }, // só precisa saber se existe; não traz a linha toda
    });

    if (!jaExiste) {
      return candidato;
    }
  }

  // Quase impossível com 6 dígitos e poucas denúncias de teste.
  // Se acontecer, a API (passo 06) deve mostrar erro amigável.
  throw new Error(
    "Não foi possível gerar um protocolo único. Tente de novo.",
  );
}
