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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

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

  // physics rotation
  const [rotation, setRotation] = useState(0);
  const velocity = useRef(0);
  const targetRotation = useRef(0);
  const raf = useRef<number | null>(null);

  const selectedIndex = allButtons.findIndex((b) => b.id === theme);

  /** inertia loop */
  useEffect(() => {
    const animate = () => {
      const diff = targetRotation.current - rotation;

      velocity.current += diff * 0.08; // spring strength
      velocity.current *= 0.86; // damping

      const next = rotation + velocity.current;

      setRotation(next);

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

  /** particle galaxy */
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      x: Math.random() * 340,
      y: Math.random() * 340,
      r: Math.random() * 1.6 + 0.3,
      a: Math.random(),
    }));
  }, []);

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
      {/* GALAXY PARTICLES */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="white"
            opacity={0.08 + Math.sin(rotation * 0.01 + i) * 0.05}
          />
        ))}
      </svg>

      {/* OUTER RING (stronger visibility) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 0 55px rgba(0,0,0,0.55), inset 0 0 25px rgba(255,255,255,0.03)",
        }}
      />

      {/* ORBIT CONNECTION RING (stronger) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <circle
          cx="170"
          cy="170"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1.2"
        />
      </svg>

      {/* CONNECTION LINES BETWEEN BUTTONS */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {allButtons.map((_, i) => {
          const step = (Math.PI * 2) / allButtons.length;
          const a1 = i * step;
          const a2 = (i + 1) * step;

          const cx = 170;
          const cy = 170;

          const x1 = cx + Math.cos(a1) * radius;
          const y1 = cy + Math.sin(a1) * radius;

          const x2 = cx + Math.cos(a2) * radius;
          const y2 = cy + Math.sin(a2) * radius;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1.2"
            />
          );
        })}
      </svg>

      {/* ORBIT LAYER */}
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
              {/* counter rotate */}
              <div style={{ transform: `rotate(${-rotation}deg)` }}>
                {/* GLow trail for selected */}
                {selected && (
                  <svg
                    style={{
                      position: "absolute",
                      inset: -20,
                      width: 80,
                      height: 80,
                      pointerEvents: "none",
                    }}
                  >
                    <circle
                      cx="40"
                      cy="40"
                      r="28"
                      fill="none"
                      stroke={item.accent}
                      strokeWidth="2"
                      opacity="0.35"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      fill="none"
                      stroke={item.accent}
                      strokeWidth="1"
                      opacity="0.15"
                    />
                  </svg>
                )}

                <button
                  onClick={() => handleClick(item.id, index)}
                  style={{
                    width: selected ? 58 : 46,
                    height: selected ? 58 : 46,
                    borderRadius: "50%",

                    // transparent glass (stronger readability)
                    background: "rgba(255,255,255,0.02)",

                    border: selected
                      ? `1px solid ${item.accent}`
                      : "1px solid rgba(255,255,255,0.14)",

                    color: item.accent,
                    backdropFilter: "blur(8px)",

                    boxShadow: selected
                      ? `0 0 22px ${item.accent}55`
                      : "0 0 0 rgba(0,0,0,0)",

                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
          border: "1px solid rgba(255,255,255,0.14)",
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), rgba(0,0,0,0.7))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: activeAccent ?? "rgba(255,255,255,0.8)",
          fontSize: 10,
          letterSpacing: "0.25em",
        }}
      >
        SYS
      </div>
    </div>
  );
}