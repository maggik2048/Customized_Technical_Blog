"use client";

import { useCastShadowFilter } from "@/app/context/CastShadowFilterContext";

export default function PunchFilterOverlay() {
  const { filterOn } = useCastShadowFilter();

  if (!filterOn) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        pointerEvents: "none",

        // ✔️ 핵심: 대비만
        backdropFilter: "contrast(1.3)",
        WebkitBackdropFilter: "contrast(1.3)",

        // ✔️ 보조로 약간만 (선택)
        background: "rgba(0,0,0,0.02)",
      }}
    />
  );
}