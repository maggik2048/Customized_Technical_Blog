// CalculatorGraphTheme.tsx
"use client";

import React from "react";
import CalculatorGraphVintageTheme from "./CalculatorGraphVintageTheme";

type Props = {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
};

export default function CalculatorGraphTheme({
  children,
  title = "MECHANICAL GRAPH CALCULATOR",
  onClose,
}: Props) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",

        /* ORIGINAL SIZE 유지 */
        paddingTop: 90,
        paddingBottom: 60,

        boxSizing: "border-box",
      }}
    >
      <CalculatorGraphVintageTheme
        title={title}
        onClose={onClose}
      >
        {children}
      </CalculatorGraphVintageTheme>
    </div>
  );
}