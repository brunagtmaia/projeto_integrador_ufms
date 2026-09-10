"use client";

// =============================================================================
// TELA /acompanhar — consulta o status só pelo número do protocolo (mock)
// =============================================================================
// Estados previstos no guia docs/10-checkout2-frontend-telas.md:
//   vazio → carregando → encontrado OU não encontrado
//
// Dados: lib/denuncias-exemplo.js (sem banco ainda).
// Se a URL vier com ?protocolo=748393 (ex.: vindo do sucesso), o campo
// já começa preenchido — a pessoa só clica em Buscar.
//
// "use client" porque usamos useState + useSearchParams + clique.
// =============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icone from "../Icone";
import { buscarDenunciaPorProtocolo } from "../../lib/denuncias-exemplo";

// Tempo curto só para a UI de “Buscando…” aparecer (não é API de verdade).
const ATRASO_MOCK_MS = 500;

export default function TelaAcompanhar() {
  const busca = useSearchParams();
  const protocoloNaUrl = busca.get("protocolo") || "";

  // O que a pessoa digita no campo.
  const [protocolo, setProtocolo] = useState(protocoloNaUrl);

  // null = ainda não buscou | "carregando" | "encontrado" | "nao_encontrado"
  const [estado, setEstado] = useState(null);

  // Denúncia achada no mock (só quando estado === "encontrado").
  const [denuncia, setDenuncia] = useState(null);

  // Se a URL mudar (ex.: veio do sucesso com outro protocolo), atualiza o campo.
  useEffect(() => {
    if (protocoloNaUrl) {
      setProtocolo(protocoloNaUrl);
    }
  }, [protocoloNaUrl]);

  function buscar(evento) {
    // Evita o formulário recarregar a página.
    evento.preventDefault();

    const limpo = protocolo.trim();
    if (!limpo) {
      setEstado(null);
      setDenuncia(null);
      return;
    }

    setEstado("carregando");
    setDenuncia(null);

    // Simula “espera da API”. No check-out 3 vira fetch de verdade.
    setTimeout(() => {
      const achada = buscarDenunciaPorProtocolo(limpo);
      if (achada) {
        setDenuncia(achada);
        setEstado("encontrado");
      } else {
        setDenuncia(null);
        setEstado("nao_encontrado");
      }
    }, ATRASO_MOCK_MS);
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
            placeholder="Ex.: 748393"
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

            <Link
              href="/mapa"
              className="btn-contorno w-full !justify-start px-5 py-3"
            >
              <Icone nome="map" />
              Ver no mapa
            </Link>
          </section>
        ) : null}

        {/* Estado: não encontrado */}
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
              Confira se digitou certo. No check-out 2 só existem os números de
              exemplo (ex.: 748393, 748401, 748410).
            </p>
          </section>
        ) : null}

        <p className="body-text text-center text-sm opacity-80">
          Check-out 2: a busca usa a lista de exemplo. No check-out 3 virá da
          API/banco.
        </p>
      </main>
    </div>
  );
}
