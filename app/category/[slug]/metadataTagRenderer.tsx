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

        pointerEvents: "none",

        zIndex: 1,

        overflow: "hidden",
      }}
    >
      {/* MAIN POLYGON */}
      <div
        style={{
          position: "absolute",

          inset: 0,

          clipPath:
            "polygon(32% 0%, 100% 0%, 100% 100%, 0% 100%)",

          background: `
            linear-gradient(
              to right,
              rgba(232,228,220,0.82) 0%,
              rgba(214,210,202,0.72) 52%,
              rgba(244,242,238,0.88) 100%
            )
          `,

          border:
            "1px solid rgba(255,248,235,0.14)",

          boxShadow: `
            0 0 18px rgba(255,245,220,0.04),
            inset 0 0 14px rgba(255,255,255,0.08)
          `,

          opacity: 0.82,

          backdropFilter: "blur(10px)",
        }}
      />

      {/* INNER HIGHLIGHT */}
      <div
        style={{
          position: "absolute",

          top: 6,
          bottom: 6,
          left: 52,
          right: 8,

          clipPath:
            "polygon(24% 0%, 100% 0%, 100% 100%, 0% 100%)",

          border:
            "1px solid rgba(255,255,255,0.08)",

          opacity: 0.34,
        }}
      />

      {/* DIAGONAL TECH LINE 1 */}
      <div
        style={{
          position: "absolute",

          width: 180,
          height: 1,

          right: 10,
          top: 12,

          background:
            "rgba(255,255,255,0.12)",

          transform: "rotate(-18deg)",

          transformOrigin: "right center",
        }}
      />

      {/* DIAGONAL TECH LINE 2 */}
      <div
        style={{
          position: "absolute",

          width: 140,
          height: 1,

          right: 18,
          bottom: 10,

          background:
            "rgba(255,255,255,0.08)",

          transform: "rotate(-18deg)",

          transformOrigin: "right center",
        }}
      />

      {/* CENTER GLOW */}
      <div
        style={{
          position: "absolute",

          right: 36,
          top: "50%",

          width: 80,
          height: 80,

          transform: "translateY(-50%)",

          borderRadius: "50%",

          background:
            "radial-gradient(circle, rgba(255,255,255,0.08), transparent 72%)",

          filter: "blur(14px)",

          opacity: 0.55,
        }}
      />

      {/* MICRO LABEL */}
      <div
        style={{
          position: "absolute",

          right: 28,
          top: 8,

          fontSize: 8,

          letterSpacing: "0.24em",

          textTransform: "uppercase",

          color:
            "rgba(90,90,90,0.34)",

          fontWeight: 700,
        }}
      >
        META
      </div>
    </div>
  );
}