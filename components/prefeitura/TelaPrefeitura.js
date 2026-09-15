"use client";

// =============================================================================
// TELA /prefeitura — marcar denúncia como resolvida (API real)
// =============================================================================
// Check-out 3 · passo 12:
//   Antes (check-out 2): senha fixa "prefeitura" no código + lista mock +
//   “resolver” só mudava o useState (sumia ao recarregar).
//   Agora:
//     1) a senha digitada é conferida no SERVIDOR (ADMIN_PASSWORD do .env)
//     2) a lista de pendentes vem de GET /api/denuncias
//     3) “Marcar como resolvido” chama PATCH /api/denuncias/[id]/resolver
//        → o status vira RESOLVIDO no SQLite de verdade
//
// Por que a senha NÃO fica neste arquivo?
//   Se alguém abrir o código no GitHub, não pode ver a senha.
//   O front só ENVIA o que a pessoa digitou; quem compara é a API (passo 08).
//
// "use client" porque precisamos de estado + clique + fetch no navegador.
// Guia: docs/11-checkout3-banco-backend.md (seção do passo 12)
// =============================================================================

import { useState } from "react";
import Link from "next/link";
import Icone from "../Icone";
import CarrosselFotos from "../CarrosselFotos";

/**
 * Protocolo inventado só para “testar a senha” sem marcar nada de verdade.
 * A API do passo 08 confere a senha ANTES de procurar o id:
 *   - senha errada → 401
 *   - senha certa + id inexistente → 404  ← isso significa “pode entrar”
 */
const PROTOCOLO_TESTE_SENHA = "__teste_senha__";

