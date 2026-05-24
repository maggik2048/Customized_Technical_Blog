import { create } from "zustand";
import type { Feature } from "geojson";

type WorldState = {
  features: Feature[];
  setFeatures: (features: Feature[]) => void;
};

export const useWorldStore = create<WorldState>((set) => ({
  features: [],
  setFeatures: (features) => set({ features }),
}));