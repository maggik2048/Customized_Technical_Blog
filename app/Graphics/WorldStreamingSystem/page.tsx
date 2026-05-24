"use client";

import WorldRenderer
  from "./components/WorldRenderer";

export default function Page() {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#111",
      }}
    >
      <WorldRenderer />
    </div>
  );
}