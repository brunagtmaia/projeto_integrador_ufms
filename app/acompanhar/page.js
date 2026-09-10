// =============================================================================
// PÁGINA /acompanhar
// =============================================================================
// Pasta app/acompanhar + page.js = URL /acompanhar
//
// MVP: acompanhar a denúncia SÓ pelo número do protocolo
// (sem cadastro, sem "minhas denúncias").
//
// A consulta de verdade fica em components/acompanhar/TelaAcompanhar.js
// (cliente: campo, estados, mock).
//
// Suspense: useSearchParams (pré-preenche ?protocolo=) exige um fallback
// no App Router — mesmo padrão de /denuncia/sucesso.
// =============================================================================

import { Suspense } from "react";
import TelaAcompanhar from "../../components/acompanhar/TelaAcompanhar";

export const metadata = {
  title: "Acompanhar denúncia",
};

export default function PaginaAcompanhar() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <p className="body-text">Carregando consulta…</p>
        </div>
      }
    >
      <TelaAcompanhar />
    </Suspense>
  );
}
