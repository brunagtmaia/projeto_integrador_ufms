"use client";

// =============================================================================
// TELA /prefeitura — marcar denúncia como resolvida (só front / mock)
// =============================================================================
// Fluxo (docs/10-checkout2-frontend-telas.md):
//   1) digita senha de teste: prefeitura
//   2) se certa, vê a lista de PENDENTE
//   3) “Marcar como resolvido” muda o status SÓ na memória (useState)
//      → recarregar a página volta ao mock (normal no check-out 2)
//
// No check-out 3 a senha sai do código e vai para .env (ADMIN_PASSWORD),
// e “resolver” chama a API de verdade.
//
// "use client" porque precisamos de estado no navegador (senha, lista).
// =============================================================================

import { useMemo, useState } from "react";
import Link from "next/link";
import Icone from "../Icone";
import {
  DENUNCIAS_EXEMPLO,
  listarDenunciasPendentes,
} from "../../lib/denuncias-exemplo";

// Senha SÓ para testar o visual. Não é segurança de verdade.
const SENHA_TESTE = "prefeitura";

export default function TelaPrefeitura() {
  // Cópia da lista mock na memória da tela (podemos mudar status sem
  // alterar o arquivo lib/denuncias-exemplo.js).
  const [lista, setLista] = useState(() =>
    DENUNCIAS_EXEMPLO.map((d) => ({ ...d })),
  );

  const [senha, setSenha] = useState("");
  // false = ainda não entrou | true = senha aceita
  const [autenticado, setAutenticado] = useState(false);
  // null = sem mensagem | string = erro de senha
  const [erroSenha, setErroSenha] = useState(null);

  const pendentes = useMemo(
    () => listarDenunciasPendentes(lista),
    [lista],
  );

  function entrar(evento) {
    evento.preventDefault();
    setErroSenha(null);

    if (senha.trim() === SENHA_TESTE) {
      setAutenticado(true);
      return;
    }

    setAutenticado(false);
    setErroSenha("Senha incorreta. Use a senha de teste: prefeitura");
  }

  function marcarResolvido(id) {
    // Atualiza só o item clicado: PENDENTE → RESOLVIDO na cópia em memória.
    setLista((anterior) =>
      anterior.map((d) =>
        d.id === id ? { ...d, status: "RESOLVIDO" } : d,
      ),
    );
  }

  function sair() {
    setAutenticado(false);
    setSenha("");
    setErroSenha(null);
    // Restaura o mock original (como se tivesse “recarregado” a lista).
    setLista(DENUNCIAS_EXEMPLO.map((d) => ({ ...d })));
  }

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
            Área da prefeitura: informe a senha de teste para ver as denúncias
            pendentes. Não é um sistema de login completo.
          </p>
        </header>

        {/* ---- Bloqueio por senha ---- */}
        {!autenticado ? (
          <form
            onSubmit={entrar}
            className="cartao flex flex-col gap-4 px-5 py-6"
          >
            <label htmlFor="campo-senha-prefeitura" className="label-text text-secondary">
              Senha
            </label>
            <input
              id="campo-senha-prefeitura"
              type="password"
              autoComplete="current-password"
              placeholder="Senha de teste"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
                if (erroSenha) setErroSenha(null);
              }}
              className="w-full rounded-[var(--raio)] border border-[var(--neutral-borda)] bg-white px-4 py-3 text-base text-secondary outline-none focus:border-primary"
            />

            {erroSenha ? (
              <p className="rounded-[var(--raio)] bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {erroSenha}
              </p>
            ) : null}

            <button type="submit" className="btn-primario w-full">
              <Icone nome="lock_open" />
              Entrar
            </button>

            <p className="body-text text-sm opacity-80">
              Check-out 2: a senha de teste é{" "}
              <span className="font-semibold text-secondary">prefeitura</span>.
              No check-out 3 ela vai para o arquivo <code>.env</code>.
            </p>
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
              <button
                type="button"
                onClick={sair}
                className="btn-contorno px-4 py-2 text-sm"
              >
                <Icone nome="logout" className="!text-xl" />
                Sair
              </button>
            </div>

            {pendentes.length === 0 ? (
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
                  Todas as denúncias desta sessão estão resolvidas. Recarregue a
                  página (ou clique em Sair) para voltar ao mock original.
                </p>
              </section>
            ) : (
              <ul
                className="flex flex-col gap-3 md:grid md:grid-cols-2"
                aria-label="Denúncias pendentes"
              >
                {pendentes.map((denuncia) => (
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

                    <button
                      type="button"
                      onClick={() => marcarResolvido(denuncia.id)}
                      className="btn-primario mt-auto w-full"
                    >
                      <Icone nome="task_alt" />
                      Marcar como resolvido
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <p className="body-text text-center text-sm opacity-80">
              Ainda não grava no banco: o status muda só nesta tela. No check-out
              3 a API salva de verdade.
            </p>
          </>
        ) : null}
      </main>
    </div>
  );
}
