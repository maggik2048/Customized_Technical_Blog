import { create } from "zustand";
import type { Feature } from "geojson";

// Define and export the WorldFeature type
export type WorldFeature = Feature;

type WorldState = {
  features: WorldFeature[];
  setFeatures: (features: WorldFeature[]) => void;
};

export const useWorldStore = create<WorldState>((set) => ({
  features: [],
  setFeatures: (features) => set({ features }),
}));