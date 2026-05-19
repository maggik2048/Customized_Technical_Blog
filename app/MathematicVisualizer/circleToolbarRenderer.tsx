"use client";

import React from "react";
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
  const allButtons = [
    ...CALCULATOR_THEME_REGISTRY,
    ...extraButtons,
  ];

  const radius = 68;

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 40,
        width: 180,
        height: 180,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      {/* BACKDROP CIRCLE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `
            radial-gradient(
              circle at center,
              rgba(255,255,255,0.03),
              rgba(0,0,0,0.55)
            )
          `,
          border: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(20px)",
          boxShadow: `
            0px 0px 80px rgba(0,0,0,0.45),
            inset 0px 0px 24px rgba(255,255,255,0.04)
          `,
        }}
      />

      {/* CENTER LABEL */}
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `
            radial-gradient(
              circle at 30% 30%,
              rgba(255,255,255,0.12),
              rgba(0,0,0,0.58)
            )
          `,
          border: "1px solid rgba(255,255,255,0.12)",
          color: activeAccent ?? "#fff",
          fontSize: 10,
          letterSpacing: "0.22em",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        THEME
      </div>

      {/* BUTTONS */}
      {allButtons.map((item, index) => {
        const angle =
          (-90 + (index * 360) / allButtons.length) *
          (Math.PI / 180);

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        const selected = item.id === theme;
        const isSelectable = item.selectable !== false;

        return (
          <button
            key={item.id}
            disabled={!isSelectable}
            onClick={() => {
              if (isSelectable && item.id !== "add") {
                setTheme(item.id as CalculatorThemeType);
              }
            }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `
                translate(-50%, -50%)
                translate(${x}px, ${y}px)
              `,
              width: selected ? 54 : 46,
              height: selected ? 54 : 46,
              borderRadius: "50%",
              border: selected
                ? `1px solid ${item.accent}`
                : "1px solid rgba(255,255,255,0.10)",
              background: `
                radial-gradient(
                  circle at 30% 30%,
                  rgba(255,255,255,0.12),
                  rgba(0,0,0,0.52)
                )
              `,
              color: item.accent,
              cursor: isSelectable ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: item.id === "add" ? 22 : 9,
              letterSpacing: item.id === "add" ? "0" : "0.14em",
              backdropFilter: "blur(14px)",
              boxShadow: selected
                ? `0px 0px 24px ${item.accent}55`
                : "none",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}