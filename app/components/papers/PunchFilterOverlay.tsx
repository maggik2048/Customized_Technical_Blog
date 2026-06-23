"use client";

import { useCastShadowFilter } from "@/app/contexts/CastShadowFilterContext";

export default function PunchFilterOverlay() {
  const { filterOn } = useCastShadowFilter();

  if (!filterOn) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 4,
        mixBlendMode: "overlay",
        background: "rgba(0,0,0,0.08)",
      }}
    />
  );
}