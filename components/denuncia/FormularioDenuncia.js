"use client";

// =============================================================================
// FORMULÁRIO /denuncia — envia dados reais para POST /api/denuncias
// =============================================================================
// Check-out 3 · passo 09
//
// Por que "use client"?
//   Precisamos de useState (o que a pessoa digitou), clique, arquivo e
//   fetch. Isso só roda no navegador. A página app/denuncia/page.js
//   continua no servidor (só importa este componente + metadata).
//
// O que este formulário faz:
//   1) Coleta endereco, descricao, lat, lng e fotos
//      (lat/lng vêm do GPS ou da sugestão de endereço — sem digitar números)
//   2) Monta um FormData (texto + arquivos na mesma requisição)
//   3) Chama POST /api/denuncias
//   4) Se der certo → vai para /denuncia/sucesso?protocolo=NUMERO_REAL
//
// Localização: botão GPS + autocomplete via GET /api/geocode (Nominatim).
// Visual: mesmas classes CSS do check-out 2 (não redesenhar o layout).
// Guia: docs/11-checkout3-banco-backend.md (seção do passo 09)
// =============================================================================

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Icone from "../Icone";

/** Quantidade máxima de fotos no formulário (igual à API). */
const MAX_FOTOS = 5;

/** Espera após digitar antes de buscar sugestões (Nominatim ~1 req/s). */
const DEBOUNCE_BUSCA_MS = 400;

/**
 * @typedef {{ id: string, arquivo: File, preview: string }} FotoItem
 * @typedef {{ label: string, lat: number, lng: number }} SugestaoEndereco
 */

