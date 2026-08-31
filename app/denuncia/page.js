// Rota: /denuncia
// Como o Next.js descobre isso: pasta app/denuncia + arquivo page.js = URL /denuncia.
//
// MVP (docs/mpv.md): denúncia SEM login — localização + foto + gerar protocolo.
// Esta página só reserva a rota. Quem for fazer o formulário edita ESTE arquivo
// (troca o PlaceholderTela pelo formulário de verdade).

// import PlaceholderTela from "../../components/PlaceholderTela";

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

          {/* Enviar */}
          <button type="button" className="botao-enviar">
            <span>▷</span>
            Enviar Denúncia
          </button>
        </div>
      </main>

      {/* CSS da página */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .denuncia {
          min-height: 100vh;
          background: #f5f6f7;
          display: flex;
          justify-content: center;
          color: #222;
          font-family: Arial, Helvetica, sans-serif;
        }

        .denuncia-container {
          width: 100%;
          max-width: 390px;
          min-height: 100vh;
          background: #fff;
          padding: 28px 16px 24px;
        }

        /* Título */

        .denuncia h1 {
          margin: 0;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 600;
          color: #222;
        }

        .subtitulo {
          margin: 6px 0 16px;
          max-width: 285px;
          font-size: 11px;
          line-height: 1.45;
          color: #686868;
        }

        /* Barra de progresso */

        .progresso {
          width: 100%;
          height: 4px;
          background: #e5e5e5;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 19px;
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
          margin-top: 15px;
          margin-bottom: 5px;
          font-size: 8px;
          font-weight: 500;
          color: #777;
        }

        /* Localização */

        .campo-localizacao {
          width: 100%;
          height: 34px;
          border: 1px solid #d7dcdc;
          border-radius: 5px;

          display: flex;
          align-items: center;
          gap: 6px;

          padding: 0 9px;

          font-size: 9px;
          color: #555;
          background: #fff;
        }

        .icone-localizacao {
          color: #075c3d;
          font-size: 17px;
          line-height: 1;
        }

        /* Foto */

        .botao-foto {
          width: 87px;
          height: 67px;

          border: 1px dashed #cbd3d0;
          border-radius: 7px;

          background: #fff;
          color: #555;

          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          gap: 7px;

          font-size: 9px;
          cursor: pointer;
        }

        .icone-camera {
          font-size: 18px;
          line-height: 1;
        }

        .denuncia small {
          display: block;
          margin-top: 4px;
          font-size: 6px;
          color: #888;
        }

        /* Descrição */

        .denuncia textarea {
          width: 100%;
          height: 52px;

          border: 1px solid #d7dcdc;
          border-radius: 5px;

          padding: 9px;

          resize: none;
          outline: none;

          font-family: Arial, Helvetica, sans-serif;
          font-size: 9px;
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
          height: 31px;

          margin-top: 25px;

          border: none;
          border-radius: 20px;

          background: #075c3d;
          color: #fff;

          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;

          font-size: 9px;
          font-weight: 600;

          cursor: pointer;

          box-shadow: 0 3px 8px rgba(0, 70, 45, 0.25);
        }

        .botao-enviar span {
          font-size: 12px;
        }

        /* Desktop */

        @media (min-width: 600px) {
          .denuncia {
            padding: 30px 0;
          }

          .denuncia-container {
            min-height: auto;
            border-radius: 10px;
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
          }
        }
      `}</style>
    </>
  );
}
