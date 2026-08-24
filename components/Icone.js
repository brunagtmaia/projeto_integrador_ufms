// =============================================================================
// ÍCONE (Material Icons Outlined — Google)
// =============================================================================
// Como usar em qualquer tela:
//
//   import Icone from "../components/Icone";
//   <Icone nome="home" />
//
// O "nome" é o NOME OFICIAL em inglês. Exemplos: home, search, map, menu, close.
// Catálogo: https://fonts.google.com/icons
// (marque o estilo "Outlined" para ficar igual ao nosso.)
//
// Como funciona por baixo: a fonte Material transforma a PALAVRA "home" no
// desenho da casinha. Por isso o texto dentro do <span> precisa ser exatamente
// o nome do ícone, em minúsculas e com underline (add_a_photo, não "adicionar foto").
//
// A classe CSS .material-icons-outlined está em app/globals.css.
// A fonte em si é carregada no app/layout.js (link do Google Fonts).
//
// aria-hidden="true": o ícone é decoração. O botão/link já tem texto ou
// aria-label; o leitor de tela não precisa ler "home" duas vezes.
//
// className extra: para mudar o tamanho, ex. <Icone nome="arrow_back" className="!text-xl" />
// =============================================================================

export default function Icone({ nome, className = "" }) {
  return (
    <span className={`material-icons-outlined ${className}`} aria-hidden="true">
      {nome}
    </span>
  );
}
