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

        backdropFilter: "contrast(1.35) saturate(1.1)",
        WebkitBackdropFilter: "contrast(1.35) saturate(1.1)",

        background: "rgba(0,0,0,0.03)",
      }}
    >
      {/* bottom white fade + strong image mask */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "25vh",

          background:
            "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",

          //  핵심: mask 강화 (대비 강제 증가)
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

          opacity: 1,
        }}
      />
    </div>
  );
}