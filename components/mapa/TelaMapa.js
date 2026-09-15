"use client";

// =============================================================================
// TELA /mapa — mapa + lista (dados reais do banco)
// =============================================================================
// Check-out 3 · passo 11:
//   Antes (check-out 2): lista vinha de lib/denuncias-exemplo.js (mock).
//   Agora: chama GET /api/denuncias (sem ?protocolo=) → array "denuncias".
//
// O menu lateral NÃO está aqui: ele vive em app/layout.js (todas as páginas).
// Esta tela só desenha: (1) o mapa OSM  (2) a lista “Casos registrados”.
//
// Layout:
//   Celular  → coluna: mapa em cima, lista embaixo (flex-col)
//   Desktop  → linha:  mapa à esquerda, lista à direita (lg:flex-row)
//
// "use client" porque temos useState / useEffect (filtro, fetch, mapa).
//
// dynamic(..., { ssr: false }) = NÃO renderiza o Leaflet no servidor.
// Sem isso o Next tenta montar o mapa no Node e quebra (não existe window).
//
// Guia: docs/11-checkout3-banco-backend.md
// =============================================================================

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Icone from "../Icone";
import { CENTRO_MAPA } from "../../lib/denuncias-exemplo";

const MapaLeaflet = dynamic(() => import("./MapaLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center body-text">
      Carregando mapa…
    </div>
  ),
});

// Ordem do botão Filtrar: a cada clique vai para o próximo e volta ao início.
const FILTROS = ["TODOS", "PENDENTE", "RESOLVIDO"];

function rotuloFiltro(filtro) {
  if (filtro === "PENDENTE") return "Pendentes";
  if (filtro === "RESOLVIDO") return "Resolvidos";
  return "Todos";
}

