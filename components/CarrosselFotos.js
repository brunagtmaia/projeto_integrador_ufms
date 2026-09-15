"use client";

// Carrossel de fotos da denúncia (prefeitura / acompanhar).
// Com 1 foto: só a imagem. Com 2+: setas, contador e bolinhas.

import { useState } from "react";
import Icone from "./Icone";

/**
 * @param {{
 *   fotos: string[],
 *   altBase?: string,
 *   className?: string,
 * }} props
 */
export default function CarrosselFotos({
  fotos = [],
  altBase = "Foto da denúncia",
  className = "",
}) {
  const lista = (fotos || []).filter(
    (item) => typeof item === "string" && item.trim(),
  );
  const [indice, setIndice] = useState(0);
  const [falhou, setFalhou] = useState(false);

  if (lista.length === 0) return null;

  // Se a lista mudar (ex.: outra denúncia) e o índice ficar fora, volta ao início.
  const indiceSeguro = Math.min(indice, lista.length - 1);
  const src = lista[indiceSeguro];
  const temVarias = lista.length > 1;

  function irPara(novoIndice) {
    setFalhou(false);
    setIndice(novoIndice);
  }

  function anterior() {
    irPara(indiceSeguro <= 0 ? lista.length - 1 : indiceSeguro - 1);
  }

  function proxima() {
    irPara(indiceSeguro >= lista.length - 1 ? 0 : indiceSeguro + 1);
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="relative flex items-center gap-1.5">
        {temVarias ? (
          <button
            type="button"
            onClick={anterior}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--neutral-borda)] bg-white text-primary"
            aria-label="Foto anterior"
          >
            <Icone nome="chevron_left" className="!text-xl" />
          </button>
        ) : null}

        <div className="relative aspect-[4/3] min-w-0 flex-1 overflow-hidden rounded-[var(--raio)] bg-[var(--neutral)]">
          {falhou ? (
            <p className="absolute inset-0 flex items-center justify-center px-3 text-center text-sm text-[var(--texto-suave)]">
              Foto indisponível
            </p>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- URL local /uploads
            <img
              key={src}
              src={src}
              alt={`${altBase} (${indiceSeguro + 1} de ${lista.length})`}
              className="h-full w-full object-cover"
              onError={() => setFalhou(true)}
            />
          )}
        </div>

        {temVarias ? (
          <button
            type="button"
            onClick={proxima}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--neutral-borda)] bg-white text-primary"
            aria-label="Próxima foto"
          >
            <Icone nome="chevron_right" className="!text-xl" />
          </button>
        ) : null}
      </div>

      {temVarias ? (
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-xs font-semibold text-primary" role="status">
            {indiceSeguro + 1} / {lista.length}
          </p>
          <div className="flex justify-center gap-1.5" aria-hidden="true">
            {lista.map((item, i) => (
              <button
                key={`${item}-${i}`}
                type="button"
                tabIndex={-1}
                onClick={() => irPara(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === indiceSeguro
                    ? "w-3.5 bg-primary"
                    : "w-1.5 bg-[var(--neutral-borda)]"
                }`}
                aria-label={`Ir para foto ${i + 1}`}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
