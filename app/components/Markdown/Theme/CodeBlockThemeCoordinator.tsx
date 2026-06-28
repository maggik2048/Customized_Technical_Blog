"use client";

import React from "react";
import { useDarkMode } from "@/app/contexts/DarkModeContext";
import CodeBlockWithCopy from "./CodeBlock_black";
import CodeBlock_white from "./CodeBlock_white";

interface Props {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  index?: number;  // ✅ index prop 추가!
}

export default function CodeBlockThemeCoordinator({
  inline,
  className,
  children,
  index = 0,  // ✅ 기본값 0
}: Props) {
  const { codeDark } = useDarkMode();

  // ===============================
  // DARK CODE THEME
  // ===============================
  if (codeDark) {
    return (
      <CodeBlockWithCopy
        inline={inline}
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
      inline={inline}
      className={className}
      index={index}  // ✅ index 전달
    >
      {children}
    </CodeBlock_white>
  );
}