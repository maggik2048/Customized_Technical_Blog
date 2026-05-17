"use client";

import React from "react";

type Props = {
  globalIndex?: number;

  localIndex?: number;

  localTotal?: number;

  category?: string;
};

const glassStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.52)",

  backdropFilter: "blur(20px)",

  WebkitBackdropFilter: "blur(20px)",

  borderRadius: 18,

  boxShadow:
    "0 10px 35px rgba(0,0,0,0.35)",

  border:
    "1px solid rgba(255,255,255,0.12)",
};

function StatButton({
  label,

  value,

  color = "#fff",

  size = 36,
}: {
  label: string;

  value: string;

  color?: string;

  size?: number;
}) {
  return (
    <div
      style={{
        ...glassStyle,

        padding: "14px 22px",

        display: "flex",

        flexDirection: "column",

        gap: 4,
      }}
    >
      <span
        style={{
          fontSize: 11,

          letterSpacing: "0.18em",

          textTransform: "uppercase",

          color: "rgba(255,255,255,0.6)",

          fontWeight: 700,
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: size,

          fontWeight: 900,

          lineHeight: 1,

          color,
        }}
      >
        {value}
      </span>
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

        top: 28,

        left: 36,

        zIndex: 100,

        display: "flex",

        flexDirection: "column",

        gap: 12,

        width: 260,
      }}
    >
      <StatButton
        label="Global Index"
        value={String(globalIndex)}
        color="#ffffff"
        size={42}
      />

      <StatButton
        label="Local Index"
        value={String(localIndex)}
        color="#7df9ff"
        size={42}
      />

      <StatButton
        label="Total In Category"
        value={String(localTotal)}
        color="#ffd166"
        size={30}
      />

      <div
        style={{
          ...glassStyle,

          padding: "12px 18px",
        }}
      >
        <div
          style={{
            fontSize: 10,

            letterSpacing: "0.16em",

            textTransform: "uppercase",

            color: "rgba(255,255,255,0.55)",

            marginBottom: 6,

            fontWeight: 700,
          }}
        >
          Category
        </div>

        <div
          style={{
            fontSize: 18,

            fontWeight: 700,

            color: "#fff",

            lineHeight: 1.2,
          }}
        >
          {category}
        </div>
      </div>
    </div>
  );
}