"use client";

import React from "react";

import { useDarkMode } from "@/app/context/DarkModeContext";

import CodeBlockWithCopy from "./CodeBlock_black";

import CodeBlock_white from "./CodeBlock_white";

interface Props {
  inline?: boolean;

  className?: string;

  children: React.ReactNode;
}

export default function CodeBlockThemeCoordinator({
  inline,
  className,
  children,
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
    >
      {children}
    </CodeBlock_white>
  );
}