export default function TelaPrefeitura() {
  // O que a pessoa digita no campo (também fica guardado depois do entrar,
  // porque cada “Marcar como resolvido” precisa mandar a senha de novo).
  const [senha, setSenha] = useState("");

  // false = ainda na tela de senha | true = já passou e vê a lista
  const [autenticado, setAutenticado] = useState(false);

  // null = sem mensagem | string = erro de senha / rede no login
  const [erroSenha, setErroSenha] = useState(null);

  // Denúncias PENDENTE vindas do banco (depois do login).
  const [pendentes, setPendentes] = useState([]);

  // null = idle | "entrando" | "carregando_lista" | "resolvendo"
  const [ocupado, setOcupado] = useState(null);

  // Qual protocolo está sendo resolvido agora (para desabilitar só aquele botão).
  const [idResolvendo, setIdResolvendo] = useState(null);

  // Erro ao carregar lista ou ao marcar resolvido (depois de autenticado).
  const [erroAcao, setErroAcao] = useState(null);

  /**
   * Confere a senha no servidor (sem criar API de “login”).
   * Usa o PATCH do passo 08 com um protocolo que não existe.
   * @param {string} senhaDigitada
   * @returns {Promise<{ ok: true } | { ok: false, erro: string }>}
   */
  async function conferirSenhaNoServidor(senhaDigitada) {
    const resposta = await fetch(
      `/api/denuncias/${encodeURIComponent(PROTOCOLO_TESTE_SENHA)}/resolver`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha: senhaDigitada }),
      },
    );

    let dados = null;
    try {
      dados = await resposta.json();
    } catch {
      dados = null;
    }

    // 401 = senha diferente do ADMIN_PASSWORD do .env
    if (resposta.status === 401) {
      return {
        ok: false,
        erro: dados?.erro || "Senha incorreta.",
      };
    }

    // 404 = senha certa, mas o protocolo de teste não existe (esperado!).
    // 200 = improvável (só se alguém criasse esse id), mas senha também ok.
    if (resposta.status === 404 || resposta.ok) {
      return { ok: true };
    }

    // Outros erros (ex.: 500 sem ADMIN_PASSWORD no .env)
    return {
      ok: false,
      erro:
        dados?.erro ||
        "Não foi possível validar a senha. Tente novamente.",
    };
  }

  /**
   * Busca todas as denúncias e fica só com as PENDENTE.
   * @returns {Promise<{ ok: true, lista: object[] } | { ok: false, erro: string }>}
   */
  async function carregarPendentes() {
    const resposta = await fetch("/api/denuncias");

    let dados = null;
    try {
      dados = await resposta.json();
    } catch {
      dados = null;
    }

    if (!resposta.ok || !dados?.ok || !Array.isArray(dados.denuncias)) {
      return {
        ok: false,
        erro:
          dados?.erro ||
          "Não foi possível carregar as denúncias. Tente de novo.",
      };
    }

    const lista = dados.denuncias.filter((d) => d.status === "PENDENTE");
    return { ok: true, lista };
  }

  /**
   * Formulário de senha → confere no servidor → carrega pendentes do banco.
   */
  async function entrar(evento) {
    evento.preventDefault();
    setErroSenha(null);
    setErroAcao(null);

    const limpa = senha.trim();
    if (!limpa) {
      setErroSenha("Digite a senha da prefeitura.");
      return;
    }

    setOcupado("entrando");

    try {
      const checagem = await conferirSenhaNoServidor(limpa);
      if (!checagem.ok) {
        setAutenticado(false);
        setErroSenha(checagem.erro);
        return;
      }

      setOcupado("carregando_lista");
      const carga = await carregarPendentes();
      if (!carga.ok) {
        setAutenticado(false);
        setErroSenha(carga.erro);
        return;
      }

      setPendentes(carga.lista);
      setAutenticado(true);
    } catch {
      setAutenticado(false);
      setErroSenha(
        "Falha de rede. Tente novamente em instantes.",
      );
    } finally {
      setOcupado(null);
    }
  }

  /**
   * Chama PATCH /api/denuncias/[id]/resolver com a senha já digitada.
   * Se der certo, tira o item da lista (ou recarrega as pendentes).
   */
  async function marcarResolvido(id) {
    setErroAcao(null);
    setIdResolvendo(id);
    setOcupado("resolvendo");

    try {
      const resposta = await fetch(
        `/api/denuncias/${encodeURIComponent(id)}/resolver`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senha: senha.trim() }),
        },
      );

      let dados = null;
      try {
        dados = await resposta.json();
      } catch {
        dados = null;
      }

      if (resposta.status === 401) {
        // Senha mudou no .env no meio do uso, ou sessão “inválida”.
        setAutenticado(false);
        setPendentes([]);
        setErroSenha(dados?.erro || "Senha incorreta. Entre de novo.");
        return;
      }

      if (!resposta.ok || !dados?.ok) {
        setErroAcao(
          dados?.erro ||
            "Não foi possível marcar como resolvido. Tente de novo.",
        );
        return;
      }

      // Some da lista de pendentes (já está RESOLVIDO no banco).
      setPendentes((anterior) => anterior.filter((d) => d.id !== id));
    } catch {
      setErroAcao(
        "Falha de rede ao marcar resolvido. Tente novamente em instantes.",
      );
    } finally {
      setIdResolvendo(null);
      setOcupado(null);
    }
  }

  async function atualizarLista() {
    setErroAcao(null);
    setOcupado("carregando_lista");

    try {
      const carga = await carregarPendentes();
      if (!carga.ok) {
        setErroAcao(carga.erro);
        return;
      }
      setPendentes(carga.lista);
    } catch {
      setErroAcao(
        "Falha de rede ao atualizar. Tente novamente em instantes.",
      );
    } finally {
      setOcupado(null);
    }
  }

  function sair() {
    setAutenticado(false);
    setSenha("");
    setErroSenha(null);
    setErroAcao(null);
    setPendentes([]);
    setIdResolvendo(null);
    setOcupado(null);
  }

  const entrando = ocupado === "entrando" || ocupado === "carregando_lista";
  const resolvendo = ocupado === "resolvendo";

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10 md:py-12">
      <main className="flex w-full max-w-md flex-col gap-6 md:max-w-2xl lg:max-w-3xl">
        <Link href="/" className="btn-contorno w-fit px-4 py-2 text-sm">
          <Icone nome="arrow_back" className="!text-xl" />
          Voltar à Home
        </Link>

        <header className="cartao px-5 py-6">
          <p className="label-text mb-2 uppercase text-primary">Prefeitura</p>
          <h1 className="headline">Marcar como resolvido</h1>
          <p className="body-text mt-2">
            Área restrita da prefeitura. Informe a senha para ver e atualizar
            as denúncias pendentes.
          </p>
        </header>

        {/* ---- Bloqueio por senha ---- */}
        {!autenticado ? (
          <form
            onSubmit={entrar}
            className="cartao flex flex-col gap-4 px-5 py-6"
          >
            <label
              htmlFor="campo-senha-prefeitura"
              className="label-text text-secondary"
            >
              Senha
            </label>
            <input
              id="campo-senha-prefeitura"
              type="password"
              autoComplete="current-password"
              placeholder="Digite a senha"
              value={senha}
              disabled={entrando}
              onChange={(e) => {
                setSenha(e.target.value);
                if (erroSenha) setErroSenha(null);
              }}
              className="w-full rounded-[var(--raio)] border border-[var(--neutral-borda)] bg-white px-4 py-3 text-base text-secondary outline-none focus:border-primary disabled:opacity-60"
            />

            {erroSenha ? (
              <p
                className="rounded-[var(--raio)] bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                {erroSenha}
              </p>
            ) : null}

            <button
              type="submit"
              className="btn-primario w-full"
              disabled={entrando}
            >
              <Icone nome="lock_open" />
              {entrando ? "Entrando…" : "Entrar"}
            </button>

          </form>
        ) : null}

        {/* ---- Lista após autenticação ---- */}
        {autenticado ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="body-text text-sm">
                <span className="font-semibold text-secondary">
                  {pendentes.length}
                </span>{" "}
                pendente{pendentes.length === 1 ? "" : "s"}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={atualizarLista}
                  disabled={ocupado !== null}
                  className="btn-contorno px-4 py-2 text-sm"
                >
                  <Icone nome="refresh" className="!text-xl" />
                  Atualizar
                </button>
                <button
                  type="button"
                  onClick={sair}
                  disabled={resolvendo}
                  className="btn-contorno px-4 py-2 text-sm"
                >
                  <Icone nome="logout" className="!text-xl" />
                  Sair
                </button>
              </div>
            </div>

            {erroAcao ? (
              <p
                className="rounded-[var(--raio)] bg-red-50 px-3 py-2 text-sm text-red-800"
                role="alert"
              >
                {erroAcao}
              </p>
            ) : null}

            {ocupado === "carregando_lista" ? (
              <p className="cartao px-5 py-6 text-center body-text" role="status">
                Carregando denúncias pendentes…
              </p>
            ) : null}

            {ocupado !== "carregando_lista" && pendentes.length === 0 ? (
              <section
                className="cartao border-dashed px-5 py-8 text-center"
                role="status"
              >
                <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-tertiary text-primary">
                  <Icone nome="task_alt" className="!text-3xl" />
                </span>
                <h2 className="text-lg font-semibold text-secondary">
                  Nenhuma pendente
                </h2>
                <p className="body-text mt-2">
                  Não há denúncias pendentes no momento. Quando houver novos
                  registros, eles aparecerão aqui.
                </p>
              </section>
            ) : null}

            {ocupado !== "carregando_lista" && pendentes.length > 0 ? (
              <ul
                className="flex flex-col gap-3 md:grid md:grid-cols-2"
                aria-label="Denúncias pendentes"
              >
                {pendentes.map((denuncia) => {
                  const nesteItem = idResolvendo === denuncia.id;
                  return (
                    <li
                      key={denuncia.id}
                      className="cartao flex h-full flex-col gap-3 px-5 py-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="label-text mb-1">Protocolo</p>
                          <p className="text-lg font-semibold text-primary">
                            {denuncia.id}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                          Pendente
                        </span>
                      </div>

                      <div>
                        <p className="label-text mb-1">Endereço</p>
                        <p className="font-medium text-secondary">
                          {denuncia.endereco}
                        </p>
                      </div>

                      <div>
                        <p className="label-text mb-1">Descrição</p>
                        <p className="body-text">{denuncia.descricao}</p>
                      </div>

                      {(denuncia.fotos?.length > 0 || denuncia.foto) ? (
                        <div>
                          <p className="label-text mb-1">
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

                      <button
                        type="button"
                        onClick={() => marcarResolvido(denuncia.id)}
                        disabled={ocupado !== null}
                        className="btn-primario mt-auto w-full"
                      >
                        <Icone nome="task_alt" />
                        {nesteItem ? "Salvando…" : "Marcar como resolvido"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}

          </>
        ) : null}
      </main>
    </div>
  );
}
