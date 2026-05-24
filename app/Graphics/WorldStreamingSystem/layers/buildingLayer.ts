export function addBuildingLayer(
  map: any
) {
  map.addLayer({
    id: "buildings",

    type: "fill",

    source: "world",

    filter: [
      "==",
      ["geometry-type"],
      "Polygon",
    ],

    paint: {
      "fill-color": "#2a2a2a",

      "fill-opacity": 0.8,
    },
  });
}