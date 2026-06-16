// app/components/CodeSnippet.tsx
"use client";

import { useDarkMode } from "../context/DarkModeContext"; // Removed .tsx

export default function CodeSnippet({ code }: { code: string }) {
  const { mode } = useDarkMode();

  return (
    <pre
      style={{
        padding: "16px",
        borderRadius: "8px",
        overflowX: "auto",
        backgroundColor: mode === "light" ? "#f3f4f6" : "#1e1e1e",
        color: mode === "light" ? "#111" : "#eee",
      }}
    >
      <code>{code}</code>
    </pre>
  );
}