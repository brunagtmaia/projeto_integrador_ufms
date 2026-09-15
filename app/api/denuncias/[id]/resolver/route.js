// =============================================================================
// API PATCH /api/denuncias/[id]/resolver — marcar como RESOLVIDO
// =============================================================================
// O que é este arquivo?
//   No App Router, a pasta [id] é um pedaço DINÂMICO da URL.
//   Ex.: /api/denuncias/125172/resolver  →  id = "125172"
//
// Check-out 3 · passo 08:
//   A prefeitura manda a senha do .env (ADMIN_PASSWORD). Se estiver certa,
//   o status da denúncia vira "RESOLVIDO" no SQLite (de verdade, não só na tela).
//
// Método:
//   PATCH — “atualiza só uma parte” do registro (o status).
//
// Quem chama?
//   A tela /prefeitura (passo 12) — ao entrar (teste de senha) e ao
//   clicar em “Marcar como resolvido”. Também dá para testar com curl.
//
// Guia: docs/11-checkout3-banco-backend.md (seção do passo 08)
// =============================================================================

import { NextResponse } from "next/server";

import {
  fotoPrincipal,
  listarFotos,
} from "@/lib/fotos-denuncia";
import { prisma } from "@/lib/prisma";

/**
 * Resposta JSON de erro, com mensagem em português.
 * @param {string} mensagem
 * @param {number} status
 */
function erroJson(mensagem, status = 400) {
  return NextResponse.json({ ok: false, erro: mensagem }, { status });
}

/**
 * Objeto “limpo” para o front (mesmos nomes do mock e das outras APIs).
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
    foto: fotoPrincipal(denuncia.foto),
    fotos,
    createdAt: denuncia.createdAt,
    updatedAt: denuncia.updatedAt,
  };
}

/**
 * Lê o corpo JSON e devolve o objeto, ou null se não for JSON válido.
 * @param {Request} request
 * @returns {Promise<Record<string, unknown> | null>}
 */
async function lerJson(request) {
  try {
    const corpo = await request.json();
    if (!corpo || typeof corpo !== "object") return null;
    return /** @type {Record<string, unknown>} */ (corpo);
  } catch {
    return null;
  }
}

/**
 * PATCH /api/denuncias/[id]/resolver
 *
 * Corpo JSON:
 *   { "senha": "valor-do-ADMIN_PASSWORD" }
 *
 * Sucesso (200):
 *   { ok: true, denuncia: { ..., status: "RESOLVIDO" } }
 *
 * Erros comuns:
 *   400 — faltou senha ou JSON inválido
 *   401 — senha errada
 *   404 — protocolo (id) não existe
 *   500 — ADMIN_PASSWORD não configurado no .env / falha no banco
 *
 * @param {Request} request
 * @param {{ params: Promise<{ id: string }> }} context
 */
export async function PATCH(request, context) {
  try {
    // No Next.js 16, params é uma Promise — precisa de await.
    const { id: idBruto } = await context.params;
    const id = String(idBruto || "").trim();

    if (!id) {
      return erroJson(
        "Informe o protocolo na URL (ex.: /api/denuncias/125172/resolver).",
      );
    }

    const corpo = await lerJson(request);
    if (!corpo) {
      return erroJson(
        'Envie JSON com a senha (ex.: { "senha": "sua-senha" }).',
      );
    }

    const senha =
      typeof corpo.senha === "string" ? corpo.senha.trim() : "";

    if (!senha) {
      return erroJson('Informe a senha (campo "senha").');
    }

    // Senha da prefeitura: só no .env (nunca no código do front).
    const senhaEsperada = process.env.ADMIN_PASSWORD;
    if (!senhaEsperada || !String(senhaEsperada).trim()) {
      console.error(
        "[PATCH /api/denuncias/[id]/resolver] ADMIN_PASSWORD não está no .env",
      );
      return erroJson(
        "Senha da prefeitura não está configurada no servidor.",
        500,
      );
    }

    if (senha !== String(senhaEsperada).trim()) {
      // 401 = “não autorizado” (senha errada). Não dizemos se o id existe.
      return erroJson("Senha incorreta.", 401);
    }

    // Confere se a denúncia existe antes de atualizar.
    const existente = await prisma.denuncia.findUnique({
      where: { id },
    });

    if (!existente) {
      return erroJson(
        "Não achamos nenhuma denúncia com esse protocolo.",
        404,
      );
    }

    // Já resolvida: devolvemos sucesso sem erro (idempotente).
    // Assim clicar duas vezes no botão não quebra a tela depois.
    if (existente.status === "RESOLVIDO") {
      return NextResponse.json({
        ok: true,
        denuncia: denunciaParaJson(existente),
        aviso: "Esta denúncia já estava marcada como resolvida.",
      });
    }

    // update = altera só os campos que passamos; updatedAt sobe sozinho.
    const denuncia = await prisma.denuncia.update({
      where: { id },
      data: { status: "RESOLVIDO" },
    });

    return NextResponse.json({
      ok: true,
      denuncia: denunciaParaJson(denuncia),
    });
  } catch (erro) {
    console.error("[PATCH /api/denuncias/[id]/resolver]", erro);
    return erroJson(
      "Não foi possível marcar a denúncia como resolvida. Tente de novo.",
      500,
    );
  }
}
