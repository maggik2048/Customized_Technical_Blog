"use client";

export default function CategoryInsideBackgroundRenderer() {
  const bgImage = "/images/backgrounddimage/mathdraw32.png";
  const birdsImage = "/images/backgrounddimage/birds2.png";

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

      {/* HUGE BIRDS IMAGE */}
      <div
        style={{
          position: "fixed",
          right: "-15vw",
          bottom: "-14vh",

          width: "48vw",
          height: "48vw",

          backgroundImage: `url("${birdsImage}")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          backgroundPosition: "bottom right",

          zIndex: -2,
          pointerEvents: "none",

          opacity: 0.60,

          filter: `
            drop-shadow(0 0 40px rgba(120,140,255,0.22))
            contrast(1.08)
            saturate(1.1)
          `,

          transform: "rotate(-2deg)",
        }}
      />

      {/* GRAIN */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          opacity: 0.07,
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/noise.png')",
        }}
      />
    </>
  );
}