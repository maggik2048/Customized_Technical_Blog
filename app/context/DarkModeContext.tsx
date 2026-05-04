"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DarkModeContextType {
  mode: "light" | "dark";
  codeDark: boolean;
  toggle: () => void;
  toggleCode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  mode: "light",
  codeDark: false,
  toggle: () => {},
  toggleCode: () => {},
});

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [codeDark, setCodeDark] = useState(false);

  const toggle = () =>
    setMode((m) => (m === "light" ? "dark" : "light"));

  const toggleCode = () =>
    setCodeDark((v) => !v);

  return (
    <DarkModeContext.Provider value={{ mode, codeDark, toggle, toggleCode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);