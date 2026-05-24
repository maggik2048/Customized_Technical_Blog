"use client";

import WorldRenderer from "./components/WorldRenderer";
import { ExportWorldData } from "./components/ExportWorldData";

import { useWorldStore } from "./state/worldStore";

export default function Page() {
  const features = useWorldStore(
    (s) => s.features
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#111",
        position: "relative",
      }}
    >
      <WorldRenderer />

      <ExportWorldData
        features={features}
      />
    </div>
  );
}