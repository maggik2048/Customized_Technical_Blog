"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface PostDarkModeContextType {
  mode: "light" | "dark";
  toggle: () => void;
}

const PostDarkModeContext = createContext<PostDarkModeContextType | undefined>(undefined);

export function PostDarkModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const toggle = () => setMode(mode === "light" ? "dark" : "light");

  return (
    <PostDarkModeContext.Provider value={{ mode, toggle }}>
      {children}
    </PostDarkModeContext.Provider>
  );
}

export function usePostDarkMode() {
  const context = useContext(PostDarkModeContext);
  if (!context) throw new Error("usePostDarkMode must be used within PostDarkModeProvider");
  return context;
}