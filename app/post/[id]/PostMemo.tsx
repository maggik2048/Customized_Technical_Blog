"use client";

export default function PostMemo() {
  return (
    <div
      style={{
        width: 240,
        height: 110,

        position: "relative",

        clipPath: `
          polygon(
            0% 0%,
            84% 0%,
            100% 50%,
            84% 100%,
            0% 100%,
            8% 50%
          )
        `,

        background: `
          linear-gradient(
            135deg,
            rgba(255,255,255,0.96),
            rgba(236,240,255,0.84)
          )
        `,

        border: "1px solid rgba(255,255,255,0.92)",

        boxShadow: `
          0 0 30px rgba(255,255,255,0.22),
          0 0 90px rgba(170,190,255,0.14),
          inset 0 0 26px rgba(255,255,255,0.75)
        `,

        backdropFilter: "blur(12px)",

        overflow: "hidden",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        paddingLeft: 28,
        paddingRight: 42,

        color: "rgba(35,35,45,0.92)",

        fontFamily: "serif",
      }}
    >
      {/* ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,

          background: `
            radial-gradient(
              circle at 20% 50%,
              rgba(255,255,255,0.55),
              transparent 58%
            )
          `,

          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* upper line */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 16,
          right: 16,
          height: 1,

          background: `
            linear-gradient(
              to right,
              transparent,
              rgba(255,255,255,0.9),
              transparent
            )
          `,
        }}
      />

      {/* lower line */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 16,
          right: 16,
          height: 1,

          background: `
            linear-gradient(
              to right,
              transparent,
              rgba(255,255,255,0.65),
              transparent
            )
          `,
        }}
      />

      {/* texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,

          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/noise.png')",
        }}
      />

      {/* content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.28em",
            color: "rgba(90,100,130,0.78)",
            marginBottom: 8,
          }}
        >
          ENTRY DATA
        </div>

        <div
          style={{
            fontSize: 14,
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          LVL . 07
        </div>

        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.16em",
            color: "rgba(70,70,80,0.72)",
          }}
        >
          RANK / AETHER
        </div>
      </div>

      {/* right glyph */}
      <div
        style={{
          position: "absolute",
          right: 16,
          top: "50%",
          transform: "translateY(-50%)",

          fontSize: 20,
          letterSpacing: "0.12em",

          color: "rgba(110,120,170,0.72)",

          textShadow: `
            0 0 12px rgba(255,255,255,0.7)
          `,
        }}
      >
        |=
      </div>

      {/* corner shine */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,

          width: 90,
          height: 90,

          borderRadius: "50%",

          background: `
            radial-gradient(
              circle,
              rgba(255,255,255,0.35),
              transparent 70%
            )
          `,

          pointerEvents: "none",
        }}
      />
    </div>
  );
}