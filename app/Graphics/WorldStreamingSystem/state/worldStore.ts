import { create } from "zustand";

/**
 * =========================
 * FEATURE TYPES
 * =========================
 */

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

/**
 * =========================
 * GRAPH STRUCTURE (NEW)
 * =========================
 * roadId → connected intersection/road ids
 */
type WorldGraph = {
  adjacency: Record<string, string[]>;
};

/**
 * =========================
 * WORLD STATE
 * =========================
 */
type WorldState = {
  features: WorldFeature[];

  graph: WorldGraph;

  // =========================
  // MUTATIONS
  // =========================

  addRoad: (road: RoadFeature) => void;
  removeFeature: (id: string) => void;
  updateRoad: (id: string, road: Partial<RoadFeature>) => void;

  addIntersection: (node: IntersectionFeature) => void;

  // graph operations (engine upgrade)
  connect: (a: string, b: string) => void;
  disconnect: (a: string, b: string) => void;
};

/**
 * =========================
 * STORE IMPLEMENTATION
 * =========================
 */
export const useWorldStore = create<WorldState>((set, get) => ({
  features: [],

  graph: {
    adjacency: {},
  },

  /**
   * ADD ROAD
   */
  addRoad: (road) =>
    set((state) => ({
      features: [...state.features, road],
    })),

  /**
   * REMOVE FEATURE
   */
  removeFeature: (id) =>
    set((state) => ({
      features: state.features.filter((f) => f.id !== id),
    })),

  /**
   * UPDATE ROAD
   */
  updateRoad: (id, road) =>
    set((state) => ({
      features: state.features.map((f) =>
        f.id === id ? { ...f, ...road } : f
      ),
    })),

  /**
   * ADD INTERSECTION
   */
  addIntersection: (node) =>
    set((state) => ({
      features: [...state.features, node],
    })),

  /**
   * CONNECT GRAPH (NEW CORE ENGINE FEATURE)
   */
  connect: (a, b) =>
    set((state) => {
      const adj = { ...state.graph.adjacency };

      if (!adj[a]) adj[a] = [];
      if (!adj[b]) adj[b] = [];

      if (!adj[a].includes(b)) adj[a].push(b);
      if (!adj[b].includes(a)) adj[b].push(a);

      return {
        graph: {
          adjacency: adj,
        },
      };
    }),

  /**
   * DISCONNECT GRAPH
   */
  disconnect: (a, b) =>
    set((state) => {
      const adj = { ...state.graph.adjacency };

      if (adj[a]) adj[a] = adj[a].filter((x) => x !== b);
      if (adj[b]) adj[b] = adj[b].filter((x) => x !== a);

      return {
        graph: {
          adjacency: adj,
        },
      };
    }),
}));