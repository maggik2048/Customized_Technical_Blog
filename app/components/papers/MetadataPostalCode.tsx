// app/components/papers/MetadataPostalCode.tsx

"use client";

import React from "react";

import { Cormorant_SC } from "next/font/google";

const cormorant = Cormorant_SC({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

type Props = {
  data: any;
  isDark: boolean;
};

export default function MetadataPostalCode({
  data,
  isDark,
}: Props) {
  const createdDate = data.created_at
    ? new Date(data.created_at)
    : null;

  const dateString = createdDate
    ? createdDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const timeString = createdDate
    ? createdDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 18,
        marginTop: 20,
        marginBottom: 32,
      }}
    >
      {/* GOLDEN RATIO */}
      <img
        src="/images/headers/goldenratio.jpg"
        alt="golden ratio"
        style={{
          width: 135,
          height: 135,
          objectFit: "contain",
          opacity: isDark ? 0.9 : 0.82,
          flexShrink: 0,
        }}
      />

      {/* STAMP */}
      <div
        style={{
          position: "relative",
          padding: "12px 14px",
          border: "2px solid rgba(35,75,170,0.72)",
          borderRadius: 3,
          transform: "rotate(-1.1deg)",
          overflow: "hidden",
          width: "fit-content",
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
          boxShadow: `
            0 0 1px rgba(35,75,170,0.65),
            0 0 4px rgba(35,75,170,0.12),
            inset 0 0 10px rgba(35,75,170,0.06)
          `,
        }}
      >
        {/* INK BLEED */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(circle at 20% 20%, rgba(35,75,170,0.12), transparent 35%),
              radial-gradient(circle at 80% 70%, rgba(35,75,170,0.08), transparent 30%)
            `,
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }}
        />

        {/* BORDER NOISE */}
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.35,
          }}
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="2"
            />
            <feDisplacementMap
              in="SourceGraphic"
              scale="1.4"
            />
          </filter>

          <rect
            x="2"
            y="2"
            width="98%"
            height="96%"
            fill="none"
            stroke="rgba(35,75,170,0.7)"
            strokeWidth="1.3"
            filter="url(#noise)"
            strokeDasharray="1 1.2"
          />
        </svg>

        {/* CONTENT */}
        <div
          className={cormorant.className}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,

            color: "rgba(35,75,170,0.95)",

            textTransform: "uppercase",
            letterSpacing: "0.11em",

            fontWeight: 800,
            fontSize: 16,

            filter: `
              blur(0.22px)
              contrast(1.15)
              saturate(1.1)
            `,

            textShadow: `
              0 0 0.6px rgba(35,75,170,0.6),
              0 0 1.2px rgba(35,75,170,0.3)
            `,
          }}
        >
          {/* CREATED AT - FULL WIDTH STRIP */}
          <div
            style={{
              margin: "-12px -14px 6px -14px",

              padding: "10px 14px",

              background: "rgba(18,48,120,0.95)",

              color: "#fff",

              display: "flex",
              flexDirection: "column",
              gap: 2,

              letterSpacing: "0.13em",

              fontWeight: 900,

              fontSize: 17,

              textShadow: "0 0 2px rgba(0,0,0,0.35)",
            }}
          >
            <div>Created At: {dateString}</div>

            <div
              style={{
                fontSize: 11,
                opacity: 0.85,
                letterSpacing: "0.18em",
                fontWeight: 600,
              }}
            >
              {timeString}
            </div>
          </div>

          {/* DIVIDER */}
          <div
            style={{
              height: 1,
              background: "rgba(35,75,170,0.25)",
              margin: "2px 0 6px",
            }}
          />

          {/* CATEGORY */}
          {data.category && (
            <div
              style={{
                display: "flex",
                gap: 8,
                fontSize: 15,
                fontWeight: 800,
                opacity: 0.9,
              }}
            >
              <span>Category:</span>
              <span style={{ opacity: 0.95 }}>
                {data.category}
              </span>
            </div>
          )}

          {/* DOCUMENT */}
          {data.documentNumber && (
            <div
              style={{
                display: "flex",
                gap: 8,
                fontSize: 15,
                fontWeight: 900,
                opacity: 0.95,
              }}
            >
              <span>Document:</span>
              <span>#{data.documentNumber}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}