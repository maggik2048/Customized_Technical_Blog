// app/context/DarkModeContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DarkModeContextType {
  mode: "light" | "dark";
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextType>({
  mode: "light",
  toggle: () => {},
});

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const toggle = () => setMode(mode === "light" ? "dark" : "light");

  return (
    <DarkModeContext.Provider value={{ mode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => useContext(DarkModeContext);