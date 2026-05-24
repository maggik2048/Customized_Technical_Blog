export function addDistrictLayer(map: any) {
  map.addLayer({
    id: "district-fill",
    type: "fill",
    source: "world",

    filter: [
      "==",
      ["geometry-type"],
      "Polygon",
    ],

    paint: {
      "fill-color": "#2c5cff",
      "fill-opacity": 0.15,
    },
  });
}