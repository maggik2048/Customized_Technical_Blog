// CalculatorGraphTheme.tsx
"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import CalculatorGraphVintageTheme from "./CalculatorGraphVintageTheme";

export type CalculatorThemeType =
  | "raw"
  | "vintage";

type Props = {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
};

type ThemeOption = {
  id: CalculatorThemeType | "add";
  label: string;
  accent: string;
  selectable?: boolean;
};

/* ------------------------------------------------ */
/* THEME CONTEXT */
/* ------------------------------------------------ */

type ThemeContextType = {
  theme: CalculatorThemeType;
};

const CalculatorThemeContext =
  createContext<ThemeContextType>({
    theme: "raw",
  });

export function useCalculatorTheme() {
  return useContext(
    CalculatorThemeContext
  );
}

/* ------------------------------------------------ */
/* THEME OPTIONS */
/* ------------------------------------------------ */

const THEMES: ThemeOption[] = [
  {
    id: "raw",
    label: "RAW",
    accent: "#d7dce2",
  },
  {
    id: "vintage",
    label: "VINTAGE",
    accent: "#f0c48d",
  },
  {
    id: "add",
    label: "+",
    accent: "#8cb7ff",
    selectable: false,
  },
];

export default function CalculatorGraphTheme({
  children,
  title = "MECHANICAL GRAPH CALCULATOR",
  onClose,
}: Props) {
  const [theme, setTheme] =
    useState<CalculatorThemeType>(
      "raw"
    );

  const activeTheme = useMemo(
    () =>
      THEMES.find(
        (themeOption) =>
          themeOption.id === theme
      ),
    [theme]
  );

  const renderedContent = (
    <CalculatorThemeContext.Provider
      value={{ theme }}
    >
      {children}
    </CalculatorThemeContext.Provider>
  );

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",

        paddingTop: 90,
        paddingBottom: 60,

        boxSizing: "border-box",

        position: "relative",
      }}
    >
      {/* -------------------------------- */}
      {/* DESTINY STYLE SELECTOR */}
      {/* -------------------------------- */}

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

            border:
              "1px solid rgba(255,255,255,0.10)",

            backdropFilter: "blur(20px)",

            boxShadow: `
              0px 0px 80px rgba(0,0,0,0.45),
              inset 0px 0px 24px rgba(255,255,255,0.04)
            `,
          }}
        />

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

            border:
              "1px solid rgba(255,255,255,0.12)",

            color:
              activeTheme?.accent ??
              "#ffffff",

            fontSize: 10,
            letterSpacing: "0.22em",

            fontFamily:
              "Inter, system-ui, sans-serif",
          }}
        >
          THEME
        </div>

        {THEMES.map((item, index) => {
          const angle =
            (-90 + index * 120) *
            (Math.PI / 180);

          const radius = 68;

          const x =
            Math.cos(angle) * radius;

          const y =
            Math.sin(angle) * radius;

          const selected =
            item.id === theme;

          const isSelectable =
            item.selectable !== false;

          return (
            <button
              key={item.id}
              disabled={!isSelectable}
              onClick={() => {
                if (
                  item.id === "raw" ||
                  item.id === "vintage"
                ) {
                  setTheme(item.id);
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

                width: selected
                  ? 54
                  : 46,

                height: selected
                  ? 54
                  : 46,

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

                cursor: isSelectable
                  ? "pointer"
                  : "default",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                fontSize:
                  item.id === "add"
                    ? 22
                    : 9,

                letterSpacing:
                  item.id === "add"
                    ? "0"
                    : "0.14em",

                backdropFilter:
                  "blur(14px)",

                boxShadow: selected
                  ? `
                    0px 0px 24px ${item.accent}55
                  `
                  : "none",
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* -------------------------------- */}
      {/* RAW */}
      {/* -------------------------------- */}

      {theme === "raw" && (
        <div
          style={{
            width: 1480,
            maxWidth: "96vw",
          }}
        >
          {renderedContent}
        </div>
      )}

      {/* -------------------------------- */}
      {/* VINTAGE */}
      {/* -------------------------------- */}

      {theme === "vintage" && (
        <CalculatorGraphVintageTheme
          title={title}
          onClose={onClose}
        >
          {renderedContent}
        </CalculatorGraphVintageTheme>
      )}
    </div>
  );
}