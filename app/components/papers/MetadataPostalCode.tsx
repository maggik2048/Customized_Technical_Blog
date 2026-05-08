"use client";

import React from "react";
import { Cormorant_SC } from "next/font/google";

const cormorant = Cormorant_SC({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * 🔥 Ink stamp renderer
 */
function renderNoisyText(text: string, seed: number) {
  return String(text).split("").map((char, i) => {
    const r = seededRandom(seed + i * 13);

    const opacity = 0.58 + r * 0.42;

    const shiftY =
      (seededRandom(seed + i * 7) - 0.5) * 0.7;

    const shiftX =
      (seededRandom(seed + i * 5) - 0.5) * 0.45;

    const bleedStrength =
      seededRandom(seed + i * 29);

    const strongBleed = bleedStrength > 0.72;

    return (
      <span
        key={i}
        style={{
          position: "relative",
          display: "inline-block",

          opacity,

          transform: `translate(${shiftX}px, ${shiftY}px)`,

          textShadow: strongBleed
            ? `
              0 0 1px rgba(35,75,170,0.55),
              0 0 2px rgba(35,75,170,0.42),
              0 0 4px rgba(35,75,170,0.28),
              0 0 8px rgba(35,75,170,0.14)
            `
            : `
              0 0 0.5px rgba(35,75,170,0.18)
            `,

          filter: strongBleed
            ? `blur(${0.18 + r * 0.22}px)`
            : `blur(${r * 0.05}px)`,
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    );
  });
}

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

  const seed = data?.documentNumber || 1234;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 32,

        // overlap 공간 확보
        paddingLeft: 8,
      }}
    >
      {/* IMAGE + STAMP GROUP */}
      <div
        style={{
          position: "relative",
          width: 470,
          height: 250,
        }}
      >
        {/* GOLDEN RATIO IMAGE */}
        <img
          src="/images/headers/goldenratio.jpg"
          alt="golden ratio"
          style={{
            position: "absolute",
            left: 0,
            top: 18,

            width: 145,
            height: 145,

            objectFit: "contain",

            opacity: isDark ? 0.85 : 0.78,

            filter: "contrast(1.05) saturate(0.95)",
          }}
        />

        {/* STAMP WRAPPER */}
        <div
          style={{
            position: "absolute",

            //  golden ratio 오른쪽 아래로 겹치게
            left: 42,
            top: 20,

            width: 380,
            height: 220,

            transform: "rotate(-3.2deg)",

            isolation: "isolate",

            zIndex: 2,
          }}
        >
          {/* STAMP IMAGE */}
          <img
            src="/images/marks/stamp.png"
            alt="stamp"
            style={{
              position: "absolute",
              inset: 0,

              width: "100%",
              height: "100%",

              objectFit: "contain",

              opacity: isDark ? 0.72 : 0.67,

              mixBlendMode: "multiply",

              filter: `
                contrast(1.02)
                saturate(0.82)
                blur(0.12px)
              `,
            }}
          />

          {/* TEXT OVERLAY */}
          <div
            className={cormorant.className}
            style={{
              position: "absolute",
              inset: 0,

              paddingTop: 58,
              paddingLeft: 92,

              display: "flex",
              flexDirection: "column",
              gap: 8,

              color: "rgba(35,75,170,0.92)",

              textTransform: "uppercase",

              letterSpacing: "0.05em",

              fontWeight: 800,

              pointerEvents: "none",
            }}
          >
            {/* CREATED AT */}
            <div
              style={{
                fontSize: 18,
                lineHeight: 1.15,
              }}
            >
              <div>
                {renderNoisyText(
                  "Created At:",
                  seed
                )}
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 16,
                }}
              >
                {renderNoisyText(
                  dateString,
                  seed + 10
                )}
              </div>
            </div>

            {/* CATEGORY */}
            {data.category && (
              <div
                style={{
                  fontSize: 17,
                  lineHeight: 1.1,
                }}
              >
                <div>
                  {renderNoisyText(
                    "Category:",
                    seed + 77
                  )}
                </div>

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 15,
                  }}
                >
                  {renderNoisyText(
                    data.category,
                    seed + 78
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}