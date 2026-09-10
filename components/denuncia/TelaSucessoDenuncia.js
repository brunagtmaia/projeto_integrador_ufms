"use client";

// =============================================================================
// TELA /denuncia/sucesso — mostra o protocolo (mock) e atalhos
// =============================================================================
// A URL traz o número: /denuncia/sucesso?protocolo=748393
// useSearchParams() lê esse ?protocolo=...
//
// "use client" porque:
// - precisamos ler a query string no navegador
// - o botão Copiar usa a API do clipboard (só existe no navegador)
// =============================================================================

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Icone from "../Icone";

export default function TelaSucessoDenuncia() {
  const busca = useSearchParams();
  const protocolo = busca.get("protocolo") || "";

  // Texto curto depois de copiar (some sozinho após 2s).
  const [avisoCopia, setAvisoCopia] = useState("");

  async function copiarProtocolo() {
    if (!protocolo) return;
    try {
      await navigator.clipboard.writeText(protocolo);
      setAvisoCopia("Protocolo copiado!");
      setTimeout(() => setAvisoCopia(""), 2000);
    } catch {
      setAvisoCopia("Não foi possível copiar. Anote o número.");
      setTimeout(() => setAvisoCopia(""), 3000);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10 md:py-12">
      <main className="flex w-full max-w-md flex-col gap-6 md:max-w-lg lg:max-w-xl">
        <Link href="/" className="btn-contorno w-fit px-4 py-2 text-sm">
          <Icone nome="arrow_back" className="!text-xl" />
          Voltar à Home
        </Link>

        <header className="cartao flex flex-col items-center px-5 py-8 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-tertiary text-primary">
            <Icone nome="check_circle" className="!text-4xl" />
          </span>
          <p className="label-text mb-2 uppercase text-primary">Denúncia criada</p>
          <h1 className="headline">Protocolo gerado</h1>
          <p className="body-text mt-2">
            Guarde este número. Com ele você acompanha o andamento (ainda sem
            login).
          </p>
        </header>

        <section className="cartao px-5 py-6" aria-label="Número do protocolo">
          {protocolo ? (
            <>
              <p className="label-text mb-2">Seu protocolo</p>
              <p className="text-center text-3xl font-semibold tracking-wide text-primary">
                {protocolo}
              </p>
              <button
                type="button"
                onClick={copiarProtocolo}
                className="btn-secundario mt-5 w-full"
              >
                <Icone nome="content_copy" className="!text-xl" />
                Copiar protocolo
              </button>
              {avisoCopia ? (
                <p className="body-text mt-3 text-center text-primary" role="status">
                  {avisoCopia}
                </p>
              ) : null}
            </>
          ) : (
            <p className="body-text text-center">
              Nenhum protocolo na URL. Volte à tela de denúncia e clique em{" "}
              <strong>Enviar Denúncia</strong>.
            </p>
          )}
        </section>

        <nav className="flex flex-col gap-3" aria-label="Próximos passos">
          {protocolo ? (
            <Link
              href={`/acompanhar?protocolo=${protocolo}`}
              className="btn-primario w-full !justify-start px-5 py-4"
            >
              <Icone nome="search" />
              <span className="text-left">
                <span className="block text-base font-semibold">Acompanhar</span>
                <span className="mt-0.5 block text-sm font-normal opacity-90">
                  Consultar este protocolo
                </span>
              </span>
            </Link>
          ) : (
            <Link
              href="/acompanhar"
              className="btn-primario w-full !justify-start px-5 py-4"
            >
              <Icone nome="search" />
              Acompanhar denúncia
            </Link>
          )}

          <Link
            href="/denuncia"
            className="btn-contorno w-full !justify-start px-5 py-4"
          >
            <Icone nome="add_a_photo" />
            Nova denúncia
          </Link>
        </nav>

        <p className="body-text text-center text-sm opacity-80">
          Check-out 2: o protocolo ainda é simulado (vem da lista de exemplo).
          No check-out 3 ele será gravado no banco.
        </p>
      </main>
    </div>
  );
}
