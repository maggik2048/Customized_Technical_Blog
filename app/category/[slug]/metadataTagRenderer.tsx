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
      {/* OUTER POLYGON FRAME */}
      <div
        style={{
          position: "absolute",

          inset: 0,

          clipPath:
            "polygon(32% 0%, 100% 0%, 100% 100%, 0% 100%)",

          border:
            "1.4px solid rgba(255,220,140,0.72)",

          background: "transparent",

          boxShadow: `
            0 0 18px rgba(255,210,120,0.10),
            inset 0 0 18px rgba(255,230,160,0.04)
          `,

          backdropFilter: "blur(8px)",

          WebkitBackdropFilter:
            "blur(8px)",
        }}
      />

      {/* INNER POLYGON FRAME */}
      <div
        style={{
          position: "absolute",

          top: 7,
          bottom: 7,
          left: 56,
          right: 8,

          clipPath:
            "polygon(24% 0%, 100% 0%, 100% 100%, 0% 100%)",

          border:
            "1px solid rgba(255,240,200,0.34)",

          opacity: 0.7,
        }}
      />

      {/* TOP GOLD LINE */}
      <div
        style={{
          position: "absolute",

          right: 8,
          top: 7,

          width: 148,
          height: 1,

          background:
            "linear-gradient(to right, transparent, rgba(255,220,140,0.55))",

          transform: "rotate(-17deg)",

          transformOrigin: "right center",

          opacity: 0.9,
        }}
      />

      {/* BOTTOM GOLD LINE */}
      <div
        style={{
          position: "absolute",

          right: 14,
          bottom: 8,

          width: 128,
          height: 1,

          background:
            "linear-gradient(to right, transparent, rgba(255,235,180,0.32))",

          transform: "rotate(-17deg)",

          transformOrigin: "right center",

          opacity: 0.7,
        }}
      />

      {/* SIDE ACCENT */}
      <div
        style={{
          position: "absolute",

          right: 0,
          top: 0,
          bottom: 0,

          width: 2,

          background: `
            linear-gradient(
              to bottom,
              rgba(255,230,170,0.0),
              rgba(255,220,140,0.52),
              rgba(255,240,200,0.0)
            )
          `,

          opacity: 0.8,
        }}
      />

      {/* MICRO TECH CORNER */}
      <div
        style={{
          position: "absolute",

          right: 22,
          top: 10,

          width: 18,
          height: 18,

          borderTop:
            "1px solid rgba(255,225,160,0.42)",

          borderRight:
            "1px solid rgba(255,225,160,0.42)",

          opacity: 0.7,
        }}
      />

      {/* LABEL */}
      <div
        style={{
          position: "absolute",

          right: 28,
          top: 8,

          fontSize: 8,

          letterSpacing: "0.26em",

          textTransform: "uppercase",

          color:
            "rgba(255,228,170,0.55)",

          fontWeight: 700,

          textShadow:
            "0 0 10px rgba(255,220,140,0.10)",
        }}
      >
        META
      </div>
    </div>
  );
}