// =============================================================================
// LAYOUT RAIZ (app/layout.js)
// =============================================================================
// Envolve TODAS as páginas. Não tem URL própria.
//
// O Next.js (App Router) usa este arquivo como "esqueleto":
//   - idioma do site (pt-BR)
//   - fonte Poppins
//   - CSS global
//   - menu lateral (uma vez só)
//
// {children} = a página da URL de agora.
// Ex.: se a pessoa está em /mapa, children é o conteúdo de app/mapa/page.js.
// =============================================================================

import { Poppins } from "next/font/google";
import MenuLateral from "../components/MenuLateral";
import "./globals.css";

// next/font baixa a Poppins do Google e gera a variável CSS --font-poppins.
// weight: quais "grossuras" vamos usar (400 = normal, 700 = negrito).
// O guia visual mostrava Inter; o grupo combinou usar Poppins.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// metadata = título da ABA do navegador e texto para buscadores.
// Cada page.js pode sobrescrever só o "title".
export const metadata = {
  title: "Denúncias — MVP",
  description:
    "Registrar denúncia sem login, acompanhar por protocolo, ver o mapa e marcar como resolvido.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${poppins.className} h-full antialiased`}
    >
      <head>
        {/*
          Material Icons Outlined: fonte de ÍCONES (não é npm).
          A palavra "home" dentro de um span com a classe certa vira o desenho.
          Ver components/Icone.js.
        */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
        />
      </head>
      <body className="min-h-full flex flex-col bg-neutral text-foreground">
        {/* Menu primeiro = a faixa do topo fica ACIMA do conteúdo das páginas. */}
        <MenuLateral />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
