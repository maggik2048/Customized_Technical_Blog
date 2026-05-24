import { create } from "zustand";

export type WorldFeature =
  GeoJSON.Feature;

type WorldState = {
  features: WorldFeature[];

  setFeatures: (
    features: WorldFeature[]
  ) => void;
};

export const useWorldStore =
  create<WorldState>((set) => ({
    features: [],

    setFeatures: (features) =>
      set({
        features,
      }),
  }));