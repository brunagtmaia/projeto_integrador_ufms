// =============================================================================
// Helpers para o campo `foto` da denúncia
// =============================================================================
// No MVP antigo o banco guardava um caminho só: "/uploads/abc.jpg".
// Agora o formulário pode enviar várias fotos: gravamos um JSON
// '["/uploads/a.jpg","/uploads/b.jpg"]' quando há mais de uma.
// Estas funções leem os dois formatos sem quebrar denúncias antigas.
// =============================================================================

/**
 * Devolve a lista de caminhos públicos das fotos.
 * @param {string | null | undefined} fotoCampo
 * @returns {string[]}
 */
export function listarFotos(fotoCampo) {
  if (!fotoCampo) return [];

  const texto = String(fotoCampo).trim();
  if (!texto) return [];

  if (texto.startsWith("[")) {
    try {
      const lista = JSON.parse(texto);
      if (Array.isArray(lista)) {
        return lista.filter((item) => typeof item === "string" && item.trim());
      }
    } catch {
      // Se o JSON estiver inválido, cai no formato de caminho único.
    }
  }

  return [texto];
}

/**
 * Primeira foto (a “principal”) — útil em <img src={...}>.
 * @param {string | null | undefined} fotoCampo
 * @returns {string | null}
 */
export function fotoPrincipal(fotoCampo) {
  return listarFotos(fotoCampo)[0] || null;
}

/**
 * Valor a gravar no banco: caminho único ou JSON se houver várias.
 * @param {string[]} caminhos
 * @returns {string | null}
 */
export function serializarFotos(caminhos) {
  const limpos = (caminhos || []).filter(
    (item) => typeof item === "string" && item.trim(),
  );
  if (limpos.length === 0) return null;
  if (limpos.length === 1) return limpos[0];
  return JSON.stringify(limpos);
}
