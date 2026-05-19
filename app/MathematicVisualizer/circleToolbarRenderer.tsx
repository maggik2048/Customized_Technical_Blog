"use client";

import React, { useMemo, useState } from "react";
import {
  CALCULATOR_THEME_REGISTRY,
  CalculatorThemeType,
} from "./CalculatorThemeRegistry";

type ExtraButton = {
  id: string;
  label: string;
  accent: string;
  selectable?: boolean;
};

type Props = {
  theme: CalculatorThemeType;
  setTheme: (t: CalculatorThemeType) => void;
  activeAccent?: string;
  extraButtons?: readonly ExtraButton[];
};

export default function CircleToolbarRenderer({
  theme,
  setTheme,
  activeAccent,
  extraButtons = [],
}: Props) {
  const allButtons = useMemo(
    () => [...CALCULATOR_THEME_REGISTRY, ...extraButtons],
    [extraButtons]
  );

  const [rotation, setRotation] = useState(0);

  const radius = 120;

  const handleClick = (itemId: string, index: number) => {
    if (itemId === "add") return;

    setTheme(itemId as CalculatorThemeType);

    const step = 360 / allButtons.length;
    const targetRotation = -index * step;

    setRotation((prev) => prev + (targetRotation - (prev % 360)));
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 40,
        width: 340,
        height: 340,
        zIndex: 100,
      }}
    >
      {/* OUTER LUXURY RING */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow:
            "0 0 70px rgba(0,0,0,0.75), inset 0 0 30px rgba(255,255,255,0.03)",
        }}
      />

      {/* SECOND RING */}
      <div
        style={{
          position: "absolute",
          inset: 30,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      />

      {/* SPOKES */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;

        const cx = 170;
        const cy = 170;

        const x1 = cx + Math.cos(angle) * 160;
        const y1 = cy + Math.sin(angle) * 160;
        const x2 = cx + Math.cos(angle) * 120;
        const y2 = cy + Math.sin(angle) * 120;

        return (
          <svg
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          </svg>
        );
      })}

      {/* CENTER CORE */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 78,
          height: 78,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.12)",
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), rgba(0,0,0,0.78))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: activeAccent ?? "rgba(255,255,255,0.8)",
          fontSize: 10,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          backdropFilter: "blur(10px)",
        }}
      >
        SYS
      </div>

      {/* ROTATING ORBIT LAYER */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotate(${rotation}deg)`,
          transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {allButtons.map((item, index) => {
          const angle =
            (-90 + (index * 360) / allButtons.length) * (Math.PI / 180);

          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const selected = item.id === theme;
          const isSelectable = item.selectable !== false;

          return (
            <div
              key={item.id}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              }}
            >
              {/* COUNTER ROTATION WRAPPER (핵심) */}
              <div
                style={{
                  transform: `rotate(${-rotation}deg)`,
                }}
              >
                <button
                  disabled={!isSelectable}
                  onClick={() => handleClick(item.id, index)}
                  style={{
                    width: selected ? 56 : 46,
                    height: selected ? 56 : 46,
                    borderRadius: "50%",
                    border: selected
                      ? `1px solid ${item.accent}`
                      : "1px solid rgba(255,255,255,0.08)",
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.07), rgba(0,0,0,0.72))",
                    color: item.accent,
                    cursor: isSelectable ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: item.id === "add" ? 18 : 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    boxShadow: selected
                      ? `0 0 26px ${item.accent}55`
                      : "0 0 0 rgba(0,0,0,0)",
                    backdropFilter: "blur(10px)",
                    transition: "all 220ms ease",
                  }}
                >
                  {item.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}