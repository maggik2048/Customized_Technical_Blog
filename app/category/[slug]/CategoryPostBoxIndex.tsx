"use client";

export default function CategoryPostBoxIndex({
  categoryIndex,
  globalIndex,
  localTotal,
  isSimple,
}: {
  categoryIndex: number;

  globalIndex: number;

  localTotal: number;

  isSimple: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",

        left: 8,
        top: "50%",

        transform: "translateY(-50%)",

        zIndex: 20,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        gap: 4,

        minWidth: 42,

        fontSize: 9,

        letterSpacing: "0.08em",

        pointerEvents: "none",

        color: isSimple
          ? "rgba(60,60,60,0.65)"
          : "rgba(255,255,255,0.82)",

        textAlign: "center",
      }}
    >
      {/* LOCAL */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          lineHeight: 1,
        }}
      >
        <div
          style={{
            fontSize: 8,
            opacity: 0.55,

            marginBottom: 2,

            letterSpacing: "0.14em",
          }}
        >
          LOCAL
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {categoryIndex}

          <span
            style={{
              opacity: 0.45,
              margin: "0 2px",
            }}
          >
            /
          </span>

          <span
            style={{
              opacity: 0.72,
            }}
          >
            {localTotal}
          </span>
        </div>
      </div>

      {/* GLOBAL */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",

          marginTop: 2,

          lineHeight: 1,
        }}
      >
        <div
          style={{
            fontSize: 8,
            opacity: 0.5,

            marginBottom: 2,

            letterSpacing: "0.14em",
          }}
        >
          GLOBAL
        </div>

        <div
          style={{
            fontSize: 11,
            fontWeight: 600,

            opacity: 0.82,
          }}
        >
          #{globalIndex}
        </div>
      </div>
    </div>
  );
}