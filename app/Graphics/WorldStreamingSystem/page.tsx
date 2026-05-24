"use client";

import RoadMap from "./RoadMap";

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

      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 9999,
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          padding: "12px 18px",
          borderRadius: "10px",
          background:
            "rgba(0,0,0,0.55)",
          backdropFilter:
            "blur(6px)",
        }}
      >
        World Streaming System
      </div>

      <RoadMap />

    </div>

  );
}