// =============================================================================
// API /api/denuncias — criar (POST) e buscar/listar (GET)
// =============================================================================
// O que é este arquivo?
//   No App Router do Next.js, a pasta app/api/denuncias/ + route.js vira a
//   URL http://localhost:3000/api/denuncias.
//   Isto NÃO é uma tela com botão — é o “atendente” no servidor.
//
// Métodos neste arquivo:
//   POST — cria denúncia + salva foto (check-out 3 · passo 06)
//   GET  — lista todas OU busca uma pelo protocolo (passo 07)
//
// Marcar resolvido NÃO fica aqui — é outra pasta/URL (passo 08):
//   PATCH /api/denuncias/[id]/resolver
//   → app/api/denuncias/[id]/resolver/route.js
//
// Guia: docs/11-checkout3-banco-backend.md
//
// Quem chama?
//   POST → tela /denuncia (FormularioDenuncia — passo 09)
//   GET  → /acompanhar (?protocolo= — passo 10), /mapa (lista — passo 11)
//          e /prefeitura (lista de pendentes — passo 12)
// =============================================================================

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { gerarProtocoloUnico } from "@/lib/gerar-protocolo";
import {
  fotoPrincipal,
  listarFotos,
  serializarFotos,
} from "@/lib/fotos-denuncia";
import { prisma } from "@/lib/prisma";

/** Extensões de imagem que aceitamos no MVP (só foto, sem vídeo). */
const EXTENSOES_OK = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

/** Tamanho máximo da foto: 5 MB (em bytes). */
const TAMANHO_MAX_BYTES = 5 * 1024 * 1024;

/**
 * Tamanho mínimo: evita “fotos” de 1×1 pixel / arquivos de teste
 * (ex.: PNG de 67 bytes) que na tela viram só um bloco de cor.
 */
const TAMANHO_MIN_BYTES = 2 * 1024;

/** Quantidade máxima de fotos por denúncia. */
const MAX_FOTOS = 5;

/**
 * Resposta JSON de erro, com mensagem em português para a pessoa / o front.
 * @param {string} mensagem
 * @param {number} status
 */
function erroJson(mensagem, status = 400) {
  return NextResponse.json({ ok: false, erro: mensagem }, { status });
}

/**
 * Monta o objeto “limpo” que devolvemos ao front (mesmos nomes do mock).
 * Assim mapa / acompanhar / prefeitura usam id, endereco, status, lat, lng…
 * @param {import("@prisma/client").Denuncia} denuncia
 */
function denunciaParaJson(denuncia) {
  const fotos = listarFotos(denuncia.foto);

  return {
    id: denuncia.id,
    endereco: denuncia.endereco,
    descricao: denuncia.descricao,
    status: denuncia.status,
    lat: denuncia.lat,
    lng: denuncia.lng,
    // `foto` = primeira (compatível com telas que já usam um único src).
    foto: fotoPrincipal(denuncia.foto),
    fotos,
    createdAt: denuncia.createdAt,
    updatedAt: denuncia.updatedAt,
  };
}

/**
 * GET /api/denuncias
 *
 * Duas formas (mesma URL, muda a query string):
 *
 * 1) Listar todas (mapa / prefeitura):
 *      GET /api/denuncias
 *      → 200 { ok: true, denuncias: [ ... ] }
 *
 * 2) Buscar uma pelo protocolo (acompanhar depois):
 *      GET /api/denuncias?protocolo=125172
 *      → 200 { ok: true, denuncia: { ... } }
 *      → 404 se não existir
 *
 * A lista vem da mais nova para a mais antiga (createdAt desc).
 *
 * @param {Request} request
 */
export async function GET(request) {
  try {
    // searchParams = o que vem depois do ? na URL
    // Ex.: /api/denuncias?protocolo=125172 → protocolo = "125172"
    const { searchParams } = new URL(request.url);
    const protocoloBruto = searchParams.get("protocolo");

    // ----- caso 1: veio ?protocolo=... → busca UMA -----
    if (protocoloBruto !== null) {
      const protocolo = String(protocoloBruto).trim();

      if (!protocolo) {
        return erroJson(
          'Informe o número do protocolo (ex.: ?protocolo=125172).',
        );
      }

      // findUnique = “ache a linha com este id” (id = protocolo no nosso schema)
      const denuncia = await prisma.denuncia.findUnique({
        where: { id: protocolo },
      });

      if (!denuncia) {
        return erroJson(
          "Não achamos nenhuma denúncia com esse protocolo.",
          404,
        );
      }

      return NextResponse.json({
        ok: true,
        denuncia: denunciaParaJson(denuncia),
      });
    }

    // ----- caso 2: sem protocolo → lista TODAS -----
    const lista = await prisma.denuncia.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ok: true,
      denuncias: lista.map(denunciaParaJson),
    });
  } catch (erro) {
    console.error("[GET /api/denuncias]", erro);
    return erroJson(
      "Não foi possível buscar as denúncias. Tente de novo em instantes.",
      500,
    );
  }
}

/**
 * Lê um campo de texto do FormData e tira espaços das pontas.
 * @param {FormData} formData
 * @param {string} nome
 */
function textoDoForm(formData, nome) {
  const valor = formData.get(nome);
  if (typeof valor !== "string") return "";
  return valor.trim();
}

/**
 * Converte lat/lng do formulário (vem como texto) em número.
 * Devolve null se estiver vazio ou não for um número válido.
 * @param {string} bruto
 * @returns {number | null}
 */
