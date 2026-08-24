// =============================================================================
// HOME — URL: /
// =============================================================================
// No App Router, app/page.js é sempre a página inicial.
// O MVP pede "Home com os botões": daqui a pessoa escolhe a tela.
//
// Os mesmos destinos existem no menu lateral (components/MenuLateral.js).
// Os botões da Home são o atalho visual; o menu é a navegação permanente.
// =============================================================================

import Link from "next/link";
import Icone from "../components/Icone";

// Array das telas. Para incluir outra no futuro:
// 1) crie app/nova-pasta/page.js
// 2) acrescente um objeto aqui
// 3) acrescente o mesmo href em MenuLateral.js
const telas = [
  {
    href: "/denuncia",
    titulo: "Nova denúncia",
    descricao: "Localização + foto + gerar protocolo (sem login)",
    icone: "add_a_photo",
    estilo: "primario",
  },
  {
    href: "/acompanhar",
    titulo: "Acompanhar",
    descricao: "Consulta só pelo número do protocolo",
    icone: "search",
    estilo: "secundario",
  },
  {
    href: "/mapa",
    titulo: "Mapa",
    descricao: "Pontos das denúncias (lista + mapa)",
    icone: "map",
    estilo: "contorno",
  },
  {
    href: "/prefeitura",
    titulo: "Marcar como resolvido",
    descricao: "Tela da prefeitura (senha no .env)",
    icone: "task_alt",
    estilo: "invertido",
  },
];

// Escolhe a classe CSS do botão (definidas em app/globals.css).
// Assim o JSX da Home não fica cheio de if.
function classeDoBotao(estilo) {
  if (estilo === "primario") return "btn-primario";
  if (estilo === "secundario") return "btn-secundario";
  if (estilo === "invertido") return "btn-invertido";
  return "btn-contorno";
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-10">
      <main className="flex w-full max-w-md flex-col gap-8">
        <header className="cartao px-5 py-6">
          <p className="label-text mb-2 uppercase text-primary">MVP</p>
          <h1 className="headline">Denúncias</h1>
          <p className="body-text mt-2">
            Escolha uma tela. Os botões seguem o guia visual do grupo (Poppins +
            Material).
          </p>
        </header>

        <nav className="flex flex-col gap-3" aria-label="Telas do MVP">
          {/*
            map = para cada item do array, cria um Link.
            key = o React exige um id único em listas; usamos a URL.
            Link (next/link) troca de página SEM recarregar o site inteiro.
            Não use <a href="/mapa"> para páginas internas.
          */}
          {telas.map((tela) => (
            <Link
              key={tela.href}
              href={tela.href}
              className={`${classeDoBotao(tela.estilo)} w-full !justify-start px-5 py-4`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Icone nome={tela.icone} />
              </span>
              <span className="text-left">
                <span className="block text-base font-semibold">{tela.titulo}</span>
                <span className="mt-0.5 block text-sm font-normal opacity-90">
                  {tela.descricao}
                </span>
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
