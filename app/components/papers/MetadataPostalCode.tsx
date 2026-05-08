// app/components/papers/MetadataPostalCode.tsx

"use client";

import React from "react";

type Props = {
  data: any;
  isDark: boolean;
};

export default function MetadataPostalCode({
  data,
  isDark,
}: Props) {
  return (
    <div
      style={{
        display: "flex",

        alignItems: "center",

        justifyContent: "flex-start",

        gap: 32,

        marginTop: 28,

        marginBottom: 40,
      }}
    >
      {/* GOLDEN RATIO IMAGE */}
      <img
        src="/images/headers/goldenratio.jpg"
        alt="golden ratio"
        style={{
          width: 170,

          height: 170,

          objectFit: "contain",

          opacity: isDark ? 0.9 : 0.82,

          flexShrink: 0,
        }}
      />

      {/* METADATA */}
      <div
        style={{
          display: "flex",

          flexDirection: "column",

          justifyContent: "center",

          gap: 14,

          transform: "rotate(-1.2deg)",

          fontFamily: "'Courier New', monospace",
        }}
      >
        {[
          {
            label: "Created At",
            value: data.created_at
              ? new Date(
                  data.created_at
                ).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )
              : "Unknown",
          },

          data.category && {
            label: "Category",
            value: data.category,
          },

          data.documentNumber && {
            label: "Document",
            value: `#${data.documentNumber}`,
          },
        ]
          .filter(Boolean)
          .map((item: any, idx) => (
            <div
              key={idx}
              style={{
                position: "relative",

                display: "inline-flex",

                alignItems: "center",

                width: "fit-content",

                padding: "10px 18px",

                border:
                  "2.5px solid rgba(40,90,180,0.72)",

                color: "rgba(35,75,170,0.92)",

                background:
                  "rgba(255,255,255,0.06)",

                fontSize: 16,

                fontWeight: 800,

                letterSpacing: "0.12em",

                textTransform: "uppercase",

                borderRadius: 4,

                boxShadow: `
                  0 0 0.5px rgba(40,90,180,0.9),
                  0 0 2px rgba(40,90,180,0.35)
                `,

                filter: `
                  blur(0.15px)
                  contrast(1.08)
                `,

                opacity:
                  idx % 2 === 0
                    ? 0.92
                    : 0.78,

                overflow: "hidden",
              }}
            >
              {/* INK TEXTURE */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,

                  background: `
                    repeating-linear-gradient(
                      0deg,
                      rgba(40,90,180,0.08) 0px,
                      rgba(40,90,180,0.02) 1px,
                      transparent 2px,
                      transparent 4px
                    )
                  `,

                  mixBlendMode: "multiply",

                  pointerEvents: "none",
                }}
              />

              {/* FADED CORNERS */}
              <div
                style={{
                  position: "absolute",

                  inset: 0,

                  boxShadow: `
                    inset 0 0 10px rgba(255,255,255,0.18),
                    inset 0 0 2px rgba(40,90,180,0.3)
                  `,

                  pointerEvents: "none",
                }}
              />

              <span
                style={{
                  marginRight: 10,

                  opacity: 0.95,
                }}
              >
                {item.label}:
              </span>

              <span
                style={{
                  opacity: 0.88,
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}