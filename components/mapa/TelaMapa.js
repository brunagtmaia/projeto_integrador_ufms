"use client";

// =============================================================================
// TELA /mapa — mapa + lista (front), RESPONSIVA
// =============================================================================
// O menu lateral NÃO está aqui: ele vive em app/layout.js (todas as páginas).
// Esta tela só desenha: (1) o mapa OSM  (2) a lista “Casos registrados”.
//
// Layout:
//   Celular  → coluna: mapa em cima, lista embaixo (flex-col)
//   Desktop  → linha:  mapa à esquerda, lista à direita (lg:flex-row)
//
// "use client" porque temos useState (filtro, cartão clicado, centralizar).
//
// dynamic(..., { ssr: false }) = NÃO renderiza o Leaflet no servidor.
// Sem isso o Next tenta montar o mapa no Node e quebra (não existe window).
// =============================================================================

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Icone from "../Icone";
import { CENTRO_MAPA, DENUNCIAS_EXEMPLO } from "../../lib/denuncias-exemplo";

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
  // Qual fatia da lista mostrar no mapa e nos cartões.
  const [filtro, setFiltro] = useState("TODOS");

  // Qual cartão está “ativo” (anel verde). null = nenhum.
  const [idSelecionado, setIdSelecionado] = useState(null);

  // Truque: o mapa não recebe um boolean “centralizar”, recebe um NÚMERO.
  // Cada clique soma 1. O useEffect no Leaflet vê a mudança e chama fitBounds
  // de novo (mesmo que a lista seja a mesma). Começa em 1 para já enquadrar
  // na primeira carga.
  const [disparoCentralizar, setDisparoCentralizar] = useState(1);

  // useMemo: só recalcula a lista se o filtro mudar (não a cada clique no mapa).
  const lista = useMemo(() => {
    if (filtro === "TODOS") return DENUNCIAS_EXEMPLO;
    return DENUNCIAS_EXEMPLO.filter((d) => d.status === filtro);
  }, [filtro]);

  const qtdPendentes = DENUNCIAS_EXEMPLO.filter((d) => d.status === "PENDENTE")
    .length;

  // ?? null = se o id não estiver na lista filtrada, não foca ponto nenhum.
  const selecionada = lista.find((d) => d.id === idSelecionado) ?? null;

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
        <p className="pointer-events-none absolute bottom-10 left-3 z-[5] flex max-w-[calc(100%-5.5rem)] items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-secondary shadow-[0_8px_16px_rgb(27_38_59_/_12%)] sm:text-sm">
          <Icone nome="location_on" className="!text-lg text-primary" />
          {qtdPendentes} Pendentes
        </p>

        {/* Em tela estreita o texto some (hidden sm:inline); fica só o ícone. */}
        <button
          type="button"
          onClick={centralizarDenuncias}
          className="absolute top-3 right-3 z-[5] flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_16px_rgb(27_38_59_/_18%)] sm:text-sm"
          aria-label="Centralizar denúncias no mapa"
        >
          <Icone nome="center_focus_strong" className="!text-xl" />
          <span className="hidden sm:inline">Centralizar</span>
        </button>
      </section>

      <section className="flex min-h-0 flex-1 flex-col bg-white px-4 pt-4 pb-8 lg:w-[min(100%,24rem)] lg:shrink-0 lg:overflow-y-auto xl:w-[28rem]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-base font-bold text-secondary sm:text-lg">
            Casos registrados
          </h1>
          <button
            type="button"
            onClick={proximoFiltro}
            className="flex items-center gap-1 text-sm font-medium text-primary"
          >
            <Icone nome="filter_list" className="!text-xl" />
            Filtrar · {rotuloFiltro(filtro)}
          </button>
        </div>

        <ul className="flex flex-col gap-3">
          {lista.map((caso) => {
            const resolvido = caso.status === "RESOLVIDO";
            const ativo = caso.id === idSelecionado;
            return (
              <li key={caso.id}>
                {/* Clicar no cartão = selecionar + voar até o marcador. */}
                <button
                  type="button"
                  onClick={() => setIdSelecionado(caso.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left ${
                    resolvido
                      ? "border-[var(--neutral-borda)] bg-[var(--neutral)]"
                      : "border-[var(--neutral-borda)] bg-white"
                  } ${ativo ? "ring-2 ring-primary" : ""}`}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg sm:h-14 sm:w-14 ${
                      resolvido ? "bg-[var(--neutral-borda)]" : "bg-tertiary"
                    }`}
                  >
                    <Icone
                      nome={resolvido ? "check_circle" : "image"}
                      className={resolvido ? "text-secondary" : "text-primary"}
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
                    <span className="mt-1 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wide ${
                          resolvido
                            ? "bg-[#d6eaf8] text-[#1a5276]"
                            : "bg-[#fadbd8] text-[#922b21]"
                        }`}
                      >
                        {caso.status}
                      </span>
                      <span className="text-xs text-[var(--texto-suave)]">
                        #{caso.id}
                      </span>
                    </span>
                  </span>

                  {/* Quadradinho do mockup. NÃO grava no servidor. */}
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
      </section>
    </div>
  );
}