export default function FormularioDenuncia() {
  const router = useRouter();
  const idBase = useId();

  // Referência ao <input type="file"> escondido — o botão “Adicionar foto”
  // só dispara um clique nele (mantém o visual do check-out 2).
  const inputFotoRef = useRef(null);
  const inputEnderecoRef = useRef(null);
  const debounceBuscaRef = useRef(/** @type {ReturnType<typeof setTimeout> | null} */ (null));
  const abortBuscaRef = useRef(/** @type {AbortController | null} */ (null));

  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");
  // lat/lng ficam internos — a pessoa não edita números; vêm do GPS ou da sugestão.
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  /** @type {[FotoItem[], Function]} */
  const [fotos, setFotos] = useState([]);
  const [indiceFoto, setIndiceFoto] = useState(0);

  // Mensagens para a pessoa (erro da API ou validação local).
  const [erro, setErro] = useState("");
  // true enquanto o fetch está andando — evita clicar Enviar duas vezes.
  const [enviando, setEnviando] = useState(false);
  const [avisoGps, setAvisoGps] = useState("");
  const [buscandoGps, setBuscandoGps] = useState(false);
  /** @type {[SugestaoEndereco[], Function]} */
  const [sugestoes, setSugestoes] = useState([]);
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [indiceSugestao, setIndiceSugestao] = useState(-1);
  /** De onde vieram lat/lng: GPS (pode editar o texto) ou sugestão (texto amarrado). */
  const [origemCoords, setOrigemCoords] = useState(
    /** @type {null | "gps" | "sugestao"} */ (null),
  );
  const fotosRef = useRef(fotos);
  fotosRef.current = fotos;

  const temCoordenadas = Boolean(lat.trim() && lng.trim());

  // Libera as URLs de pré-visualização quando o componente sai da tela.
  useEffect(() => {
    return () => {
      fotosRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
      if (debounceBuscaRef.current) clearTimeout(debounceBuscaRef.current);
      abortBuscaRef.current?.abort();
    };
  }, []);

  function abrirSeletorDeFoto() {
    if (fotos.length >= MAX_FOTOS) {
      setErro(`Você já adicionou o máximo de ${MAX_FOTOS} fotos.`);
      return;
    }
    inputFotoRef.current?.click();
  }

  function aoEscolherFoto(evento) {
    const arquivos = Array.from(evento.target.files || []);
    // Permite escolher o mesmo arquivo de novo depois de remover.
    evento.target.value = "";

    if (arquivos.length === 0) return;

    const vagas = MAX_FOTOS - fotos.length;
    if (vagas <= 0) {
      setErro(`Você já adicionou o máximo de ${MAX_FOTOS} fotos.`);
      return;
    }

    const escolhidos = arquivos.slice(0, vagas);
    const novos = escolhidos.map((arquivo, i) => ({
      id: `${idBase}-${Date.now()}-${i}`,
      arquivo,
      preview: URL.createObjectURL(arquivo),
    }));

    setFotos((atuais) => {
      const proximas = [...atuais, ...novos];
      setIndiceFoto(proximas.length - 1);
      return proximas;
    });
    setErro("");

    if (arquivos.length > vagas) {
      setErro(
        `Só cabem ${MAX_FOTOS} fotos. As ${vagas} primeiras foram adicionadas.`,
      );
    }
  }

  function excluirFotoAtual() {
    setFotos((atuais) => {
      if (atuais.length === 0) return atuais;

      const removida = atuais[indiceFoto];
      if (removida) URL.revokeObjectURL(removida.preview);

      const proximas = atuais.filter((_, i) => i !== indiceFoto);
      const novoIndice =
        proximas.length === 0
          ? 0
          : Math.min(indiceFoto, proximas.length - 1);
      setIndiceFoto(novoIndice);
      return proximas;
    });
    setErro("");
  }

  function irParaFotoAnterior() {
    setIndiceFoto((atual) => (atual <= 0 ? fotos.length - 1 : atual - 1));
  }

  function irParaProximaFoto() {
    setIndiceFoto((atual) => (atual >= fotos.length - 1 ? 0 : atual + 1));
  }

  function limparSugestoes() {
    setSugestoes([]);
    setIndiceSugestao(-1);
  }

  /**
   * Aplica um endereço já resolvido (GPS reverse ou clique na sugestão).
   * @param {{ label: string, lat: number, lng: number }} lugar
   * @param {"gps" | "sugestao"} origem
   */
  function aplicarLocalizacao(lugar, origem) {
    setEndereco(lugar.label);
    setLat(String(lugar.lat));
    setLng(String(lugar.lng));
    setOrigemCoords(origem);
    limparSugestoes();
    setErro("");
  }

  /**
   * Busca sugestões em /api/geocode (proxy Nominatim).
   * @param {string} texto
   */
  async function buscarSugestoes(texto) {
    const consulta = texto.trim();
    if (consulta.length < 3) {
      limparSugestoes();
      setBuscandoEndereco(false);
      return;
    }

    abortBuscaRef.current?.abort();
    const abort = new AbortController();
    abortBuscaRef.current = abort;
    setBuscandoEndereco(true);

    try {
      const resposta = await fetch(
        `/api/geocode?q=${encodeURIComponent(consulta)}`,
        { signal: abort.signal },
      );
      const dados = await resposta.json().catch(() => null);

      if (abort.signal.aborted) return;

      if (!resposta.ok || !dados?.ok) {
        limparSugestoes();
        return;
      }

      setSugestoes(Array.isArray(dados.resultados) ? dados.resultados : []);
      setIndiceSugestao(-1);
    } catch (erro) {
      if (erro?.name === "AbortError") return;
      limparSugestoes();
    } finally {
      if (!abort.signal.aborted) setBuscandoEndereco(false);
    }
  }

  /**
   * Digitação no endereço. Se a coordenada veio de uma sugestão, ao editar
   * o texto ela é invalidada até escolher de novo. Se veio do GPS, mantém.
   * @param {string} valor
   */
  function aoDigitarEndereco(valor) {
    setEndereco(valor);
    setAvisoGps("");

    if (origemCoords !== "gps") {
      setLat("");
      setLng("");
      setOrigemCoords(null);
    }

    if (debounceBuscaRef.current) clearTimeout(debounceBuscaRef.current);

    if (valor.trim().length < 3) {
      limparSugestoes();
      setBuscandoEndereco(false);
      return;
    }

    debounceBuscaRef.current = setTimeout(() => {
      buscarSugestoes(valor);
    }, DEBOUNCE_BUSCA_MS);
  }

  /**
   * @param {SugestaoEndereco} sugestao
   */
  function escolherSugestao(sugestao) {
    aplicarLocalizacao(sugestao, "sugestao");
    setAvisoGps("Endereço selecionado. Confira se está certo antes de enviar.");
  }

  /**
   * Pede a localização ao navegador (GPS / Wi‑Fi) e preenche o endereço
   * com reverse geocode. Se falhar, pede para digitar o endereço.
   */
  function usarMinhaLocalizacao() {
    setAvisoGps("");
    limparSugestoes();

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setAvisoGps(
        "Este navegador não tem geolocalização. Digite o endereço abaixo.",
      );
      inputEnderecoRef.current?.focus();
      return;
    }

    setBuscandoGps(true);
    setAvisoGps("Buscando sua localização…");

    navigator.geolocation.getCurrentPosition(
      async (posicao) => {
        const latitude = posicao.coords.latitude;
        const longitude = posicao.coords.longitude;

        setLat(String(latitude));
        setLng(String(longitude));
        setOrigemCoords("gps");

        try {
          const resposta = await fetch(
            `/api/geocode?lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}`,
          );
          const dados = await resposta.json().catch(() => null);

          if (resposta.ok && dados?.ok && dados.endereco) {
            setEndereco(dados.endereco);
            setAvisoGps("Localização preenchida. Confira se está ok.");
          } else {
            setAvisoGps(
              "GPS ok, mas não achamos o nome da rua. Digite o endereço para completar.",
            );
            inputEnderecoRef.current?.focus();
          }
        } catch {
          setAvisoGps(
            "GPS ok, mas falhou a busca do endereço. Digite a rua abaixo.",
          );
          inputEnderecoRef.current?.focus();
        } finally {
          setBuscandoGps(false);
        }
      },
      () => {
        setBuscandoGps(false);
        setLat("");
        setLng("");
        setOrigemCoords(null);
        setAvisoGps(
          "Não foi possível obter o GPS. Digite o endereço abaixo e escolha uma sugestão.",
        );
        inputEnderecoRef.current?.focus();
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  /**
   * Teclado na lista de sugestões (setas + Enter + Escape).
   * @param {React.KeyboardEvent<HTMLInputElement>} evento
   */
  function aoTeclarEndereco(evento) {
    if (sugestoes.length === 0) return;

    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setIndiceSugestao((atual) =>
        atual >= sugestoes.length - 1 ? 0 : atual + 1,
      );
      return;
    }

    if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setIndiceSugestao((atual) =>
        atual <= 0 ? sugestoes.length - 1 : atual - 1,
      );
      return;
    }

    if (evento.key === "Enter" && indiceSugestao >= 0) {
      evento.preventDefault();
      escolherSugestao(sugestoes[indiceSugestao]);
      return;
    }

    if (evento.key === "Escape") {
      limparSugestoes();
    }
  }

  /**
   * Envia o formulário para a API.
   * @param {React.FormEvent} evento
   */
  async function aoEnviar(evento) {
    // Sem isso o navegador recarrega a página e perde o estado do React.
    evento.preventDefault();
    setErro("");

    const enderecoLimpo = endereco.trim();
    const descricaoLimpa = descricao.trim();

    // Validação rápida no front (a API também valida — cinto e suspenders).
    if (!enderecoLimpo) {
      setErro("Informe a localização (use o GPS ou digite o endereço).");
      return;
    }
    if (!descricaoLimpa) {
      setErro("Escreva uma descrição do problema.");
      return;
    }
    if (!lat.trim() || !lng.trim()) {
      setErro(
        "Escolha um endereço da lista de sugestões ou use “Usar minha localização”.",
      );
      return;
    }
    if (fotos.length === 0) {
      setErro("Anexe ao menos uma foto do problema.");
      return;
    }

    setEnviando(true);

    try {
      // FormData = o mesmo formato que o POST /api/denuncias espera
      // (campos com esses nomes exatos — ver app/api/denuncias/route.js).
      const formData = new FormData();
      formData.append("endereco", enderecoLimpo);
      formData.append("descricao", descricaoLimpa);
      formData.append("lat", lat.trim());
      formData.append("lng", lng.trim());
      fotos.forEach((item) => {
        formData.append("foto", item.arquivo);
      });

      const resposta = await fetch("/api/denuncias", {
        method: "POST",
        body: formData,
        // Não coloque Content-Type manual: o navegador monta o boundary
        // do multipart sozinho quando o body é FormData.
      });

      const dados = await resposta.json().catch(() => null);

      if (!resposta.ok || !dados?.ok) {
        setErro(
          dados?.erro ||
            "Não foi possível enviar a denúncia. Tente de novo.",
        );
        return;
      }

      // protocolo e id são o mesmo número (texto de 6 dígitos).
      const protocolo = dados.protocolo || dados.id;
      if (!protocolo) {
        setErro("A API não devolveu o protocolo. Avise o grupo.");
        return;
      }

      router.push(`/denuncia/sucesso?protocolo=${encodeURIComponent(protocolo)}`);
    } catch {
      setErro(
        "Falha de rede ao enviar. Tente novamente em instantes.",
      );
    } finally {
      setEnviando(false);
    }
  }

  const fotoAtual = fotos[indiceFoto] || null;
  const podeAdicionar = fotos.length < MAX_FOTOS;

  return (
    <>
      <main className="denuncia">
        <form className="denuncia-container" onSubmit={aoEnviar} noValidate>
          <h1>Realizar denúncia anônima</h1>

          <p className="subtitulo">
            Forneça os detalhes abaixo para registrar um problema na sua região.
          </p>

          <div className="progresso">
            <div className="progresso-atual"></div>
          </div>

          {/* Localização: GPS primeiro; senão digitar com autocomplete */}
          <label htmlFor="campo-endereco">Localização</label>

          <button
            type="button"
            className="botao-gps"
            onClick={usarMinhaLocalizacao}
            disabled={enviando || buscandoGps}
          >
            <Icone nome="my_location" className="!text-lg" />
            {buscandoGps ? "Buscando…" : "Usar minha localização"}
          </button>

          {avisoGps ? (
            <p className="aviso-gps" role="status">
              {avisoGps}
            </p>
          ) : null}

          <p className="dica-endereco">
            Ou digite o endereço e escolha uma das sugestões.
          </p>

          <div className="caixa-autocomplete">
            <div className="campo-localizacao">
              <span className="icone-localizacao" aria-hidden="true">
                ⌖
              </span>
              <input
                ref={inputEnderecoRef}
                id="campo-endereco"
                name="endereco"
                type="text"
                className="input-localizacao"
                placeholder="Rua, Bairro, Cidade..."
                value={endereco}
                onChange={(e) => aoDigitarEndereco(e.target.value)}
                onKeyDown={aoTeclarEndereco}
                disabled={enviando || buscandoGps}
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={sugestoes.length > 0}
                aria-controls={`${idBase}-sugestoes`}
                aria-activedescendant={
                  indiceSugestao >= 0
                    ? `${idBase}-sugestao-${indiceSugestao}`
                    : undefined
                }
              />
            </div>

            {buscandoEndereco ? (
              <p className="aviso-busca" role="status">
                Buscando endereços…
              </p>
            ) : null}

            {sugestoes.length > 0 ? (
              <ul
                id={`${idBase}-sugestoes`}
                className="lista-sugestoes"
                role="listbox"
                aria-label="Sugestões de endereço"
              >
                {sugestoes.map((item, i) => (
                  <li key={`${item.lat}-${item.lng}-${i}`} role="presentation">
                    <button
                      type="button"
                      id={`${idBase}-sugestao-${i}`}
                      role="option"
                      aria-selected={i === indiceSugestao}
                      className={`item-sugestao${
                        i === indiceSugestao ? " item-sugestao--ativa" : ""
                      }`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => escolherSugestao(item)}
                      disabled={enviando}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {temCoordenadas ? (
            <p className="status-localizacao" role="status">
              Localização pronta para o mapa.
            </p>
          ) : null}

          {/* Fotos — carrossel com pré-visualização + botão para adicionar */}
          <label>Adicionar Mídia</label>

          <input
            ref={inputFotoRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
            className="input-foto-escondido"
            onChange={aoEscolherFoto}
            disabled={enviando || !podeAdicionar}
            multiple
          />

          {fotos.length === 0 ? (
            <button
              type="button"
              className="botao-foto"
              onClick={abrirSeletorDeFoto}
              disabled={enviando}
              aria-label="Adicionar foto"
            >
              <Icone nome="add_a_photo" className="icone-camera" />
              <span>Adicionar foto</span>
            </button>
          ) : (
            <div className="carrossel-fotos">
              <div className="carrossel-janela">
                {fotos.length > 1 ? (
                  <button
                    type="button"
                    className="carrossel-nav carrossel-nav--antes"
                    onClick={irParaFotoAnterior}
                    disabled={enviando}
                    aria-label="Foto anterior"
                  >
                    <Icone nome="chevron_left" />
                  </button>
                ) : null}

                <div className="carrossel-slide">
                  <img
                    src={fotoAtual.preview}
                    alt={`Pré-visualização ${indiceFoto + 1} de ${fotos.length}`}
                    className="preview-foto"
                  />

                  <button
                    type="button"
                    className="botao-excluir-foto"
                    onClick={excluirFotoAtual}
                    disabled={enviando}
                    aria-label={`Excluir foto ${indiceFoto + 1}`}
                  >
                    <Icone nome="close" className="!text-lg" />
                  </button>
                </div>

                {fotos.length > 1 ? (
                  <button
                    type="button"
                    className="carrossel-nav carrossel-nav--depois"
                    onClick={irParaProximaFoto}
                    disabled={enviando}
                    aria-label="Próxima foto"
                  >
                    <Icone nome="chevron_right" />
                  </button>
                ) : null}
              </div>

              <div className="carrossel-rodape">
                <p className="carrossel-contador" role="status">
                  {indiceFoto + 1} / {fotos.length}
                </p>

                {fotos.length > 1 ? (
                  <div className="carrossel-bolinhas" aria-hidden="true">
                    {fotos.map((item, i) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`carrossel-bolinha${
                          i === indiceFoto ? " carrossel-bolinha--ativa" : ""
                        }`}
                        onClick={() => setIndiceFoto(i)}
                        disabled={enviando}
                        tabIndex={-1}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              {podeAdicionar ? (
                <button
                  type="button"
                  className="botao-adicionar-foto"
                  onClick={abrirSeletorDeFoto}
                  disabled={enviando}
                >
                  <Icone nome="add_a_photo" className="!text-xl" />
                  <span>Adicionar outra foto</span>
                </button>
              ) : null}
            </div>
          )}

          <small>
            Anexe fotos claras do problema (JPG, PNG, WEBP ou GIF; máx. 5 MB
            cada; até {MAX_FOTOS} fotos).
          </small>

          {/* Descrição */}
          <label htmlFor="campo-descricao">Descrição Adicional</label>

          <textarea
            id="campo-descricao"
            name="descricao"
            placeholder="Detalhes sobre o problema..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={enviando}
          />

          {erro ? (
            <p className="mensagem-erro" role="alert">
              {erro}
            </p>
          ) : null}

          {/* Enviar: mesmo visual do check-out 2; agora grava no banco */}
          <button
            type="submit"
            className="botao-enviar"
            disabled={enviando}
          >
            <span aria-hidden="true">▷</span>
            {enviando ? "Enviando…" : "Enviar Denúncia"}
          </button>
        </form>
      </main>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .denuncia {
          flex: 1;
          width: 100%;
          min-height: 100%;
          background: #f5f6f7;
          display: flex;
          justify-content: center;
          color: #222;
          font-family: var(--font-poppins), "Poppins", Arial, Helvetica, sans-serif;
          padding: 0;
        }

        .denuncia-container {
          width: 100%;
          max-width: 28rem;
          min-height: 100%;
          background: #fff;
          padding: 1.5rem 1.25rem 2rem;
        }

        .denuncia h1 {
          margin: 0;
          font-size: 1.35rem;
          line-height: 1.25;
          font-weight: 600;
          color: #222;
        }

        .subtitulo {
          margin: 0.5rem 0 1.25rem;
          max-width: 36rem;
          font-size: 0.9375rem;
          line-height: 1.5;
          color: #686868;
        }

        .progresso {
          width: 100%;
          height: 4px;
          background: #e5e5e5;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 1.25rem;
        }

        .progresso-atual {
          width: 51%;
          height: 100%;
          background: #075c3d;
          border-radius: 10px;
        }

        .denuncia label {
          display: block;
          margin-top: 1.15rem;
          margin-bottom: 0.4rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #777;
        }

        .campo-localizacao {
          width: 100%;
          min-height: 2.75rem;
          border: 1px solid #d7dcdc;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 0.85rem;
          font-size: 0.9375rem;
          color: #555;
          background: #fff;
        }

        .icone-localizacao {
          color: #075c3d;
          font-size: 1.25rem;
          line-height: 1;
          flex-shrink: 0;
        }

        .input-localizacao {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          font-family: inherit;
          font-size: inherit;
          color: #333;
          padding: 0.65rem 0;
        }

        .input-localizacao::placeholder {
          color: #555;
        }

        .dica-endereco {
          margin: 0.75rem 0 0.45rem;
          font-size: 0.75rem;
          line-height: 1.45;
          color: #888;
        }

        .botao-gps {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          border: 1px solid #075c3d;
          border-radius: 999px;
          background: #fff;
          color: #075c3d;
          font-family: inherit;
          font-size: 0.8125rem;
          font-weight: 600;
          padding: 0.55rem 1rem;
          cursor: pointer;
        }

        .botao-gps:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .aviso-gps,
        .aviso-busca {
          margin: 0.5rem 0 0;
          font-size: 0.75rem;
          color: #555;
        }

        .caixa-autocomplete {
          position: relative;
        }

        .lista-sugestoes {
          list-style: none;
          margin: 0.35rem 0 0;
          padding: 0.25rem 0;
          border: 1px solid #d7dcdc;
          border-radius: 8px;
          background: #fff;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          max-height: 14rem;
          overflow-y: auto;
        }

        .item-sugestao {
          display: block;
          width: 100%;
          border: none;
          background: transparent;
          text-align: left;
          font-family: inherit;
          font-size: 0.8125rem;
          line-height: 1.4;
          color: #333;
          padding: 0.65rem 0.85rem;
          cursor: pointer;
        }

        .item-sugestao:hover,
        .item-sugestao--ativa {
          background: #eef5f1;
          color: #075c3d;
        }

        .item-sugestao:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-localizacao {
          margin: 0.5rem 0 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: #075c3d;
        }

        .input-foto-escondido {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .botao-foto {
          position: relative;
          width: 7.5rem;
          height: 5.5rem;
          border: 1px dashed #cbd3d0;
          border-radius: 10px;
          background: #fff;
          color: #555;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          font-family: inherit;
          cursor: pointer;
          overflow: hidden;
          padding: 0.5rem;
        }

        .botao-foto:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .icone-camera {
          font-size: 1.5rem !important;
          line-height: 1;
          color: #075c3d;
        }

        .carrossel-fotos {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .carrossel-janela {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .carrossel-slide {
          position: relative;
          flex: 1;
          min-width: 0;
          height: 11rem;
          border: 1px solid #075c3d;
          border-radius: 10px;
          overflow: hidden;
          background: #f0f2f1;
        }

        .preview-foto {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .botao-excluir-foto {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          width: 2rem;
          height: 2rem;
          border: none;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.65);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
        }

        .botao-excluir-foto:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .carrossel-nav {
          flex-shrink: 0;
          width: 2rem;
          height: 2rem;
          border: 1px solid #d7dcdc;
          border-radius: 999px;
          background: #fff;
          color: #075c3d;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
        }

        .carrossel-nav:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .carrossel-rodape {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
        }

        .carrossel-contador {
          margin: 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: #075c3d;
        }

        .carrossel-bolinhas {
          display: flex;
          gap: 0.35rem;
          justify-content: center;
        }

        .carrossel-bolinha {
          width: 0.45rem;
          height: 0.45rem;
          border: none;
          border-radius: 999px;
          background: #c5d0cb;
          padding: 0;
          cursor: pointer;
        }

        .carrossel-bolinha--ativa {
          background: #075c3d;
          width: 0.85rem;
        }

        .botao-adicionar-foto {
          width: 100%;
          min-height: 2.5rem;
          border: 1px dashed #075c3d;
          border-radius: 10px;
          background: #f3f8f5;
          color: #075c3d;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-family: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem 0.75rem;
        }

        .botao-adicionar-foto:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .denuncia small {
          display: block;
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: #888;
        }

        .denuncia textarea {
          width: 100%;
          min-height: 6.5rem;
          border: 1px solid #d7dcdc;
          border-radius: 8px;
          padding: 0.75rem 0.85rem;
          resize: vertical;
          outline: none;
          font-family: inherit;
          font-size: 0.9375rem;
          color: #333;
          background: #fff;
        }

        .denuncia textarea::placeholder {
          color: #777;
        }

        .denuncia textarea:focus {
          border-color: #075c3d;
        }

        .mensagem-erro {
          margin: 1rem 0 0;
          padding: 0.75rem 0.85rem;
          border-radius: 8px;
          background: #fdecea;
          color: #8a1f11;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .botao-enviar {
          width: 100%;
          min-height: 2.875rem;
          margin-top: 1.75rem;
          border: none;
          border-radius: 999px;
          background: #075c3d;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(0, 70, 45, 0.25);
        }

        .botao-enviar:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .botao-enviar span {
          font-size: 1rem;
        }

        @media (min-width: 640px) {
          .denuncia {
            padding: 2rem 1.5rem;
            align-items: flex-start;
          }

          .denuncia-container {
            max-width: 36rem;
            min-height: auto;
            border-radius: 12px;
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
            padding: 2rem 2rem 2.25rem;
          }

          .denuncia h1 {
            font-size: 1.6rem;
          }

          .subtitulo {
            font-size: 1rem;
          }

          .denuncia label {
            font-size: 0.8125rem;
          }

          .campo-localizacao,
          .denuncia textarea {
            font-size: 1rem;
          }

          .botao-foto {
            width: 8.5rem;
            height: 6rem;
            font-size: 0.875rem;
          }

          .carrossel-slide {
            height: 13rem;
          }

          .botao-enviar {
            min-height: 3rem;
            font-size: 1rem;
          }
        }

        @media (min-width: 1024px) {
          .denuncia-container {
            max-width: 40rem;
          }
        }
      `}</style>
    </>
  );
}
