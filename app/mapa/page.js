// Rota: /mapa
// Pasta app/mapa + page.js = URL /mapa.
//
// MVP: tela de mapa com os pontos das denúncias (pode ser lista + mapa simples).
// Stack prevista: Leaflet + OpenStreetMap (ainda não instalados neste passo).

import PlaceholderTela from "../../components/PlaceholderTela";

export const metadata = {
  title: "Mapa de denúncias",
};

export default function PaginaMapa() {
  // Quem for fazer o mapa: Leaflet entra neste arquivo (depois de instalar a lib).
  return (
    <PlaceholderTela
      titulo="Mapa"
      descricao="Pontos das denúncias em lista + mapa simples."
    />
  );
}
