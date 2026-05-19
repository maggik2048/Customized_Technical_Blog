"use client";

export default function CategoryInsideBackgroundRenderer() {
  const bgImage = "/images/mathdraw32.png";

  return (
    <>
      {/* BASE BACKGROUND */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scale(1.02)",
          zIndex: -6,
        }}
      />

      {/* INVERT LAYER */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: "scale(1.02)",

          filter: `
            invert(1)
            hue-rotate(200deg)
            saturate(1.6)
            contrast(1.15)
            brightness(0.88)
            sepia(0.05)
          `,

          opacity: 0.92,
          zIndex: -5,
          pointerEvents: "none",

          /*
            전체 invert 영역 자체를 아래로 확장.
            단순 시작점만 내린 게 아니라
            전체 gradient curve 를 통째로 아래로 이동시킴.
          */
          maskImage: `
            linear-gradient(
              to top,
              rgba(0,0,0,0.10) 0%,
              rgba(0,0,0,0.06) 10%,
              rgba(0,0,0,0.18) 22%,
              rgba(0,0,0,0.80) 52%,
              rgba(0,0,0,0.88) 58%,
              rgba(0,0,0,0.97) 78%,
              rgba(0,0,0,1) 100%
            )
          `,

          WebkitMaskImage: `
            linear-gradient(
              to top,
              rgba(0,0,0,0.10) 0%,
              rgba(0,0,0,0.26) 10%,
              rgba(0,0,0,0.48) 22%,
              rgba(0,0,0,0.70) 38%,
              rgba(0,0,0,0.88) 58%,
              rgba(0,0,0,0.97) 78%,
              rgba(0,0,0,1) 100%
            )
          `,
        }}
      />

      {/* CLAMP LAYER */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -4,
          pointerEvents: "none",

          background: `
            linear-gradient(
              to top,
              rgba(255,255,255,0.03) 0%,
              rgba(220,225,240,0.12) 20%,
              rgba(170,180,210,0.20) 42%,
              rgba(120,130,170,0.34) 68%,
              rgba(107,110,135,0.56) 100%
            )
          `,

          mixBlendMode: "lighten",
        }}
      />

      {/* DEPTH */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -3,
          pointerEvents: "none",

          background: `
            radial-gradient(
              circle at 85% 50%,
              rgba(80, 85, 122, 0.35),
              transparent 60%
            )
          `,

          mixBlendMode: "screen",
        }}
      />

      {/* GRAIN */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -2,
          opacity: 0.07,
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/noise.png')",
        }}
      />
    </>
  );
}