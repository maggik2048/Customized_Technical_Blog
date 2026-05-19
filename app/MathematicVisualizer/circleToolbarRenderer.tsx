"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const radius = 120;
  const cx = 170;
  const cy = 170;

  const [rotation, setRotation] = useState(0);
  const velocity = useRef(0);
  const targetRotation = useRef(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      const diff = targetRotation.current - rotation;

      velocity.current += diff * 0.09;
      velocity.current *= 0.84;

      setRotation((r) => {
        const next = r + velocity.current;
        return next;
      });

      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [rotation]);

  const handleClick = (itemId: string, index: number) => {
    if (itemId === "add") return;

    setTheme(itemId as CalculatorThemeType);

    const step = 360 / allButtons.length;
    targetRotation.current = -index * step;
  };

  const particles = useMemo(
    () =>
      Array.from({ length: 40 }).map(() => ({
        x: Math.random() * 340,
        y: Math.random() * 340,
        r: Math.random() * 1.6 + 0.3,
      })),
    []
  );

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
      {/* PARTICLES (조금 더 보이게) */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="white"
            opacity={0.12}
          />
        ))}
      </svg>

      {/* ORBIT SYSTEM (강화된 핵심) */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {/* 가장 강한 기준 orbit */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.4"
        />

        {/* outer thick glow orbit */}
        <circle
          cx={cx}
          cy={cy}
          r={radius + 6}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="2.2"
        />

        {/* dashed strong orbit */}
        <circle
          cx={cx}
          cy={cy}
          r={radius - 8}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.4"
          strokeDasharray="3 6"
        />

        {/* segmented heavy orbit (|||| 느낌 강화) */}
        <circle
          cx={cx}
          cy={cy}
          r={radius + 14}
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.2"
          strokeDasharray="10 8 2 8"
        />

        {/* inner fine orbit */}
        <circle
          cx={cx}
          cy={cy}
          r={radius - 16}
          fill="none"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
          strokeDasharray="1 6"
        />
      </svg>

      {/* CONNECTION LINES (더 진하게 + 구조화) */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {allButtons.map((_, i) => {
          const step = (Math.PI * 2) / allButtons.length;

          const a1 = i * step;
          const a2 = (i + 1) * step;

          const x1 = cx + Math.cos(a1) * radius;
          const y1 = cy + Math.sin(a1) * radius;

          const x2 = cx + Math.cos(a2) * radius;
          const y2 = cy + Math.sin(a2) * radius;

          const mode = i % 4;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={
                mode === 0
                  ? "rgba(255,255,255,0.32)"
                  : mode === 1
                  ? "rgba(255,255,255,0.18)"
                  : mode === 2
                  ? "rgba(255,255,255,0.24)"
                  : "rgba(255,255,255,0.14)"
              }
              strokeWidth={mode === 0 ? 1.8 : 1.2}
              strokeDasharray={
                mode === 1
                  ? "2 7"
                  : mode === 2
                  ? "6 3"
                  : mode === 3
                  ? "1 5"
                  : "none"
              }
            />
          );
        })}
      </svg>

      {/* ORBIT ITEMS */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        {allButtons.map((item, index) => {
          const angle =
            (-90 + (index * 360) / allButtons.length) * (Math.PI / 180);

          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const selected = item.id === theme;

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
              <div style={{ transform: `rotate(${-rotation}deg)` }}>
                {selected && (
                  <svg
                    style={{
                      position: "absolute",
                      inset: -18,
                      width: 80,
                      height: 80,
                      pointerEvents: "none",
                    }}
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="30"
                      fill="none"
                      stroke={item.accent}
                      strokeWidth="2"
                      opacity="0.45"
                    />
                  </svg>
                )}

                <button
                  onClick={() => handleClick(item.id, index)}
                  style={{
                    width: selected ? 60 : 46,
                    height: selected ? 60 : 46,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.03)",
                    border: selected
                      ? `1.5px solid ${item.accent}`
                      : "1px solid rgba(255,255,255,0.18)",
                    color: item.accent,
                    backdropFilter: "blur(10px)",
                    boxShadow: selected
                      ? `0 0 26px ${item.accent}66`
                      : "none",
                    cursor: "pointer",
                    fontSize: 9,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* CENTER CORE (더 또렷하게) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 82,
          height: 82,
          borderRadius: "50%",
          border: "1.2px solid rgba(255,255,255,0.22)",
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), rgba(0,0,0,0.8))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: activeAccent ?? "rgba(255,255,255,0.85)",
          fontSize: 10,
          letterSpacing: "0.3em",
        }}
      >
        Theme
      </div>
    </div>
  );
}