// =============================================================================
// PÁGINA /denuncia/sucesso
// =============================================================================
// Pasta app/denuncia/sucesso + page.js = URL /denuncia/sucesso
// O número vem na query: ?protocolo=748393
//
// Suspense: useSearchParams (dentro de TelaSucessoDenuncia) exige um limite
// de carregamento no App Router do Next.js. Sem isso o build pode reclamar.
// =============================================================================

import { Suspense } from "react";
import TelaSucessoDenuncia from "../../../components/denuncia/TelaSucessoDenuncia";

export const metadata = {
  title: "Denúncia criada",
};

export default function PaginaSucessoDenuncia() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <p className="body-text">Carregando protocolo…</p>
        </div>
      }
    >
      <TelaSucessoDenuncia />
    </Suspense>
  );
}
