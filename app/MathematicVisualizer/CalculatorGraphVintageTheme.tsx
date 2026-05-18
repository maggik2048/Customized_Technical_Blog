// CalculatorGraphVintageTheme.tsx
"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
};

export default function CalculatorGraphVintageTheme({
  children,
  title = "ROYAL ARCANE CALCULATOR",
  onClose,
}: Props) {
  return (
    <div
      style={{
        width: 1480,
        maxWidth: "96vw",
        padding: 34,
        borderRadius: 42,

        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",

        background: `
          radial-gradient(circle at top,
            rgba(255,240,210,0.06),
            transparent 30%
          ),

          linear-gradient(
            145deg,
            #16110d 0%,
            #221811 45%,
            #120d09 100%
          )
        `,

        border: "1px solid rgba(255,220,160,0.16)",

        boxShadow: `
          0 40px 120px rgba(0,0,0,0.55),
          inset 0 1px 0 rgba(255,255,255,0.04),
          inset 0 0 90px rgba(255,220,140,0.04)
        `,

        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* GOLD ORNAMENT OVERLAY */}

      <div
        style={{
          position: "absolute",
          inset: 0,

          pointerEvents: "none",
          opacity: 0.045,

          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              rgba(255,220,160,0.12) 0px,
              rgba(255,220,160,0.12) 1px,
              transparent 1px,
              transparent 7px
            )
          `,
        }}
      />

      {/* OUTER FRAME */}

      <div
        style={{
          position: "absolute",
          inset: 10,
          borderRadius: 30,

          border: "1px solid rgba(255,220,180,0.10)",

          boxShadow: `
            inset 0 0 30px rgba(255,230,180,0.03)
          `,
        }}
      />

      {/* HEADER */}

      <div
        style={{
          position: "relative",

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          marginBottom: 26,
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.32em",

            color: "rgba(255,230,190,0.72)",

            fontFamily: `
              Cinzel,
              Trajan Pro,
              ui-serif,
              Georgia
            `,

            textShadow: `
              0 0 14px rgba(255,220,150,0.22)
            `,
          }}
        >
          {title}
        </div>

        <button
          onClick={onClose}
          style={{
            width: 38,
            height: 38,

            borderRadius: "50%",

            border: "1px solid rgba(255,220,180,0.25)",

            background: `
              radial-gradient(circle at top,
                rgba(255,245,225,0.18),
                rgba(60,40,20,0.95)
              )
            `,

            color: "#ffe8c7",

            fontSize: 18,
            cursor: "pointer",

            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.08),
              0 0 18px rgba(255,210,120,0.10)
            `,
          }}
        >
          ×
        </button>
      </div>

      {/* DIVIDER */}

      <div
        style={{
          height: 1,
          marginBottom: 28,

          background: `
            linear-gradient(
              to right,
              transparent,
              rgba(255,220,170,0.25),
              transparent
            )
          `,
        }}
      />

      {/* CONTENT AREA */}

      <div
        style={{
          position: "relative",
          zIndex: 2,

          color: "#f8ead2",
        }}
      >
        {children}
      </div>

      {/* GLOBAL VINTAGE BUTTON STYLE */}

      <style jsx global>{`
        /* 숫자 버튼 / sin cos tan / graph 버튼 */

        .calculator-key,
        button {
          border-radius: 999px !important;

          background:
            radial-gradient(
              circle at top,
              rgba(255,245,220,0.18),
              rgba(60,42,24,0.95)
            ) !important;

          border: 1px solid rgba(255,220,160,0.34) !important;

          color: #f8e7c5 !important;

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.10),
            inset 0 -4px 10px rgba(0,0,0,0.32),
            0 0 10px rgba(255,210,120,0.08) !important;

          transition:
            transform 0.12s ease,
            box-shadow 0.16s ease,
            border 0.16s ease !important;

          font-family:
            Cinzel,
            ui-serif,
            Georgia !important;

          position: relative;
        }

        .calculator-key:hover,
        button:hover {
          transform: translateY(-1px);

          border: 1px solid rgba(255,235,190,0.52) !important;

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.16),
            0 0 16px rgba(255,220,140,0.16),
            0 6px 18px rgba(0,0,0,0.24) !important;
        }

        .calculator-key:active,
        button:active {
          transform: translateY(2px);

          box-shadow:
            inset 0 3px 10px rgba(0,0,0,0.45),
            0 0 10px rgba(255,200,120,0.06) !important;
        }

        /* f(x) 입력창 */

        input,
        textarea {
          background:
            linear-gradient(
              180deg,
              rgba(35,24,15,0.96),
              rgba(18,12,8,0.96)
            ) !important;

          border: 1px solid rgba(255,220,170,0.22) !important;

          color: #ffefcf !important;

          border-radius: 18px !important;

          box-shadow:
            inset 0 0 24px rgba(255,220,160,0.04),
            0 0 10px rgba(255,220,160,0.04) !important;

          font-family:
            ui-serif,
            Georgia !important;
        }

        input::placeholder,
        textarea::placeholder {
          color: rgba(255,230,190,0.34) !important;
        }

        /* graph line color */

        svg path {
          stroke: #f6d089 !important;
        }

        /* axis */

        svg text {
          fill: #f3e2bd !important;
        }

        svg line {
          stroke: rgba(255,225,170,0.24) !important;
        }

        /* 카드 패널 */

        .panel,
        .graph-panel {
          background:
            linear-gradient(
              145deg,
              rgba(42,28,18,0.90),
              rgba(18,12,8,0.94)
            ) !important;

          border: 1px solid rgba(255,220,170,0.12) !important;

          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.04),
            0 20px 50px rgba(0,0,0,0.34) !important;

          border-radius: 26px !important;
        }
      `}</style>
    </div>
  );
}