function lerCoordenada(bruto) {
  if (!bruto) return null;
  const n = Number(bruto);
  if (!Number.isFinite(n)) return null;
  return n;
}

/**
 * Descobre a extensão do arquivo (ex.: ".jpg") a partir do nome ou do tipo MIME.
 * @param {File} arquivo
 */
function extensaoDaFoto(arquivo) {
  const nome = typeof arquivo.name === "string" ? arquivo.name : "";
  const doNome = path.extname(nome).toLowerCase();
  if (doNome && EXTENSOES_OK.has(doNome)) return doNome;

  // Alguns celulares mandam sem extensão no name — tentamos pelo MIME.
  const tipo = (arquivo.type || "").toLowerCase();
  if (tipo === "image/jpeg") return ".jpg";
  if (tipo === "image/png") return ".png";
  if (tipo === "image/webp") return ".webp";
  if (tipo === "image/gif") return ".gif";

  return "";
}

/**
 * POST /api/denuncias
 *
 * Espera FormData com:
 *   - endereco  (texto) — obrigatório
 *   - descricao (texto) — obrigatório
 *   - lat       (texto número) — obrigatório
 *   - lng       (texto número) — obrigatório
 *   - foto      (arquivo) — obrigatório no MVP; pode repetir o campo (até 5)
 *
 * Sucesso (201):
 *   { ok: true, id: "482913", protocolo: "482913", denuncia: { ... } }
 */
export async function POST(request) {
  try {
    // formData() lê multipart/form-data (texto + arquivo na mesma requisição).
    const formData = await request.formData();

    const endereco = textoDoForm(formData, "endereco");
    const descricao = textoDoForm(formData, "descricao");
    const lat = lerCoordenada(textoDoForm(formData, "lat"));
    const lng = lerCoordenada(textoDoForm(formData, "lng"));

    // getAll permite várias fotos com o mesmo nome de campo "foto".
    /** @type {File[]} */
    const fotos = formData
      .getAll("foto")
      .filter((item) => item && typeof item !== "string");

    // ----- validações (mensagens claras para quem está testando) -----
    if (!endereco) {
      return erroJson('Informe o endereço (campo "endereco").');
    }
    if (!descricao) {
      return erroJson('Informe a descrição (campo "descricao").');
    }
    if (lat === null) {
      return erroJson('Informe a latitude (campo "lat", número).');
    }
    if (lng === null) {
      return erroJson('Informe a longitude (campo "lng", número).');
    }

    if (fotos.length === 0) {
      return erroJson('Envie ao menos uma foto (campo "foto", arquivo de imagem).');
    }
    if (fotos.length > MAX_FOTOS) {
      return erroJson(`Envie no máximo ${MAX_FOTOS} fotos.`);
    }

    for (const foto of fotos) {
      if (typeof foto.size === "number" && foto.size <= 0) {
        return erroJson("Uma das fotos está vazia. Tire ou escolha outra imagem.");
      }
      if (typeof foto.size === "number" && foto.size < TAMANHO_MIN_BYTES) {
        return erroJson(
          "Uma das fotos é pequena demais ou inválida. Envie uma imagem real do problema.",
        );
      }
      if (typeof foto.size === "number" && foto.size > TAMANHO_MAX_BYTES) {
        return erroJson("Uma das fotos é grande demais (máximo 5 MB cada).");
      }
      if (!extensaoDaFoto(foto)) {
        return erroJson(
          "Formato de foto não aceito. Use JPG, PNG, WEBP ou GIF.",
        );
      }
    }

    // ----- salvar arquivos em public/uploads -----
    const pastaUploads = path.join(process.cwd(), "public", "uploads");
    await mkdir(pastaUploads, { recursive: true });

    const caminhos = [];
    for (const foto of fotos) {
      const extensao = extensaoDaFoto(foto);
      // Nome único: timestamp + uuid curto, para não sobrescrever outra foto.
      const nomeArquivo = `${Date.now()}-${randomUUID().slice(0, 12)}${extensao}`;
      const caminhoDisco = path.join(pastaUploads, nomeArquivo);
      const bytes = Buffer.from(await foto.arrayBuffer());
      await writeFile(caminhoDisco, bytes);
      caminhos.push(`/uploads/${nomeArquivo}`);
    }

    const fotoCampo = serializarFotos(caminhos);

    // ----- protocolo + gravação no SQLite -----
    const protocolo = await gerarProtocoloUnico();

    const denuncia = await prisma.denuncia.create({
      data: {
        id: protocolo,
        endereco,
        descricao,
        status: "PENDENTE",
        lat,
        lng,
        foto: fotoCampo,
      },
    });

    // 201 = “criado”. O FormularioDenuncia (passo 09) usa id/protocolo na URL de sucesso.
    return NextResponse.json(
      {
        ok: true,
        id: denuncia.id,
        protocolo: denuncia.id,
        denuncia: denunciaParaJson(denuncia),
      },
      { status: 201 },
    );
  } catch (erro) {
    // Log no terminal do `npm run dev` ajuda o grupo a achar o problema.
    console.error("[POST /api/denuncias]", erro);

    const mensagem =
      erro instanceof Error ? erro.message : "Erro ao criar a denúncia.";

    // Erro de protocolo único (quase nunca) ou falha de disco/banco.
    if (mensagem.includes("protocolo único")) {
      return erroJson(mensagem, 503);
    }

    return erroJson(
      "Não foi possível salvar a denúncia. Tente de novo em instantes.",
      500,
    );
  }
}
