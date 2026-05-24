export function addRoadLayer(map: any) {
  map.addLayer({
    id: "road-lines",
    type: "line",
    source: "world",

    filter: [
      "any",
      ["==", ["geometry-type"], "LineString"],
    ],

    paint: {
      "line-color": ["get", "debugColor"],
      "line-width": [
        "case",
        ["==", ["get", "roadClass"], "arterial"], 8,
        ["==", ["get", "roadClass"], "residential"], 4,
        2,
      ],
    },
  });
}