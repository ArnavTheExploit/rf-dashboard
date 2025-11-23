import * as L from "leaflet";

declare module "leaflet" {
  function heatLayer(
    latlngs: L.LatLngExpression[] | [number, number, number][],
    options?: any
  ): L.Layer;
}
