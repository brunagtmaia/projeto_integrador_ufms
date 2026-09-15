"use client";

// =============================================================================
// TELA /acompanhar — consulta o status só pelo número do protocolo (API real)
// =============================================================================
// Check-out 3 · passo 10:
//   Antes (check-out 2): buscava em lib/denuncias-exemplo.js (mock).
//   Agora: chama GET /api/denuncias?protocolo=... (banco SQLite via Prisma).
//
// Estados da UI (iguais ao guia do check-out 2):
//   vazio → carregando → encontrado | não encontrado | erro de rede
//
// Se a URL vier com ?protocolo=482913 (ex.: vindo da tela de sucesso),
// o campo já começa preenchido — a pessoa só clica em Buscar.
//
// "use client" porque usamos useState + useSearchParams + clique + fetch.
// Guia: docs/11-checkout3-banco-backend.md
// =============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icone from "../Icone";
import CarrosselFotos from "../CarrosselFotos";

export default function TelaAcompanhar() {
  const busca = useSearchParams();
  const protocoloNaUrl = busca.get("protocolo") || "";

  // O que a pessoa digita no campo.
  const [protocolo, setProtocolo] = useState(protocoloNaUrl);

  // null = ainda não buscou
  // "carregando" | "encontrado" | "nao_encontrado" | "erro"
  const [estado, setEstado] = useState(null);

  // Denúncia achada na API (só quando estado === "encontrado").
  const [denuncia, setDenuncia] = useState(null);

  // Mensagem amigável quando a rede / o servidor falha (estado === "erro").
  const [mensagemErro, setMensagemErro] = useState("");

  // Se a URL mudar (ex.: veio do sucesso com outro protocolo), atualiza o campo.
  useEffect(() => {
    if (protocoloNaUrl) {
      setProtocolo(protocoloNaUrl);
    }
  }, [protocoloNaUrl]);

  /**
   * Chama a API de verdade (passo 07 do check-out 3).
   * async = podemos usar await no fetch sem “travar” a tela.
   */
  async function buscar(evento) {
    // Evita o formulário recarregar a página.
    evento.preventDefault();

    const limpo = protocolo.trim();
    if (!limpo) {
      setEstado(null);
      setDenuncia(null);
      setMensagemErro("");
      return;
    }

    setEstado("carregando");
    setDenuncia(null);
    setMensagemErro("");

    try {
      // encodeURIComponent protege caracteres especiais na URL.
      const resposta = await fetch(
        `/api/denuncias?protocolo=${encodeURIComponent(limpo)}`,
      );

      // A API devolve JSON em sucesso e em erro (campo "erro" em português).
      let dados = null;
      try {
        dados = await resposta.json();
      } catch {
        dados = null;
      }

      // 404 = protocolo não existe neste banco (dev.db desta máquina).
      if (resposta.status === 404) {
        setDenuncia(null);
        setEstado("nao_encontrado");
        return;
      }

      if (!resposta.ok || !dados?.ok || !dados?.denuncia) {
        setDenuncia(null);
        setMensagemErro(
          dados?.erro ||
            "Não foi possível consultar o protocolo. Tente de novo.",
        );
        setEstado("erro");
        return;
      }

      // Sucesso: mesmos campos do mock (id, endereco, descricao, status…).
      setDenuncia(dados.denuncia);
      setEstado("encontrado");
    } catch {
      // fetch falhou (servidor parado, sem rede, etc.).
      setDenuncia(null);
      setMensagemErro(
        "Falha de rede ao buscar. Tente novamente em instantes.",
      );
      setEstado("erro");
    }
  }

  const statusPendente = denuncia?.status === "PENDENTE";

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10 md:py-12">
      <main className="flex w-full max-w-md flex-col gap-6 md:max-w-lg lg:max-w-xl">
        <Link href="/" className="btn-contorno w-fit px-4 py-2 text-sm">
          <Icone nome="arrow_back" className="!text-xl" />
          Voltar à Home
        </Link>

        <header className="cartao px-5 py-6">
          <p className="label-text mb-2 uppercase text-primary">Consulta</p>
          <h1 className="headline">Acompanhar denúncia</h1>
          <p className="body-text mt-2">
            Digite o número do protocolo. Não precisa de login — só o protocolo.
          </p>
        </header>

        <form onSubmit={buscar} className="cartao flex flex-col gap-4 px-5 py-6">
          <label htmlFor="campo-protocolo" className="label-text text-secondary">
            Número do protocolo
          </label>
          <input
            id="campo-protocolo"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Ex.: 482913"
            value={protocolo}
            onChange={(e) => setProtocolo(e.target.value)}
            className="w-full rounded-[var(--raio)] border border-[var(--neutral-borda)] bg-white px-4 py-3 text-base text-secondary outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="btn-primario w-full"
            disabled={estado === "carregando"}
          >
            <Icone nome="search" />
            {estado === "carregando" ? "Buscando…" : "Buscar"}
          </button>
        </form>

        {/* Estado: carregando */}
        {estado === "carregando" ? (
          <p className="cartao px-5 py-6 text-center body-text" role="status">
            Buscando protocolo…
          </p>
        ) : null}

        {/* Estado: encontrado */}
        {estado === "encontrado" && denuncia ? (
          <section
            className="cartao flex flex-col gap-4 px-5 py-6"
            aria-label="Resultado da consulta"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="label-text mb-1">Protocolo</p>
                <p className="text-xl font-semibold text-primary">{denuncia.id}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  statusPendente
                    ? "bg-amber-100 text-amber-900"
                    : "bg-tertiary text-primary"
                }`}
              >
                {statusPendente ? "Pendente" : "Resolvido"}
              </span>
            </div>

            <div>
              <p className="label-text mb-1">Endereço</p>
              <p className="font-medium text-secondary">{denuncia.endereco}</p>
            </div>

            <div>
              <p className="label-text mb-1">Descrição</p>
              <p className="body-text">{denuncia.descricao}</p>
            </div>

            {/* Foto(s): a API devolve `foto` (principal) e `fotos` (lista). */}
            {(denuncia.fotos?.length > 0 || denuncia.foto) ? (
              <div>
                <p className="label-text mb-2">
                  {denuncia.fotos?.length > 1 ? "Fotos" : "Foto"}
                </p>
                <CarrosselFotos
                  fotos={
                    denuncia.fotos?.length
                      ? denuncia.fotos
                      : [denuncia.foto]
                  }
                  altBase={`Denúncia ${denuncia.id}`}
                />
              </div>
            ) : null}

            <Link
              href="/mapa"
              className="btn-contorno w-full !justify-start px-5 py-3"
            >
              <Icone nome="map" />
              Ver no mapa
            </Link>
          </section>
        ) : null}

        {/* Estado: não encontrado (404 da API) */}
        {estado === "nao_encontrado" ? (
          <section
            className="cartao border-dashed px-5 py-6 text-center"
            role="status"
          >
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--neutral-borda)] text-secondary">
              <Icone nome="search_off" className="!text-3xl" />
            </span>
            <h2 className="text-lg font-semibold text-secondary">
              Não achamos esse protocolo
            </h2>
            <p className="body-text mt-2">
              Confira se digitou o número corretamente. Se acabou de registrar
              uma denúncia, use o protocolo mostrado na tela de sucesso.
            </p>
          </section>
        ) : null}

        {/* Estado: erro de rede / servidor */}
        {estado === "erro" ? (
          <section
            className="cartao border-dashed px-5 py-6 text-center"
            role="alert"
          >
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-900">
              <Icone nome="wifi_off" className="!text-3xl" />
            </span>
            <h2 className="text-lg font-semibold text-secondary">
              Não foi possível consultar
            </h2>
            <p className="body-text mt-2">{mensagemErro}</p>
          </section>
        ) : null}

      </main>
    </div>
  );
}
