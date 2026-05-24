import { create } from "zustand";

export type RoadFeature = {
  id: string;
  type: "Feature";
  properties: {
    name: string;
    roadClass: "highway" | "arterial" | "residential";
    lanesForward: number;
    lanesBackward: number;
    speedLimit: number;
    debugColor: string;
  };
  geometry: {
    type: "LineString";
    coordinates: number[][];
  };
};

export type IntersectionFeature = {
  id: string;
  type: "Feature";
  properties: {
    featureType: "intersection";
  };
  geometry: {
    type: "Point";
    coordinates: number[];
  };
};

export type WorldFeature = RoadFeature | IntersectionFeature;

type WorldState = {
  features: WorldFeature[];

  // actions (mutation layer)
  addRoad: (road: RoadFeature) => void;
  removeFeature: (id: string) => void;
  updateRoad: (id: string, road: Partial<RoadFeature>) => void;

  addIntersection: (node: IntersectionFeature) => void;
};

export const useWorldStore = create<WorldState>((set) => ({
  features: [],

  addRoad: (road) =>
    set((state) => ({
      features: [...state.features, road],
    })),

  removeFeature: (id) =>
    set((state) => ({
      features: state.features.filter((f) => f.id !== id),
    })),

  updateRoad: (id, road) =>
    set((state) => ({
      features: state.features.map((f) =>
        f.id === id ? { ...f, ...road } : f
      ),
    })),

  addIntersection: (node) =>
    set((state) => ({
      features: [...state.features, node],
    })),
}));