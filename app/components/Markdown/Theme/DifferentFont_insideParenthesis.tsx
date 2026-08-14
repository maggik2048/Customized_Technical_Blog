import React from "react";
// ❌ REMOVED: import { Jacquard_24 } from "next/font/google";

// ❌ REMOVED:
// const jacquard = Jacquard_24({
//   subsets: ["latin"],
//   weight: ["400"],
//   display: "swap",
//   preload: true,
// });

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
  const regex = /\(([^)]+)\)|=\s*([^=]+?)\s*=/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(children)) !== null) {
    if (match.index > lastIndex) {
      parts.push(children.slice(lastIndex, match.index));
    }

    const captured = match[1] || match[2];
    if (captured) {
      parts.push(
        <span
          key={match.index}
          // ✅ CHANGED: from className={`${jacquard.className} ${className}`} to className={`font-jacquard ${className}`}
          className={`font-jacquard ${className}`}
          style={{
            // ✅ CHANGED: Direct font name instead of 'Jacquard 24'
            fontFamily: "'Jacquard 24', 'Times New Roman', serif",
            fontSize: "0.46em",
            color: "#4a2c1a",
            letterSpacing: "0.03em",
            display: "inline-block",
            textShadow: "0 1px 2px rgba(0,0,0,0.15)",
            transform: "scale(1.02)",
            opacity: 0.7,
            ...style,
          }}
        >
          {captured}
        </span>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < children.length) {
    parts.push(children.slice(lastIndex));
  }

  return <>{parts}</>;
}

export default DifferentFont_insideParenthesis;