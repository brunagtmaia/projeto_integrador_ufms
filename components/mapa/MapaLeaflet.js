"use client";

// =============================================================================
// MAPA (Leaflet + OpenStreetMap) — só no NAVEGADOR
// =============================================================================
// Por que "use client"?
// O Leaflet usa "window" (objeto do navegador). No servidor do Next.js isso
// não existe. Este arquivo é carregado com next/dynamic { ssr: false }
// em TelaMapa.js: o servidor manda um “Carregando…” e o mapa nasce no Chrome.
//
// Quem faz o quê:
//   Leaflet        → desenha o mapa, zoom, marcadores
//   OpenStreetMap  → fotos das ruas (tiles), GRÁTIS, sem chave de API
//   react-leaflet  → MapContainer, Marker… em vez de escrever Leaflet “cru”
//
// useMap() só funciona DENTRO de um <MapContainer>. Por isso FocarPonto,
// EnquadrarDenuncias e AjustarTamanhoDoMapa são componentes filhos, não
// funções soltas fora do mapa.
// =============================================================================

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Bolinha verde = pendente (!). Bolinha navy = resolvido (✓).
// L.divIcon = marcador feito de HTML/CSS, não a figurinha padrão do Leaflet.
function iconeDoStatus(status) {
  const resolvido = status === "RESOLVIDO";
  const fundo = resolvido ? "#1b263b" : "#2d6a4f";
  const texto = resolvido ? "✓" : "!";

  return L.divIcon({
    className: "marcador-denuncia",
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:${fundo};color:#fff;font-weight:700;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(27,38,59,.25);font-size:16px;
    ">${texto}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

// A pessoa clicou num cartão da lista → aproximamos AQUELE ponto.
// flyTo = anima o deslocamento (não “pula” de uma vez).
function FocarPonto({ lat, lng }) {
  const mapa = useMap();

  useEffect(() => {
    if (lat == null || lng == null) return;
    mapa.flyTo([lat, lng], 16, { duration: 0.6 });
  }, [lat, lng, mapa]);

  return null;
}

// Botão "Centralizar" na TelaMapa: cada clique soma 1 em "disparo".
// fitBounds = “cabe todo mundo na foto”: o Leaflet escolhe o zoom.
// padding = folga nas bordas para o ponto não ficar colado no canto.
function EnquadrarDenuncias({ denuncias, disparo }) {
  const mapa = useMap();

  useEffect(() => {
    if (!disparo || denuncias.length === 0) return;

    const limites = L.latLngBounds(denuncias.map((d) => [d.lat, d.lng]));

    mapa.fitBounds(limites, {
      padding: [48, 48],
      maxZoom: 16,
      animate: true,
    });
  }, [disparo, denuncias, mapa]);

  return null;
}

// Se a pessoa gira o celular ou amplia a janela, o tamanho do <div> muda.
// invalidateSize avisa o Leaflet: “recalcule, senão o mapa fica cinza/cortado”.
function AjustarTamanhoDoMapa() {
  const mapa = useMap();

  useEffect(() => {
    function aoRedimensionar() {
      mapa.invalidateSize();
    }

    window.addEventListener("resize", aoRedimensionar);
    const espera = window.setTimeout(aoRedimensionar, 250);

    return () => {
      window.removeEventListener("resize", aoRedimensionar);
      window.clearTimeout(espera);
    };
  }, [mapa]);

  return null;
}

export default function MapaLeaflet({
  denuncias,
  selecionada,
  centro,
  disparoCentralizar,
}) {
  return (
    <MapContainer
      center={centro}
      zoom={14}
      className="mapa-leaflet"
      scrollWheelZoom
    >
      {/*
        {s} {z} {x} {y} = pedaços do mapa (zoom e coordenadas).
        É a API gratuita do OSM. Não precisamos de Google Maps nem de token.
      */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AjustarTamanhoDoMapa />
      <EnquadrarDenuncias denuncias={denuncias} disparo={disparoCentralizar} />
      {selecionada ? (
        <FocarPonto lat={selecionada.lat} lng={selecionada.lng} />
      ) : null}
      {denuncias.map((d) => (
        <Marker
          key={d.id}
          position={[d.lat, d.lng]}
          icon={iconeDoStatus(d.status)}
        >
          <Popup>
            <strong>{d.endereco}</strong>
            <br />
            {d.descricao}
            <br />
            {d.status} #{d.id}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
