// CalculatorThemeRegistry.tsx
"use client";

import React from "react";

import CalculatorGraphVintageTheme from "./CalculatorGraphVintageTheme";

export type CalculatorThemeType =
  | "raw"
  | "vintage";

export type CalculatorThemeDefinition = {
  id: CalculatorThemeType;

  label: string;

  accent: string;

  selectable?: boolean;

  render: (
    children: React.ReactNode,
    options?: {
      title?: string;
      onClose?: () => void;
    }
  ) => React.ReactNode;
};

/* ------------------------------------------------ */
/* REGISTRY */
/* ------------------------------------------------ */

export const CALCULATOR_THEME_REGISTRY: CalculatorThemeDefinition[] =
  [
    {
      id: "raw",

      label: "RAW",

      accent: "#d7dce2",

      render: (children) => (
        <div
          style={{
            width: 1480,
            maxWidth: "96vw",
          }}
        >
          {children}
        </div>
      ),
    },

    {
      id: "vintage",

      label: "VINTAGE",

      accent: "#f0c48d",

      render: (
        children,
        options
      ) => (
        <CalculatorGraphVintageTheme
          title={options?.title}
          onClose={options?.onClose}
        >
          {children}
        </CalculatorGraphVintageTheme>
      ),
    },
  ];

/* ------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------ */

export function getCalculatorTheme(
  themeId: CalculatorThemeType
) {
  return CALCULATOR_THEME_REGISTRY.find(
    (theme) => theme.id === themeId
  );
}