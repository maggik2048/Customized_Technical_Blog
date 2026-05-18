"use client";

export default function MetadataTagRenderer() {
  return (
    <div
      style={{
        position: "absolute",

        right: -6,
        top: 0,

        width: 220,
        height: "100%",

        background:
          "rgba(255,255,255,0.92)",

        clipPath:
          "polygon(32% 0%, 100% 0%, 100% 100%, 0% 100%)",

        zIndex: 1,

        pointerEvents: "none",

        opacity: 0.88,
      }}
    />
  );
}