"use client";

import React from "react";

type Props = {
  onInput?: (value: string) => void;
  onClose?: () => void;
};

const scientificKeys = [
  ["sin(", "cos(", "tan(", "π"],
  ["log(", "ln(", "√(", "^"],
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "(", ")"],
  ["+", "EXP", "=", "ANS"],
];

export default function CalculatorKeyboardInterface({
  onInput,
  onClose,
}: Props) {
  return (
    <div
      style={{
        width: "92%",
        maxWidth: 680,

        padding: 24,

        borderRadius: 34,

        background: `
          linear-gradient(
            to bottom,
            rgba(255,255,255,0.16),
            rgba(255,255,255,0.05)
          )
        `,

        border: "1px solid rgba(255,255,255,0.14)",

        backdropFilter: "blur(30px)",
        WebkitBackdropFilter: "blur(30px)",

        boxShadow: `
          0px 30px 80px rgba(0,0,0,0.42),
          inset 0px 1px 0px rgba(255,255,255,0.12)
        `,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.26em",
            color: "rgba(255,255,255,0.52)",
            fontFamily: "ui-serif, Georgia",
          }}
        >
          ENGINEERING CALCULATOR
        </div>

        <button
          onClick={onClose}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.08)",
            color: "white",
            cursor: "pointer",
            fontSize: 18,
          }}
        >
          ×
        </button>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
        }}
      >
        {scientificKeys.flat().map((key) => (
          <button
            key={key}
            onClick={() => onInput?.(key)}
            style={{
              height: 58,

              borderRadius: 18,

              border: "1px solid rgba(255,255,255,0.1)",

              background: `
                linear-gradient(
                  to bottom,
                  rgba(255,255,255,0.10),
                  rgba(255,255,255,0.03)
                )
              `,

              color: "white",

              fontSize: 16,

              cursor: "pointer",

              transition: "all 0.18s ease",

              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",

              boxShadow: "0px 4px 14px rgba(0,0,0,0.16)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-2px) scale(1.02)";

              e.currentTarget.style.background =
                "rgba(255,255,255,0.16)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0px) scale(1)";

              e.currentTarget.style.background = `
                linear-gradient(
                  to bottom,
                  rgba(255,255,255,0.10),
                  rgba(255,255,255,0.03)
                )
              `;
            }}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
}