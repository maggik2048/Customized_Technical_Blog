// CalculatorGraphingInterface.tsx
"use client";

import React, { useMemo, useState } from "react";
import CalculatorGraphTheme from "./CalculatorGraphTheme";

type Props = {
  onClose?: () => void;
};

const scientificKeys = [
  ["sin(", "cos(", "tan(", "π"],
  ["log(", "ln(", "sqrt(", "^"],
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "(", ")"],
  ["+", "x", "=", "CLR"],
];

/* ------------------------------------------------ */
/* MATH ENGINE */
/* ------------------------------------------------ */

function normalizeExpression(input: string) {
  return input
    .replaceAll("π", "pi")
    .replaceAll("^", "**")
    .replaceAll("ln(", "log(");
}

function evaluateExpression(expr: string, x: number) {
  try {
    const parsed = normalizeExpression(expr);

    const scope = {
      x,
      pi: Math.PI,
      sin: Math.sin,
      cos: Math.cos,
      tan: Math.tan,
      sqrt: Math.sqrt,
      log: Math.log,
    };

    return Function(
      ...Object.keys(scope),
      `return ${parsed}`
    )(...Object.values(scope));
  } catch {
    return NaN;
  }
}

export default function CalculatorGraphingInterface({
  onClose,
}: Props) {
  const [expression, setExpression] = useState("sin(x)");

  /* ------------------------------------------------ */
  /* GRAPH DATA */
  /* ------------------------------------------------ */

  const graphPoints = useMemo(() => {
    const points: { x: number; y: number }[] = [];

    for (let x = -20; x <= 20; x += 0.1) {
      const y = evaluateExpression(expression, x);

      if (Number.isFinite(y)) {
        points.push({ x, y });
      }
    }

    return points;
  }, [expression]);

  /* ------------------------------------------------ */
  /* INPUT */
  /* ------------------------------------------------ */

  const handleKeyPress = (key: string) => {
    if (key === "CLR") {
      setExpression("");
      return;
    }

    if (key === "=") {
      return;
    }

    setExpression((prev) => prev + key);
  };

  /* ------------------------------------------------ */
  /* GRAPH CONFIG */
  /* ------------------------------------------------ */

  const width = 820;
  const height = 520;

  const scaleX = 16;
  const scaleY = 16;

  const centerX = width / 2;
  const centerY = height / 2;

  const pathData = graphPoints
    .map((p, i) => {
      const px = centerX + p.x * scaleX;
      const py = centerY - p.y * scaleY;

      return `${i === 0 ? "M" : "L"} ${px} ${py}`;
    })
    .join(" ");

  return (
    <CalculatorGraphTheme onClose={onClose}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",

          gap: 28,
        }}
      >
        {/* ------------------------------------------------ */}
        {/* LEFT CALCULATOR */}
        {/* ------------------------------------------------ */}

        <div
          style={{
            padding: 24,

            borderRadius: 34,

            background: `
              linear-gradient(
                to bottom,
                rgba(255,240,220,0.10),
                rgba(0,0,0,0.18)
              )
            `,

            border:
              "1px solid rgba(255,220,170,0.14)",

            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",

            boxShadow: `
              0px 30px 80px rgba(0,0,0,0.30),
              inset 0px 1px 0px rgba(255,255,255,0.08)
            `,
          }}
        >
          {/* DISPLAY */}

          <div
            style={{
              height: 110,

              borderRadius: 24,

              background: `
                linear-gradient(
                  to bottom,
                  rgba(12,18,12,0.92),
                  rgba(5,10,5,0.95)
                )
              `,

              border:
                "1px solid rgba(180,255,180,0.10)",

              padding: 20,

              marginBottom: 20,

              overflow: "hidden",

              boxShadow: `
                inset 0px 0px 24px rgba(0,255,120,0.08)
              `,
            }}
          >
            <div
              style={{
                fontSize: 14,
                color: "rgba(160,255,180,0.42)",
                marginBottom: 10,
              }}
            >
              f(x)
            </div>

            <div
              style={{
                fontSize: 30,
                color: "#d6ffd6",

                wordBreak: "break-all",

                fontFamily: "monospace",
              }}
            >
              {expression || "0"}
            </div>
          </div>

          {/* KEYS */}

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
                onClick={() => handleKeyPress(key)}
                style={{
                  height: 58,

                  borderRadius: 18,

                  border:
                    "1px solid rgba(255,220,170,0.10)",

                  background: `
                    linear-gradient(
                      to bottom,
                      rgba(120,85,55,0.45),
                      rgba(40,26,18,0.42)
                    )
                  `,

                  color: "#ffe4c0",

                  fontSize: 16,

                  cursor: "pointer",

                  transition: "all 0.18s ease",

                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",

                  boxShadow: `
                    0px 4px 14px rgba(0,0,0,0.18),
                    inset 0px 1px 0px rgba(255,255,255,0.06)
                  `,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-2px) scale(1.02)";

                  e.currentTarget.style.background = `
                    linear-gradient(
                      to bottom,
                      rgba(150,110,75,0.60),
                      rgba(55,34,22,0.58)
                    )
                  `;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0px) scale(1)";

                  e.currentTarget.style.background = `
                    linear-gradient(
                      to bottom,
                      rgba(120,85,55,0.45),
                      rgba(40,26,18,0.42)
                    )
                  `;
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------ */}
        {/* GRAPH PANEL */}
        {/* ------------------------------------------------ */}

        <div
          style={{
            position: "relative",

            overflow: "hidden",

            borderRadius: 38,

            background: `
              linear-gradient(
                to bottom,
                rgba(255,240,220,0.08),
                rgba(0,0,0,0.10)
              )
            `,

            border:
              "1px solid rgba(255,220,170,0.10)",

            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",

            boxShadow:
              "0px 30px 80px rgba(0,0,0,0.26)",

            minHeight: 520,
          }}
        >
          {/* METAL TEXTURE */}

          <div
            style={{
              position: "absolute",
              inset: 0,

              opacity: 0.04,

              backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  rgba(255,255,255,0.08) 0px,
                  rgba(255,255,255,0.08) 1px,
                  transparent 1px,
                  transparent 4px
                )
              `,
            }}
          />

          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >
            {/* GRID */}

            {Array.from({ length: 60 }).map((_, i) => {
              const x = i * 35;

              return (
                <line
                  key={`vx-${i}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={height}
                  stroke="rgba(255,230,190,0.045)"
                />
              );
            })}

            {Array.from({ length: 40 }).map((_, i) => {
              const y = i * 35;

              return (
                <line
                  key={`hy-${i}`}
                  x1={0}
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="rgba(255,230,190,0.045)"
                />
              );
            })}

            {/* AXIS */}

            <line
              x1={0}
              y1={centerY}
              x2={width}
              y2={centerY}
              stroke="rgba(255,240,210,0.22)"
              strokeWidth={1.2}
            />

            <line
              x1={centerX}
              y1={0}
              x2={centerX}
              y2={height}
              stroke="rgba(255,240,210,0.22)"
              strokeWidth={1.2}
            />

            {/* GRAPH */}

            <path
              d={pathData}
              fill="none"
              stroke="#ffe0ad"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"

              filter="
                drop-shadow(
                  0px 0px 10px rgba(255,220,170,0.32)
                )
              "
            />
          </svg>

          {/* LABEL */}

          <div
            style={{
              position: "absolute",

              top: 24,
              left: 24,

              padding: "12px 18px",

              borderRadius: 18,

              background: "rgba(25,15,10,0.26)",

              border:
                "1px solid rgba(255,220,170,0.08)",

              color: "#ffe7c7",

              fontSize: 18,

              backdropFilter: "blur(20px)",
            }}
          >
            y = {expression}
          </div>
        </div>
      </div>
    </CalculatorGraphTheme>
  );
}