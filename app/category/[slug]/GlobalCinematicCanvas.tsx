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
        zIndex: 999999,
        pointerEvents: "none",

        backdropFilter: "contrast(1.35) saturate(1.1)",
        WebkitBackdropFilter: "contrast(1.35) saturate(1.1)",

        background: "rgba(0,0,0,0.03)",
      }}
    >
      {/* TOP BLACK VIGNETTE */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "12vh",

          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0))",

          // 자연스러운 퍼짐
          filter: "blur(18px)",

          opacity: 0.05,
        }}
      />

      {/* BOTTOM WHITE FADE + IMAGE MASK */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "25vh",

          background:
            "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",

          maskImage: `
            linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)),
            url("/images/abstractsubtle1.jpg")
          `,
          WebkitMaskImage: `
            linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0)),
            url("/images/abstractsubtle1.jpg")
          `,

          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",

          maskSize: "cover",
          WebkitMaskSize: "cover",

          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",

          maskPosition: "bottom",
          WebkitMaskPosition: "bottom",

          opacity: 0.71,
        }}
      />
    </div>
  );
}