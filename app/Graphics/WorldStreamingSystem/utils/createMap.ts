import maplibregl from "maplibre-gl";

export function createMap(container: HTMLDivElement) {
  return new maplibregl.Map({
    container,
    style: "https://demotiles.maplibre.org/style.json",
    center: [128.587, 35.152],
    zoom: 15,
    pitch: 45,
    bearing: -10,
  });
}