export default function TelaMapa() {
  // Lista completa vinda da API (antes do filtro de status).
  const [denuncias, setDenuncias] = useState([]);

  // null = ainda carregando a 1ª vez
  // "ok" | "erro"
  const [estadoCarga, setEstadoCarga] = useState(null);
  const [mensagemErro, setMensagemErro] = useState("");

  // Qual fatia da lista mostrar no mapa e nos cartões.
  const [filtro, setFiltro] = useState("TODOS");

  // Qual cartão está “ativo” (anel verde). null = nenhum.
  const [idSelecionado, setIdSelecionado] = useState(null);

  // Truque: o mapa não recebe um boolean “centralizar”, recebe um NÚMERO.
  // Cada clique soma 1. O useEffect no Leaflet vê a mudança e chama fitBounds
  // de novo (mesmo que a lista seja a mesma). Começa em 1 para já enquadrar
  // na primeira carga.
  const [disparoCentralizar, setDisparoCentralizar] = useState(1);

  /**
   * Busca TODAS as denúncias no banco (passo 07 da API).
   * Sem ?protocolo= → a resposta traz { ok, denuncias: [ ... ] }.
   * Usada ao abrir a tela e no botão “Tentar de novo”.
   */
  async function carregarDenuncias() {
    setEstadoCarga(null);
    setMensagemErro("");

    try {
      const resposta = await fetch("/api/denuncias");

      let dados = null;
      try {
        dados = await resposta.json();
      } catch {
        dados = null;
      }

      if (!resposta.ok || !dados?.ok || !Array.isArray(dados.denuncias)) {
        setDenuncias([]);
        setMensagemErro(
          dados?.erro ||
            "Não foi possível carregar o mapa. Tente de novo.",
        );
        setEstadoCarga("erro");
        return;
      }

      setDenuncias(dados.denuncias);
      setEstadoCarga("ok");
      // Reenquadra os pontos quando a lista chega do servidor.
      setDisparoCentralizar((n) => n + 1);
    } catch {
      setDenuncias([]);
      setMensagemErro(
        "Falha de rede. Tente novamente em instantes.",
      );
      setEstadoCarga("erro");
    }
  }

  // Ao abrir a tela: busca a lista uma vez.
  // (Não colocamos carregarDenuncias nas deps de propósito — só queremos
  //  rodar na montagem; o botão “Tentar de novo” chama a função de novo.)
  useEffect(() => {
    carregarDenuncias();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só na montagem
  }, []);

  // useMemo: só recalcula a lista se o filtro OU os dados da API mudarem.
  const lista = useMemo(() => {
    if (filtro === "TODOS") return denuncias;
    return denuncias.filter((d) => d.status === filtro);
  }, [filtro, denuncias]);

  const qtdPendentes = denuncias.filter((d) => d.status === "PENDENTE").length;

  // ?? null = se o id não estiver na lista filtrada, não foca ponto nenhum.
  const selecionada = lista.find((d) => d.id === idSelecionado) ?? null;

  const carregando = estadoCarga === null;
  const comErro = estadoCarga === "erro";

  function proximoFiltro() {
    const i = FILTROS.indexOf(filtro);
    // % = resto da divisão. Chegou no último? volta para 0 (TODOS).
    setFiltro(FILTROS[(i + 1) % FILTROS.length]);
    setIdSelecionado(null);
  }

  function centralizarDenuncias() {
    setIdSelecionado(null);
    setDisparoCentralizar((n) => n + 1);
  }

  return (
    // lg: = a partir de 1024px de largura. 100svh = altura visível da janela.
    // 4.5rem ≈ altura da faixa do menu no topo.
    <div className="flex w-full flex-1 flex-col lg:h-[calc(100svh-4.5rem)] lg:min-h-[28rem] lg:flex-row">
      {/* mapa-area: altura definida em globals.css (celular vs desktop). */}
      <section className="mapa-area relative w-full shrink-0 overflow-hidden bg-[var(--neutral-borda)] lg:flex-1">
        <MapaLeaflet
          denuncias={lista}
          selecionada={selecionada}
          centro={CENTRO_MAPA}
          disparoCentralizar={disparoCentralizar}
        />

        {/* pointer-events-none: o selo não bloqueia o arrastar do mapa. */}
        <p className="pointer-events-none absolute bottom-10 left-3 z-[5] flex max-w-[calc(100%-5.5rem)] items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-secondary shadow-[var(--sombra)] sm:text-sm">
          <Icone nome="location_on" className="!text-lg text-primary" />
          {carregando ? "…" : `${qtdPendentes} Pendentes`}
        </p>

        {/* Em tela estreita o texto some (hidden sm:inline); fica só o ícone. */}
        <button
          type="button"
          onClick={centralizarDenuncias}
          className="absolute top-3 right-3 z-[5] flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white shadow-[var(--sombra)] sm:text-sm"
          aria-label="Centralizar denúncias no mapa"
        >
          <Icone nome="center_focus_strong" className="!text-xl" />
          <span className="hidden sm:inline">Centralizar</span>
        </button>
      </section>

      <section className="flex min-h-0 flex-1 flex-col bg-[var(--neutral)] px-4 pt-5 pb-8 sm:px-6 lg:w-[min(100%,26rem)] lg:shrink-0 lg:overflow-y-auto xl:w-[32rem]">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label-text mb-1 uppercase text-primary">Mapa</p>
            <h1 className="text-xl font-bold tracking-tight text-secondary sm:text-2xl">
              Casos registrados
            </h1>
          </div>
          <button
            type="button"
            onClick={proximoFiltro}
            className="btn-contorno !px-3 !py-2 text-sm"
            disabled={carregando || comErro}
          >
            <Icone nome="filter_list" className="!text-xl" />
            {rotuloFiltro(filtro)}
          </button>
        </div>

        {carregando ? (
          <div className="cartao px-5 py-8 text-center" role="status">
            <p className="body-text">Carregando denúncias…</p>
          </div>
        ) : comErro ? (
          <div className="cartao px-5 py-8 text-center" role="alert">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-900">
              <Icone nome="wifi_off" className="!text-3xl" />
            </span>
            <h2 className="text-lg font-semibold text-secondary">
              Não deu para carregar
            </h2>
            <p className="body-text mt-2">{mensagemErro}</p>
            <button
              type="button"
              onClick={carregarDenuncias}
              className="btn-primario mt-4 !px-4 !py-2 text-sm"
            >
              Tentar de novo
            </button>
          </div>
        ) : lista.length === 0 ? (
          <div
            className="cartao border-dashed px-5 py-8 text-center"
            role="status"
          >
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--neutral-borda)] text-secondary">
              <Icone
                nome={denuncias.length === 0 ? "map" : "filter_list_off"}
                className="!text-3xl"
              />
            </span>
            <h2 className="text-lg font-semibold text-secondary">
              {denuncias.length === 0
                ? "Nenhuma denúncia registrada"
                : "Nenhum caso neste filtro"}
            </h2>
            <p className="body-text mt-2">
              {denuncias.length === 0
                ? "Crie uma em Nova denúncia — depois ela aparece aqui com o pin no mapa."
                : "Toque em Filtrar para ver Todos, Pendentes ou Resolvidos."}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3" aria-label="Lista de denúncias">
            {lista.map((caso) => {
              const resolvido = caso.status === "RESOLVIDO";
              const ativo = caso.id === idSelecionado;
              return (
                <li key={caso.id}>
                  {/* Clicar no cartão = selecionar + voar até o marcador. */}
                  <button
                    type="button"
                    onClick={() => setIdSelecionado(caso.id)}
                    className={`cartao flex w-full items-center gap-3 px-4 py-4 text-left transition ${
                      resolvido ? "bg-[var(--neutral)]" : "bg-white"
                    } ${ativo ? "ring-2 ring-primary" : ""}`}
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 ${
                        resolvido ? "bg-[var(--neutral-borda)]" : "bg-tertiary"
                      }`}
                    >
                      <Icone
                        nome={resolvido ? "check_circle" : "image"}
                        className={
                          resolvido ? "text-secondary" : "text-primary"
                        }
                      />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate font-semibold text-secondary ${
                          resolvido ? "line-through opacity-70" : ""
                        }`}
                      >
                        {caso.endereco}
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-[var(--texto-suave)]">
                        {caso.descricao}
                      </span>
                      <span className="mt-2 flex flex-wrap items-center gap-2">
                        {/* Mesmos selos de /acompanhar e /prefeitura */}
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            resolvido
                              ? "bg-tertiary text-primary"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {resolvido ? "Resolvido" : "Pendente"}
                        </span>
                        <span className="label-text text-[var(--texto-suave)]">
                          #{caso.id}
                        </span>
                      </span>
                    </span>

                    {/* Quadradinho visual (só aparência — marcar resolvido é na /prefeitura). */}
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 ${
                        resolvido
                          ? "border-secondary bg-secondary text-white"
                          : "border-[var(--texto-suave)] bg-white"
                      }`}
                      aria-hidden="true"
                    >
                      {resolvido ? (
                        <Icone nome="check" className="!text-base text-white" />
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

      </section>
    </div>
  );
}
