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

// 🔥 refined stamp text renderer
function renderNoisyText(text: string, seed: number) {
  return String(text).split("").map((char, i) => {
    const r = seededRandom(seed + i * 13);

    // 최소 opacity 보장
    const opacity = 0.55 + r * 0.45;

    // 매우 미세한 jitter
    const shiftY = (seededRandom(seed + i * 7) - 0.5) * 0.8;
    const shiftX = (seededRandom(seed + i * 5) - 0.5) * 0.5;

    return (
      <span
        key={i}
        style={{
          display: "inline-block",
          opacity,
          transform: `translate(${shiftX}px, ${shiftY}px)`,

          // 아주 미세한 잉크 퍼짐
          filter: `blur(${r * 0.08}px)`,
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

  const timeString = createdDate
    ? createdDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  const seed = data?.documentNumber || 1234;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        marginTop: 20,
        marginBottom: 32,
      }}
    >
      {/* LEFT IMAGE */}
      <img
        src="/images/headers/goldenratio.jpg"
        alt="golden ratio"
        style={{
          width: 135,
          height: 135,
          objectFit: "contain",
          opacity: isDark ? 0.85 : 0.78,
          filter: "contrast(1.05) saturate(0.95)",
        }}
      />

      {/* STAMP */}
      <div
        style={{
          padding: "12px 14px",
          border: "2px solid rgba(35,75,170,0.7)",
          borderRadius: 3,
          transform: "rotate(-1.1deg)",
          width: "fit-content",

          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",

          boxShadow: `
            0 0 1px rgba(35,75,170,0.22),
            inset 0 0 8px rgba(35,75,170,0.03)
          `,
        }}
      >
        {/* CONTENT */}
        <div
          className={cormorant.className}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,

            color: "rgba(35,75,170,0.9)",
            textTransform: "uppercase",
            letterSpacing: "0.11em",
            fontWeight: 800,
            fontSize: 16,
          }}
        >
          {/* HEADER */}
          <div
            style={{
              margin: "-12px -14px 6px -14px",
              padding: "10px 14px",
              background: "rgba(18,48,120,0.84)",
              color: "white",
              fontWeight: 900,
              fontSize: 17,
            }}
          >
            <div>
              {renderNoisyText("Created At: ", seed)}
              {renderNoisyText(dateString, seed + 10)}
            </div>

            <div
              style={{
                fontSize: 11,
                opacity: 0.9,
              }}
            >
              {renderNoisyText(timeString, seed + 999)}
            </div>
          </div>

          {/* divider */}
          <div
            style={{
              height: 1,
              background: "rgba(35,75,170,0.18)",
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
              }}
            >
              <span>
                {renderNoisyText("Category:", seed + 77)}
              </span>

              <span>
                {renderNoisyText(data.category, seed + 78)}
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
              }}
            >
              <span>
                {renderNoisyText("Document:", seed + 88)}
              </span>

              <span>
                #
                {renderNoisyText(
                  String(data.documentNumber),
                  seed + 89
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}