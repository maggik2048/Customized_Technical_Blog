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

    return Function(...Object.keys(scope), `return ${parsed}`)(
      ...Object.values(scope)
    );
  } catch {
    return NaN;
  }
}

/* ------------------------------------------------ */
/* COMPONENT */
/* ------------------------------------------------ */

export default function CalculatorGraphingInterface({
  onClose,
}: Props) {
  const [expression, setExpression] = useState("sin(x)");

  /* ----------------------------- */
  /* ZOOM STATE */
  /* ----------------------------- */
  const [zoom, setZoom] = useState(16);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    setZoom((z) => {
      const next = z - e.deltaY * 0.01;
      return Math.min(Math.max(next, 4), 60);
    });
  };

  /* ----------------------------- */
  /* GRAPH DATA */
  /* ----------------------------- */

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

  const handleKeyPress = (key: string) => {
    if (key === "CLR") return setExpression("");
    if (key === "=") return;
    setExpression((prev) => prev + key);
  };

  /* ----------------------------- */
  /* GRAPH CONFIG */
  /* ----------------------------- */

  const width = 820;
  const height = 520;

  const scaleX = zoom;
  const scaleY = zoom;

  const centerX = width / 2;
  const centerY = height / 2;

  const pathData = graphPoints
    .map((p, i) => {
      const px = centerX + p.x * scaleX;
      const py = centerY - p.y * scaleY;
      return `${i === 0 ? "M" : "L"} ${px} ${py}`;
    })
    .join(" ");

  /* tick spacing (Manim style) */
  const tickStep = 1;

  return (
    <CalculatorGraphTheme onClose={onClose}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "420px 1fr",
          gap: 28,
          fontFamily: "serif",
        }}
      >
        {/* LEFT */}
        <div
          style={{
            padding: 24,
            borderRadius: 30,
            background: "rgba(255,255,255,0.03)",
            border: "2px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            style={{
              height: 110,
              borderRadius: 22,
              background: "rgba(0,0,0,0.5)",
              border: "2px solid rgba(255,255,255,0.18)",
              padding: 20,
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 14, opacity: 0.6 }}>f(x)</div>
            <div style={{ fontSize: 34 }}>{expression || "0"}</div>
          </div>

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
                  height: 64,
                  borderRadius: 16,
                  border: "2px solid rgba(255,255,255,0.28)",
                  background: "rgba(255,255,255,0.05)",
                  fontSize: 20,
                  color: "#fff",
                  fontFamily: "serif",
                  cursor: "pointer",
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* GRAPH */}
        <div
          onWheel={handleWheel}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 34,
            border: "2px solid rgba(255,255,255,0.18)",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
          >
            {/* GRID (stronger Manim style) */}
            {Array.from({ length: 40 }).map((_, i) => {
              const x = i * 20;
              return (
                <line
                  key={`vx-${i}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={height}
                  stroke="rgba(255,255,255,0.08)"
                />
              );
            })}

            {Array.from({ length: 30 }).map((_, i) => {
              const y = i * 20;
              return (
                <line
                  key={`hy-${i}`}
                  x1={0}
                  y1={y}
                  x2={width}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                />
              );
            })}

            {/* AXIS (stronger) */}
            <line
              x1={0}
              y1={centerY}
              x2={width}
              y2={centerY}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={2}
            />

            <line
              x1={centerX}
              y1={0}
              x2={centerX}
              y2={height}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={2}
            />

            {/* AXIS TICKS + LABELS */}
            {Array.from({ length: 40 }).map((_, i) => {
              const xVal = i - 20;
              const px = centerX + xVal * scaleX;

              return (
                <text
                  key={`x-label-${i}`}
                  x={px}
                  y={centerY + 18}
                  fontSize={12}
                  fill="rgba(255,255,255,0.6)"
                >
                  {xVal}
                </text>
              );
            })}

            {Array.from({ length: 30 }).map((_, i) => {
              const yVal = 15 - i;
              const py = centerY - yVal * scaleY;

              return (
                <text
                  key={`y-label-${i}`}
                  x={centerX + 6}
                  y={py}
                  fontSize={12}
                  fill="rgba(255,255,255,0.6)"
                >
                  {yVal}
                </text>
              );
            })}

            {/* GRAPH */}
            <path
              d={pathData}
              fill="none"
              stroke="#ffffff"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="drop-shadow(0px 0px 10px rgba(255,255,255,0.25))"
            />
          </svg>

          {/* LABEL */}
          <div
            style={{
              position: "absolute",
              top: 22,
              left: 22,
              padding: "10px 16px",
              borderRadius: 16,
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            y = {expression}
          </div>

          {/* ZOOM INDICATOR */}
          <div
            style={{
              position: "absolute",
              bottom: 18,
              right: 18,
              padding: "8px 12px",
              borderRadius: 12,
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.2)",
              fontSize: 14,
            }}
          >
            zoom: {zoom.toFixed(1)}
          </div>
        </div>
      </div>
    </CalculatorGraphTheme>
  );
}