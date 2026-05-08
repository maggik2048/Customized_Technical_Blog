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
    ? createdDate.toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )
    : "Unknown";

  const timeString = createdDate
    ? createdDate.toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }
      )
    : "";

  return (
    <div
      style={{
        display: "flex",

        alignItems: "center",

        justifyContent: "flex-start",

        gap: 34,

        marginTop: 28,

        marginBottom: 44,
      }}
    >
      {/* GOLDEN RATIO */}
      <img
        src="/images/headers/goldenratio.jpg"
        alt="golden ratio"
        style={{
          width: 170,

          height: 170,

          objectFit: "contain",

          opacity: isDark ? 0.88 : 0.82,

          flexShrink: 0,

          filter: `
            contrast(1.04)
            saturate(0.9)
          `,
        }}
      />

      {/* MAIN POSTAL STAMP */}
      <div
        style={{
          position: "relative",

          padding: "24px 30px",

          border:
            "3px solid rgba(35,75,170,0.72)",

          borderRadius: 4,

          transform: "rotate(-1.35deg)",

          overflow: "hidden",

          width: "fit-content",

          background: `
            linear-gradient(
              to bottom,
              rgba(255,255,255,0.03),
              rgba(255,255,255,0.01)
            )
          `,

          boxShadow: `
            0 0 1px rgba(35,75,170,0.7),
            0 0 6px rgba(35,75,170,0.18),
            inset 0 0 18px rgba(35,75,170,0.08)
          `,

          opacity: 0.92,
        }}
      >
        {/* PAPER INK BLEED */}
        <div
          style={{
            position: "absolute",

            inset: 0,

            background: `
              radial-gradient(
                circle at 12% 18%,
                rgba(35,75,170,0.12),
                transparent 28%
              ),

              radial-gradient(
                circle at 78% 62%,
                rgba(35,75,170,0.08),
                transparent 22%
              ),

              radial-gradient(
                circle at 40% 82%,
                rgba(35,75,170,0.06),
                transparent 18%
              )
            `,

            mixBlendMode: "multiply",

            pointerEvents: "none",
          }}
        />

        {/* HORIZONTAL INK IMPERFECTION */}
        <div
          style={{
            position: "absolute",

            inset: 0,

            background: `
              repeating-linear-gradient(
                0deg,
                rgba(35,75,170,0.08) 0px,
                rgba(35,75,170,0.025) 1px,
                transparent 2px,
                transparent 5px
              )
            `,

            opacity: 0.6,

            mixBlendMode: "multiply",

            pointerEvents: "none",
          }}
        />

        {/* FADED EDGE */}
        <div
          style={{
            position: "absolute",

            inset: 0,

            boxShadow: `
              inset 0 0 14px rgba(255,255,255,0.14),
              inset 0 0 2px rgba(35,75,170,0.25)
            `,

            pointerEvents: "none",
          }}
        />

        {/* NOISY STAMP BORDER */}
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            inset: 0,

            pointerEvents: "none",

            opacity: 0.45,
          }}
        >
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />

            <feDisplacementMap
              in="SourceGraphic"
              scale="1.8"
            />
          </filter>

          <rect
            x="2"
            y="2"
            width="98%"
            height="96%"
            rx="2"
            ry="2"
            fill="none"
            stroke="rgba(35,75,170,0.7)"
            strokeWidth="1.5"
            filter="url(#noise)"
            strokeDasharray="1 0.8"
          />
        </svg>

        {/* CONTENT */}
        <div
          className={cormorant.className}
          style={{
            position: "relative",

            display: "flex",

            flexDirection: "column",

            color: "rgba(35,75,170,0.92)",

            filter: `
              blur(0.18px)
              contrast(1.08)
            `,
          }}
        >
          {/* CREATED DATE */}
          <div
            style={{
              display: "flex",

              flexDirection: "column",

              gap: 3,

              marginBottom: 14,

              textTransform: "uppercase",

              letterSpacing: "0.11em",

              fontWeight: 700,

              fontSize: 17,

              opacity: 0.94,

              textShadow: `
                0 0 0.4px rgba(35,75,170,0.5),
                0 0 1px rgba(35,75,170,0.25)
              `,
            }}
          >
            <div>
              Created At: {dateString}
            </div>

            {/* TIME */}
            <div
              style={{
                fontSize: 13,

                letterSpacing: "0.18em",

                opacity: 0.48,

                marginLeft: 2,

                fontWeight: 600,
              }}
            >
              {timeString}
            </div>
          </div>

          {/* DIVIDER */}
          <div
            style={{
              width: "100%",

              height: 1,

              marginBottom: 14,

              background: `
                linear-gradient(
                  to right,
                  transparent 0%,
                  rgba(35,75,170,0.12) 12%,
                  rgba(35,75,170,0.35) 50%,
                  rgba(35,75,170,0.12) 88%,
                  transparent 100%
                )
              `,

              opacity: 0.7,
            }}
          />

          {/* CATEGORY */}
          {data.category && (
            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: 12,

                textTransform: "uppercase",

                letterSpacing: "0.12em",

                fontWeight: 700,

                fontSize: 16,

                marginBottom: 10,

                opacity: 0.82,
              }}
            >
              <span>Category:</span>

              <span
                style={{
                  opacity: 0.9,
                }}
              >
                {data.category}
              </span>
            </div>
          )}

          {/* DOCUMENT */}
          {data.documentNumber && (
            <div
              style={{
                display: "flex",

                alignItems: "center",

                gap: 12,

                textTransform: "uppercase",

                letterSpacing: "0.14em",

                fontWeight: 800,

                fontSize: 17,

                opacity: 0.9,
              }}
            >
              <span>Document:</span>

              <span>
                #{data.documentNumber}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}