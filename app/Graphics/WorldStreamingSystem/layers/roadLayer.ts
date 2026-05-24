export function addRoadLayer(
  map: any
) {
  map.addLayer({
    id: "roads",

    type: "line",

    source: "world",

    filter: [
      "==",
      ["geometry-type"],
      "LineString",
    ],

    paint: {
      "line-color": [
        "match",
        ["get", "highway"],

        "motorway",
        "#ff8844",

        "primary",
        "#ffcc44",

        "#888888",
      ],

      "line-width": [
        "match",
        ["get", "highway"],

        "motorway",
        6,

        "primary",
        4,

        2,
      ],
    },
  });
}