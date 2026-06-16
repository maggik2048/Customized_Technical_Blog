// DifferentFont_insideParenthesis.tsx
import React from "react";
import { Metamorphous } from "next/font/google";

// Initialize Metamorphous font with Next.js font loader
const metamorphous = Metamorphous({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
});

interface DifferentFont_insideParenthesisProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
}

export function DifferentFont_insideParenthesis({ 
  children, 
  className = "",
  style = {} 
}: DifferentFont_insideParenthesisProps) {
  // Match text inside (...) or =...=
  // Handles: (text) or = text = (with optional spaces)
  const regex = /\(([^)]+)\)|=\s*([^=]+?)\s*=/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(children)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }

    // The captured text is either in group 1 (parentheses) or group 2 (equals)
    const captured = match[1] || match[2];
    if (captured) {
      parts.push(
        <span
          key={match.index}
          className={`${metamorphous.className} ${className}`}
          style={{
            fontFamily: "'Metamorphous', 'Times New Roman', serif",
            fontSize: "0.46em", // 1.15 / 2.5 = 0.46 (2.5 times smaller)
            color: "#4a2c1a",
            letterSpacing: "0.03em",
            display: "inline-block",
            textShadow: "0 1px 2px rgba(0,0,0,0.15)",
            transform: "scale(1.02)",
            opacity: 0.7, // 70% opacity
            ...style,
          }}
        >
          {captured}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return <>{parts}</>;
}

export default DifferentFont_insideParenthesis;