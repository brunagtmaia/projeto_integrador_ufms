// =============================================================================
// API /api/geocode — busca de endereço e reverse (lat/lng → texto)
// =============================================================================
// Proxy para o Nominatim (OpenStreetMap), gratis e alinhado ao mapa Leaflet.
// O front NÃO chama o Nominatim direto: aqui no servidor enviamos User-Agent
// e limitamos a resposta ao que o formulário precisa.
//
// Uso:
//   GET /api/geocode?q=Av.+Paulista,+Sao+Paulo
//     → { ok: true, resultados: [ { label, lat, lng }, ... ] }
//
//   GET /api/geocode?lat=-23.56&lng=-46.65
//     → { ok: true, endereco: "…", lat, lng }
// =============================================================================

import { NextResponse } from "next/server";

/** Identificação exigida pela política de uso do Nominatim. */
const USER_AGENT =
  "DenunciasUFMS/0.1 (projeto integrador; contato: projeto-local)";

const NOMINATIM = "https://nominatim.openstreetmap.org";

/**
 * @param {string} mensagem
 * @param {number} status
 */
function erroJson(mensagem, status = 400) {
  return NextResponse.json({ ok: false, erro: mensagem }, { status });
}

/**
 * Monta um texto legível a partir do JSON do Nominatim.
 * @param {Record<string, unknown>} item
 */
function rotuloDoItem(item) {
  if (typeof item.display_name === "string" && item.display_name.trim()) {
    return item.display_name.trim();
  }
  return "Endereço sem nome";
}

/**
 * @param {Request} request
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const latBruto = searchParams.get("lat");
    const lngBruto = searchParams.get("lng");

    const headers = {
      Accept: "application/json",
      "User-Agent": USER_AGENT,
    };

    // --- Reverse: GPS → endereço ---
    if (latBruto != null && lngBruto != null) {
      const lat = Number(latBruto);
      const lng = Number(lngBruto);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return erroJson("Latitude e longitude precisam ser números válidos.");
      }
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return erroJson("Coordenadas fora do intervalo válido.");
      }

      const url = new URL(`${NOMINATIM}/reverse`);
      url.searchParams.set("lat", String(lat));
      url.searchParams.set("lon", String(lng));
      url.searchParams.set("format", "json");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("accept-language", "pt-BR");

      const resposta = await fetch(url, {
        headers,
        // Nominatim pede no máximo ~1 req/s; timeout evita pendurar o form.
        signal: AbortSignal.timeout(10000),
      });

      if (!resposta.ok) {
        return erroJson(
          "Não foi possível obter o endereço a partir do GPS.",
          502,
        );
      }

      const dados = await resposta.json();
      const endereco = rotuloDoItem(dados);

      return NextResponse.json({
        ok: true,
        endereco,
        lat,
        lng,
      });
    }

    // --- Busca / autocomplete: texto → sugestões ---
    if (!q) {
      return erroJson(
        'Informe q (busca) ou lat e lng (reverse). Ex.: /api/geocode?q=Paulista',
      );
    }

    if (q.length < 3) {
      return erroJson("Digite pelo menos 3 caracteres para buscar.");
    }

    const url = new URL(`${NOMINATIM}/search`);
    url.searchParams.set("q", q);
    url.searchParams.set("format", "json");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "5");
    url.searchParams.set("countrycodes", "br");
    url.searchParams.set("accept-language", "pt-BR");

    const resposta = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (!resposta.ok) {
      return erroJson("Não foi possível buscar endereços agora.", 502);
    }

    /** @type {Array<Record<string, unknown>>} */
    const lista = await resposta.json();

    const resultados = lista
      .map((item) => {
        const lat = Number(item.lat);
        const lng = Number(item.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return {
          label: rotuloDoItem(item),
          lat,
          lng,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ ok: true, resultados });
  } catch (erro) {
    console.error("[GET /api/geocode]", erro);
    return erroJson(
      "Falha ao consultar o serviço de endereços. Tente de novo.",
      500,
    );
  }
}
