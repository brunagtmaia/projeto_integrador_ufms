"use client";

// =============================================================================
// MENU LATERAL (abre e fecha)
// =============================================================================
// Este componente NÃO é uma página. Ele aparece em TODAS as telas porque o
// app/layout.js o coloca uma vez só (acima do conteúdo).
//
// Por que LATERAL e não embaixo?
// O site é um aplicativo WEB responsivo. Menu embaixo é típico de app de
// celular nativo; aqui ele atrapalharia o conteúdo. O painel sai da ESQUERDA
// e a pessoa escolhe quando ver (abrir) e quando esconder (fechar).
//
// Por que a primeira linha é "use client"?
// No Next.js (App Router), arquivos são "servidor" por padrão. Para guardar
// se o menu está aberto (useState) e para ler a URL atual (usePathname),
// o React precisa rodar NO NAVEGADOR. "use client" avisa isso.
// Sem essa linha, o Next.js reclama.
// =============================================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icone from "./Icone";

// Lista das telas do MVP. Cada objeto vira um item no menu.
// href  = URL (precisa existir app/.../page.js)
// nome  = nome do ícone Material em inglês (veja fonts.google.com/icons)
// rotulo = texto que a pessoa lê
const itens = [
  { href: "/", nome: "home", rotulo: "Home" },
  { href: "/denuncia", nome: "add_a_photo", rotulo: "Nova denúncia" },
  { href: "/acompanhar", nome: "search", rotulo: "Acompanhar" },
  { href: "/mapa", nome: "map", rotulo: "Mapa" },
  { href: "/prefeitura", nome: "task_alt", rotulo: "Prefeitura" },
];

export default function MenuLateral() {
  // useState = "memória" do componente.
  // aberto começa false = menu fechado quando a página carrega.
  // setAberto(true) abre; setAberto(false) fecha.
  // Quando o estado muda, o React redesenha a tela.
  const [aberto, setAberto] = useState(false);

  // usePathname = URL atual, ex.: "/mapa".
  // Usamos para pintar de verde o item da tela em que a pessoa está.
  const caminho = usePathname();

  function fechar() {
    setAberto(false);
  }

  function abrir() {
    setAberto(true);
  }

  // useEffect = "quando X mudar, rode isto".
  // Aqui: se a URL (caminho) mudar, fechamos o menu.
  // Assim, depois de clicar em "Mapa", o painel não fica aberto na frente.
  // O array [caminho] é a lista de dependências: só roda de novo se a URL mudar.
  useEffect(() => {
    setAberto(false);
  }, [caminho]);

  // Outro efeito: tecla Esc fecha o menu.
  // overflow hidden no body impede a página de rolar por baixo do painel.
  //
  // O "return () => { ... }" é a LIMPEZA: quando o componente some ou o
  // efeito roda de novo, tiramos o listener para não acumular escutas.
  useEffect(() => {
    function aoTeclar(evento) {
      if (evento.key === "Escape") {
        setAberto(false);
      }
    }

    document.addEventListener("keydown", aoTeclar);
    document.body.style.overflow = aberto ? "hidden" : "";

    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <>
      {/* <>...</> é um Fragment: agrupa vários elementos sem criar uma div extra. */}

      {/*
        HEADER (faixa do topo)
        sticky + top-0 = cola no topo quando a pessoa rola a página.
        z-20 = fica acima do conteúdo normal (número maior = mais na frente).
      */}
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[var(--neutral-borda)] bg-[var(--branco)] px-4 py-3 shadow-[0_4px_16px_rgb(27_38_59_/_6%)]">
        {/*
          type="button" evita que, se um dia este botão fique dentro de um
          <form>, ele envie o formulário.
          aria-label = nome para leitor de tela (o botão só tem ícone).
          aria-expanded = avisa se o menu está aberto (acessibilidade).
          onClick={abrir} = ao clicar, chama a função abrir.
        */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--tertiary)] text-primary"
          aria-label="Abrir menu"
          aria-expanded={aberto}
          aria-controls="menu-lateral"
          onClick={abrir}
        >
          <Icone nome="menu" />
        </button>
        <p className="text-base font-semibold text-secondary">Denúncias</p>
      </header>

      {/*
        FUNDO ESCURO (só existe se aberto for true)
        {aberto ? ( ... ) : null}  = se aberto, desenha; senão, nada.
        Clicar aqui também fecha (a pessoa clicou FORA do painel).
        z-30 fica acima do header, mas ABAIXO do aside (z-40).
      */}
      {aberto ? (
        <button
          type="button"
          className="fixed inset-0 z-30 border-0"
          style={{ background: "rgba(27, 38, 59, 0.4)" }}
          aria-label="Fechar menu"
          onClick={fechar}
        />
      ) : null}

      {/*
        ASIDE = painel lateral.
        fixed = sai do fluxo da página e cola na janela.
        translateX(-100%) empurra o painel para FORA (esquerda, invisível).
        translateX(0) traz de volta.
        transition deixa o movimento suave (0,2 segundo).
        inert = com o menu fechado, teclado/leitor de tela ignoram o painel.
      */}
      <aside
        id="menu-lateral"
        className="fixed top-0 left-0 z-40 flex h-full w-72 max-w-[85vw] flex-col bg-white"
        style={{
          transform: aberto ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease-out",
          boxShadow: aberto ? "8px 0 32px rgba(27, 38, 59, 0.12)" : "none",
          pointerEvents: aberto ? "auto" : "none",
        }}
        aria-hidden={!aberto}
        inert={!aberto || undefined}
      >
        <div className="flex items-center justify-between border-b border-[var(--neutral-borda)] px-4 py-3">
          <p className="text-base font-semibold text-secondary">Menu</p>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-secondary hover:bg-[var(--neutral)]"
            aria-label="Fechar menu"
            onClick={fechar}
          >
            <Icone nome="close" />
          </button>
        </div>

        <nav aria-label="Navegação principal" className="flex flex-1 flex-col gap-1 p-3">
          {/*
            .map percorre o array e cria um Link para cada item.
            key={item.href} é obrigatório em listas no React (identificador único).
            ativo = esta URL é a da página atual? Se sim, fundo verde.
          */}
          {itens.map((item) => {
            const ativo = caminho === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                  ativo
                    ? "bg-primary text-white"
                    : "text-secondary hover:bg-[var(--tertiary)]"
                }`}
              >
                <Icone nome={item.nome} />
                {item.rotulo}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
