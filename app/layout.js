// Este arquivo envolve TODAS as páginas do site.
// No Next.js (App Router), o layout.js da pasta app/ é o "esqueleto":
// o HTML, o idioma, as fontes e o CSS global ficam aqui uma vez só.
// O conteúdo de cada rota (Home, Denúncia, etc.) entra no lugar de {children}.

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Carrega as fontes do Google. "variable" cria uma CSS variable
// (ex.: --font-geist-sans) que o Tailwind usa no globals.css.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadata: título e descrição que aparecem na aba do navegador
// e em buscadores. Cada página pode sobrescrever só o title.
export const metadata = {
  title: "Denúncias — MVP",
  description:
    "Registrar denúncia sem login, acompanhar por protocolo, ver o mapa e marcar como resolvido.",
};

// RootLayout é o componente raiz. "children" = a página da URL atual.
export default function RootLayout({ children }) {
  return (
    // lang="pt-BR" ajuda leitores de tela e o navegador a tratar o texto em português.
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* min-h-full + flex: a página ocupa a altura da tela e empilha o conteúdo. */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
