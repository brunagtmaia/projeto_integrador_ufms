// Rota: /denuncia
// Como o Next.js descobre isso: pasta app/denuncia + arquivo page.js = URL /denuncia.
//
// MVP (docs/mpv.md): denúncia SEM login — localização + foto + gerar protocolo.
// Layout visual: NÃO redesenhar (combinado no check-out 2).
// Só o botão Enviar ganhou onClick → /denuncia/sucesso (ver BotaoEnviarDenuncia).
// Responsivo: mobile full-width; desktop até ~36rem com tipografia legível.

import BotaoEnviarDenuncia from "../../components/denuncia/BotaoEnviarDenuncia";

// Título da aba do navegador nesta página (sobrescreve o do layout).
export const metadata = {
  title: "Nova denúncia",
};

export default function PaginaDenuncia() {
  return (
    <>
      <main className="denuncia">
        <div className="denuncia-container">

          {/* Título */}
          <h1>Realizar denúncia anônima</h1>

          <p className="subtitulo">
            Forneça os detalhes abaixo para registrar um
            problema na sua região.
          </p>

          {/* Barra de progresso */}
          <div className="progresso">
            <div className="progresso-atual"></div>
          </div>

          {/* Localização */}
          <label>Localização</label>

          <div className="campo-localizacao">
            <span className="icone-localizacao">⌖</span>
            <span>Rua, Bairro, Cidade...</span>
          </div>

          {/* Foto */}
          <label>Adicionar Mídia</label>

          <button type="button" className="botao-foto">
            <span className="icone-camera">📷</span>
            <span>Tirar Foto</span>
          </button>

          <small>
            Anexe fotos claras do problema (no máximo 5).
          </small>

          {/* Descrição */}
          <label>Descrição Adicional</label>

          <textarea
            placeholder="Detalhes sobre o problema..."
          />

          {/* Enviar: mesmo visual; clique sorteia id do mock e vai ao sucesso */}
          <BotaoEnviarDenuncia />
        </div>
      </main>

      {/* CSS da página — escala legível no mobile; container mais largo no desktop */}
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

        /* Título */

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

        /* Barra de progresso */

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

        /* Labels */

        .denuncia label {
          display: block;
          margin-top: 1.15rem;
          margin-bottom: 0.4rem;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #777;
        }

        /* Localização */

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
        }

        /* Foto */

        .botao-foto {
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

          gap: 0.4rem;

          font-size: 0.8125rem;
          cursor: pointer;
        }

        .icone-camera {
          font-size: 1.5rem;
          line-height: 1;
        }

        .denuncia small {
          display: block;
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: #888;
        }

        /* Descrição */

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

        /* Botão enviar */

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

          cursor: pointer;

          box-shadow: 0 3px 8px rgba(0, 70, 45, 0.25);
        }

        .botao-enviar span {
          font-size: 1rem;
        }

        /* Tablet / desktop: coluna mais larga e tipografia um pouco maior */

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
