"use client";

import React from "react";
import { useDarkMode } from "@/app/contexts/DarkModeContext";
import CodeBlockWithCopy from "./CodeBlock_black";
import CodeBlock_white from "./CodeBlock_white";

interface Props {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  index?: number;  // ✅ index prop added!
}

export default function CodeBlockThemeCoordinator({
  inline, // Keep this in props but don't pass it down
  className,
  children,
  index = 0,  // ✅ default value 0
}: Props) {
  const { codeDark } = useDarkMode();

  // ===============================
  // DARK CODE THEME
  // ===============================
  if (codeDark) {
    return (
      <CodeBlockWithCopy
        className={className}
        index={index}  // ✅ index 전달
      >
        {children}
      </CodeBlockWithCopy>
    );
  }

  // ===============================
  // LIGHT CODE THEME
  // ===============================
  return (
    <CodeBlock_white
      className={className}
      index={index}  // ✅ index 전달
    >
      {children}
    </CodeBlock_white>
  );
}