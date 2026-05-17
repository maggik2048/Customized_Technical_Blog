"use client";

import React from "react";

type Props = {
  globalIndex?: number;

  localIndex?: number;

  localTotal?: number;

  category?: string;
};

function DiamondIndex({
  value,
}: {
  value?: number;
}) {
  return (
    <div
      style={{
        position: "relative",

        width: 112,

        height: 112,

        display: "flex",

        alignItems: "center",

        justifyContent: "center",
      }}
    >
      {/* OUTER DIAMOND */}
      <div
        style={{
          position: "absolute",

          inset: 0,

          transform: "rotate(45deg)",

          border:
            "1.5px solid rgba(255,220,140,0.78)",

          background:
            "linear-gradient(to bottom, rgba(255,235,180,0.12), rgba(120,80,20,0.08))",

          boxShadow: `
            0 0 24px rgba(255,210,120,0.18),
            inset 0 0 22px rgba(255,230,160,0.08)
          `,

          backdropFilter:
            "blur(12px)",
        }}
      />

      {/* INNER DIAMOND */}
      <div
        style={{
          position: "absolute",

          width: 74,

          height: 74,

          transform: "rotate(45deg)",

          border:
            "1px solid rgba(255,240,200,0.4)",
        }}
      />

      {/* NUMBER */}
      <div
        style={{
          position: "relative",

          zIndex: 2,

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 10,

            letterSpacing: "0.32em",

            textTransform: "uppercase",

            color:
              "rgba(255,228,170,0.75)",

            marginBottom: 6,

            fontWeight: 700,
          }}
        >
          Global
        </div>

        <div
          style={{
            fontSize: 42,

            fontWeight: 900,

            lineHeight: 1,

            color: "#fff7df",

            textShadow:
              "0 0 18px rgba(255,220,120,0.35)",
          }}
        >
          {String(value)}
        </div>
      </div>
    </div>
  );
}

function MinimalStat({
  label,

  value,

  color = "#ffffff",
}: {
  label: string;

  value?: number | string;

  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",

        flexDirection: "column",

        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 10,

          letterSpacing: "0.22em",

          textTransform: "uppercase",

          color:
            "rgba(255,255,255,0.48)",

          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 30,

          fontWeight: 800,

          color,

          lineHeight: 1,
        }}
      >
        {String(value)}
      </div>
    </div>
  );
}

export default function PDFPageIndexPanel({
  globalIndex,

  localIndex,

  localTotal,

  category,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",

        top: 34,

        left: 38,

        zIndex: 100,

        display: "flex",

        flexDirection: "column",

        gap: 28,
      }}
    >
      {/* HERO GLOBAL INDEX */}
      <DiamondIndex
        value={globalIndex}
      />

      {/* OTHER STATS */}
      <div
        style={{
          display: "flex",

          flexDirection: "column",

          gap: 18,

          paddingLeft: 4,
        }}
      >
        <MinimalStat
          label="Local Index"
          value={localIndex}
          color="#9ef7ea"
        />

        <MinimalStat
          label="Total In Category"
          value={localTotal}
          color="#f6d58f"
        />

        <div
          style={{
            display: "flex",

            flexDirection: "column",

            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 10,

              letterSpacing:
                "0.22em",

              textTransform:
                "uppercase",

              color:
                "rgba(255,255,255,0.45)",

              fontWeight: 700,
            }}
          >
            Category
          </div>

          <div
            style={{
              fontSize: 18,

              fontWeight: 700,

              color:
                "rgba(255,255,255,0.92)",

              lineHeight: 1.2,

              maxWidth: 240,
            }}
          >
            {category}
          </div>
        </div>
      </div>
    </div>
  );
}