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

function evaluateExpression(
  expr: string,
  x: number
) {
  try {
    const parsed =
      normalizeExpression(expr);

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
  const [expression, setExpression] =
    useState("sin(x)");

  /* ------------------------------------------------ */
  /* GRAPH DATA */
  /* ------------------------------------------------ */

  const graphPoints = useMemo(() => {
    const points: {
      x: number;
      y: number;
    }[] = [];

    for (
      let x = -20;
      x <= 20;
      x += 0.1
    ) {
      const y =
        evaluateExpression(
          expression,
          x
        );

      if (Number.isFinite(y)) {
        points.push({ x, y });
      }
    }

    return points;
  }, [expression]);

  /* ------------------------------------------------ */
  /* INPUT */
  /* ------------------------------------------------ */

  const handleKeyPress = (
    key: string
  ) => {
    if (key === "CLR") {
      setExpression("");
      return;
    }

    if (key === "=") {
      return;
    }

    setExpression(
      (prev) => prev + key
    );
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
      const px =
        centerX + p.x * scaleX;

      const py =
        centerY - p.y * scaleY;

      return `${
        i === 0 ? "M" : "L"
      } ${px} ${py}`;
    })
    .join(" ");

  return (
    <CalculatorGraphTheme
      onClose={onClose}
    >
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "420px 1fr",

          gap: 28,
        }}
      >
        {/* -------------------------------- */}
        {/* LEFT PANEL */}
        {/* -------------------------------- */}

        <div
          style={{
            padding: 24,

            borderRadius: 30,

            background:
              "rgba(255,255,255,0.03)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            backdropFilter: "blur(20px)",

            boxShadow: `
              0px 20px 60px rgba(0,0,0,0.20)
            `,
          }}
        >
          {/* DISPLAY */}

          <div
            style={{
              height: 110,

              borderRadius: 22,

              background:
                "rgba(0,0,0,0.42)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              padding: 20,

              marginBottom: 20,

              overflow: "hidden",
            }}
          >
            <div
              style={{
                fontSize: 13,

                color:
                  "rgba(255,255,255,0.45)",

                marginBottom: 10,

                letterSpacing:
                  "0.08em",
              }}
            >
              f(x)
            </div>

            <div
              style={{
                fontSize: 30,

                color: "#ffffff",

                wordBreak: "break-all",

                fontFamily:
                  "monospace",
              }}
            >
              {expression || "0"}
            </div>
          </div>

          {/* KEYS */}

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(4, 1fr)",

              gap: 14,
            }}
          >
            {scientificKeys
              .flat()
              .map((key) => (
                <button
                  key={key}
                  onClick={() =>
                    handleKeyPress(key)
                  }
                  style={{
                    height: 58,

                    borderRadius: 16,

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    background:
                      "rgba(255,255,255,0.04)",

                    color: "#ffffff",

                    fontSize: 16,

                    cursor: "pointer",

                    transition:
                      "all 0.16s ease",

                    backdropFilter:
                      "blur(10px)",

                    boxShadow: `
                      inset 0px 1px 0px rgba(255,255,255,0.04)
                    `,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-2px)";

                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(0px)";

                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.04)";
                  }}
                >
                  {key}
                </button>
              ))}
          </div>
        </div>

        {/* -------------------------------- */}
        {/* GRAPH PANEL */}
        {/* -------------------------------- */}

        <div
          style={{
            position: "relative",

            overflow: "hidden",

            borderRadius: 34,

            background:
              "rgba(255,255,255,0.025)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            backdropFilter: "blur(26px)",

            boxShadow: `
              0px 20px 60px rgba(0,0,0,0.22)
            `,

            minHeight: 520,
          }}
        >
          {/* GRID */}

          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
          >
            {Array.from({
              length: 60,
            }).map((_, i) => {
              const x = i * 35;

              return (
                <line
                  key={`vx-${i}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={height}
                  stroke="rgba(255,255,255,0.04)"
                />
              );
            })}

            {Array.from({
              length: 40,
            }).map((_, i) => {
              const y = i * 35;

              return (
                <line
                  key={`hy-${i}`}
                  x1={0}
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="rgba(255,255,255,0.04)"
                />
              );
            })}

            {/* AXIS */}

            <line
              x1={0}
              y1={centerY}
              x2={width}
              y2={centerY}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1.2}
            />

            <line
              x1={centerX}
              y1={0}
              x2={centerX}
              y2={height}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1.2}
            />

            {/* GRAPH */}

            <path
              d={pathData}
              fill="none"
              stroke="#ffffff"
              strokeWidth={2.2}
              strokeLinejoin="round"
              strokeLinecap="round"

              filter="
                drop-shadow(
                  0px 0px 10px rgba(255,255,255,0.20)
                )
              "
            />
          </svg>

          {/* LABEL */}

          <div
            style={{
              position: "absolute",

              top: 22,
              left: 22,

              padding:
                "10px 16px",

              borderRadius: 16,

              background:
                "rgba(0,0,0,0.30)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              color: "#ffffff",

              fontSize: 18,

              backdropFilter:
                "blur(16px)",
            }}
          >
            y = {expression}
          </div>
        </div>
      </div>
    </CalculatorGraphTheme>
  );
}