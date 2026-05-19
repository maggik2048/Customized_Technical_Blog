"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  CalculatorThemeType,
  getCalculatorTheme,
} from "./CalculatorThemeRegistry";

import CircleToolbarRenderer from "./circleToolbarRenderer";

type Props = {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
};

/* ------------------------------ */
/* THEME CONTEXT */
/* ------------------------------ */

type ThemeContextType = {
  theme: CalculatorThemeType;
};

const CalculatorThemeContext = createContext<ThemeContextType>({
  theme: "raw",
});

export function useCalculatorTheme() {
  return useContext(CalculatorThemeContext);
}

/* ------------------------------ */
/* EXTRA BUTTONS */
/* ------------------------------ */

const EXTRA_BUTTONS = [
  {
    id: "add",
    label: "+",
    accent: "#8cb7ff",
    selectable: false,
  },
] as const;

/* ------------------------------ */
/* COMPONENT */
/* ------------------------------ */

export default function CalculatorGraphTheme({
  children,
  title = "MECHANICAL GRAPH CALCULATOR",
  onClose,
}: Props) {
  const [theme, setTheme] =
    useState<CalculatorThemeType>("raw");

  const activeTheme = useMemo(
    () => getCalculatorTheme(theme),
    [theme]
  );

  const renderedContent = (
    <CalculatorThemeContext.Provider value={{ theme }}>
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
      {/* CIRCLE TOOLBAR (EXTRACTED) */}
      <CircleToolbarRenderer
        theme={theme}
        setTheme={setTheme}
        activeAccent={activeTheme?.accent}
        extraButtons={EXTRA_BUTTONS}
      />

      {/* ACTIVE THEME RENDER */}
      {activeTheme?.render(renderedContent, {
        title,
        onClose,
      })}
    </div>
  );
}