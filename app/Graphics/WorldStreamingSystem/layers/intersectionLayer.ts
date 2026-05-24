export function addIntersectionLayer(map: any) {
  map.addLayer({
    id: "intersection-points",
    type: "circle",
    source: "world",

    filter: [
      "==",
      ["geometry-type"],
      "Point",
    ],

    paint: {
      "circle-radius": 6,
      "circle-color": "#ffffff",
      "circle-stroke-color": "#000000",
      "circle-stroke-width": 2,
    },
  });
}