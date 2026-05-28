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
            "1px solid rgba(255, 250, 236, 0.59)",
        }}
      />

      {/* CONTENT */}
      <div
        style={{
          position: "relative",

          zIndex: 2,

          display: "flex",

          flexDirection: "column",

          alignItems: "center",
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

            textShadow:
              "0 2px 10px rgba(0,0,0,0.45)",
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
              "0 0 18px rgba(255,220,120,0.35), 0 4px 18px rgba(0,0,0,0.42)",
          }}
        >
          {String(value)}
        </div>
      </div>
    </div>
  );
}

function LocalProgress({
  current,

  total,
}: {
  current?: number;

  total?: number;
}) {
  return (
    <div
      style={{
        display: "flex",

        flexDirection: "column",

        gap: 8,

        paddingLeft: 2,
      }}
    >
      {/* LABEL */}
      <div
        style={{
          fontSize: 10,

          letterSpacing: "0.22em",

          textTransform: "uppercase",

          color:
            "rgb(255, 255, 255)",

          fontWeight: 700,

          marginLeft: -32,

          textShadow:
            "0 2px 10px rgba(0,0,0,0.745)",
        }}
      >
        Local Index
      </div>

      {/* INLINE FRACTION */}
      <div
        style={{
          display: "flex",

          alignItems: "flex-end",

          gap: 6,
        }}
      >
        {/* CURRENT */}
        <div
          style={{
            fontSize: 52,

            fontWeight: 900,

            lineHeight: 0.9,

            color: "#dbf4ee",

            textShadow:
              "0 0 18px rgba(170,235,220,0.12), 0 4px 18px rgba(0,0,0,0.42)",
          }}
        >
          {String(current)}
        </div>

        {/* SLASH */}
        <div
          style={{
            fontSize: 42,

            fontWeight: 200,

            lineHeight: 1,

            color:
              "rgba(255,255,255,0.28)",

            paddingBottom: 4,

            textShadow:
              "0 4px 14px rgba(0,0,0,0.42)",
          }}
        >
          /
        </div>

        {/* TOTAL */}
        <div
          style={{
            fontSize: 38,

            fontWeight: 800,

            lineHeight: 0.95,

            color: "#f6d58f",

            textShadow:
              "0 0 16px rgba(255,210,120,0.14), 0 4px 18px rgba(0,0,0,0.42)",

            paddingBottom: 2,
          }}
        >
          {String(total)}
        </div>
      </div>

      {/* SUB LABEL */}
      <div
        style={{
          fontSize: 10,

          letterSpacing: "0.18em",

          textTransform: "uppercase",

          color:
            "rgb(255, 255, 255)",

          fontWeight: 1700,

          marginTop: -1,

          paddingLeft: 12,

          textShadow:
            "0 2px 10px rgba(0,0,0,0.85)",
        }}
      >
        Total In Category
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

        gap: 14,

        alignItems: "flex-start",
      }}
    >
      {/* GLOBAL */}
      <DiamondIndex
        value={globalIndex}
      />

      {/* CATEGORY */}
      <div
        style={{
          width: 112,

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          justifyContent: "center",

          gap: 6,

          marginTop: 16,

          textAlign: "center",
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
              "rgb(255, 255, 255)",

            fontWeight: 1700,

            textShadow:
              "0 2px 10px rgba(0,0,0,0.45)",
          }}
        >
          Category
        </div>

        <div
          style={{
            fontSize: 24,

            fontWeight: 700,

            color:
              "rgb(255, 255, 255)",

            lineHeight: 1.2,

            maxWidth: 180,

            textShadow:
              "0 3px 14px rgba(0,0,0,0.48)",
          }}
        >
          {category}
        </div>
      </div>

      {/* LOCAL / TOTAL */}
      <div
        style={{
          marginTop: -6,
        }}
      >
        <LocalProgress
          current={localIndex}
          total={localTotal}
        />
      </div>
    </div>
  );
}