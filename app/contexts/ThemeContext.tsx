// app/contexts/ThemeContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";

type ThemeType = 'note' | 'letter' | 'default';

type ThemeContextType = {
  isNoteTheme: boolean;
  isLetterTheme: boolean;
  isDefaultTheme: boolean;
  themeType: ThemeType;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ 
  children, 
  theme 
}: { 
  children: ReactNode;
  theme: ThemeType;
}) {
  const value = React.useMemo(() => ({
    isNoteTheme: theme === 'note',
    isLetterTheme: theme === 'letter',
    isDefaultTheme: theme === 'default',
    themeType: theme,
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}