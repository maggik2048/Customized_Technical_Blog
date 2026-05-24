export const worldGeoJson = {
  type: "FeatureCollection",

  name: "WorldStreamingSystem",

  crs: {
    type: "name",
    properties: {
      name: "EPSG:4326",
    },
  },

  features: [
    {
      type: "Feature",
      id: "road_main_001",
      properties: {
        name: "Main Road",
        roadClass: "arterial",
        lanesForward: 3,
        lanesBackward: 3,
        speedLimit: 80,
        debugColor: "#ff5533",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [128.585, 35.152, 12.5],
          [128.587, 35.153, 13.1],
          [128.590, 35.155, 14.8],
        ],
      },
    },

    {
      type: "Feature",
      id: "road_side_001",
      properties: {
        name: "Side Road",
        roadClass: "residential",
        lanesForward: 1,
        lanesBackward: 1,
        speedLimit: 30,
        debugColor: "#33ffaa",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [128.587, 35.153, 13.1],
          [128.588, 35.150, 11.7],
        ],
      },
    },

    {
      type: "Feature",
      id: "intersection_001",
      properties: {
        featureType: "intersection",
      },
      geometry: {
        type: "Point",
        coordinates: [128.587, 35.153, 13.1],
      },
    },

    {
      type: "Feature",
      id: "district_001",
      properties: {
        featureType: "district",
        name: "Central District",
        zoning: "commercial",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [128.580, 35.150],
            [128.600, 35.150],
            [128.600, 35.165],
            [128.580, 35.165],
            [128.580, 35.150],
          ],
        ],
      },
    },
  ],
};