import { WorldFeature } from "../state/worldStore";

export const initialWorld: WorldFeature[] = [
  {
    id: "road_001",
    type: "Feature",
    properties: {
      name: "Main Road",
      roadClass: "arterial",
      lanesForward: 2,
      lanesBackward: 2,
      speedLimit: 60,
      debugColor: "#ff5533",
    },
    geometry: {
      type: "LineString",
      coordinates: [
        [128.585, 35.152],
        [128.587, 35.153],
        [128.590, 35.155],
      ],
    },
  },
  {
    id: "node_001",
    type: "Feature",
    properties: {
      featureType: "intersection",
    },
    geometry: {
      type: "Point",
      coordinates: [128.587, 35.153],
    },
  },
];