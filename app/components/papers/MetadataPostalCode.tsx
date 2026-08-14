"use client";

import React from "react";


// ❌ REMOVED:
// const cormorant = Cormorant_SC({
//   subsets: ["latin"],
//   weight: ["500", "600", "700"],
// });

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function renderNoisyText(text: string, seed: number) {
  return String(text).split("").map((char, i) => {
    const r = seededRandom(seed + i * 13);

    const opacity = 0.58 + r * 0.42;

    const shiftY =
      (seededRandom(seed + i * 7) - 0.5) * 0.6;

    const shiftX =
      (seededRandom(seed + i * 5) - 0.5) * 0.4;

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
              0 0 4px rgba(35,75,170,0.28)
            `
            : `
              0 0 0.5px rgba(35,75,170,0.18)
            `,

          filter: strongBleed
            ? `blur(${0.15 + r * 0.2}px)`
            : `blur(${r * 0.04}px)`,
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
        alignItems: "flex-start",

        //  전체 그룹 더 왼쪽
        paddingLeft: 0,

        marginTop: 0,
        marginBottom: 10,
      }}
    >
      {/* IMAGE + STAMP GROUP */}
      <div
        style={{
          position: "relative",

          width: 470,

          // 레이아웃 공간 제거
          height: 0,
        }}
      >
        {/* GOLDEN RATIO IMAGE */}
        <img
          src="/images/headers/goldenratio.jpg"
          alt="golden ratio"
          style={{
            position: "absolute",

            //  더 왼쪽
            left: -58,

            top: 12,

            width: 145,
            height: 145,

            objectFit: "contain",

            opacity: isDark ? 0.85 : 0.78,

            filter:
              "contrast(1.05) saturate(0.95)",

            pointerEvents: "none",
          }}
        />

        {/* STAMP WRAPPER */}
        <div
          style={{
            position: "absolute",

            //  같이 왼쪽 이동
            left: -24,

            //  stamp만 살짝 위로
            top: -22,

            width: 380,
            height: 190,

            transform: "rotate(-3.2deg)",

            isolation: "isolate",

            zIndex: 2,

            pointerEvents: "none",
          }}
        >
          {/* STAMP IMAGE */}
          <img
            src="/images/marks/stamp4.png"
            alt="stamp"
            style={{
              position: "absolute",
              inset: 0,

              width: "100%",
              height: "50%",

              objectFit: "contain",

              opacity: isDark ? 0.72 : 0.67,

              mixBlendMode: "multiply",

              filter: `
                contrast(1.02)
                saturate(0.82)
                blur(0.1px)
              `,
            }}
          />

          {/* TEXT OVERLAY */}
          <div
            // ✅ CHANGED: from className={cormorant.className} to className="font-cormorant-sc"
            className="font-cormorant-sc"
            style={{
              position: "absolute",
              inset: 0,

              paddingTop: 44,
              paddingLeft: 88,

              display: "flex",
              flexDirection: "column",

              gap: 6,

              color: "rgba(35,75,170,0.92)",

              textTransform: "uppercase",

              letterSpacing: "0.05em",

              fontWeight: 800,
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
                  marginTop: 3,
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
                    marginTop: 3,
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