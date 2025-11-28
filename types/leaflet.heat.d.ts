import * as L from "leaflet";

declare module "leaflet" {
  interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: Record<number, string>;
  }

  function heatLayer(
    latlngs: L.LatLngExpression[] | [number, number, number][],
    options?: HeatLayerOptions
  ): L.Layer;
}

declare module 'leaflet.heat' {
  const content: void;
  export default content;
}
