"use client";

import React from "react";

type Props = {
  title: string;
  children: (style: React.CSSProperties) => React.ReactNode;
};

export default function HeadertitleAdjustment({ title, children }: Props) {
  const style = React.useMemo(() => {
    const len = title?.length ?? 0;

    const maxSize = 42;
    const minSize = 28;

    // taille max si court
    if (len <= 20) {
      return {
        fontSize: maxSize,
        lineHeight: 1.08,
        letterSpacing: "0.02em",
        textShadow: "0 3px 18px rgba(0,0,0,0.5)",
      };
    }

    // taille min si très long
    if (len >= 60) {
      return {
        fontSize: minSize,
        lineHeight: 1.15,
        letterSpacing: "0.02em",
        textShadow: "0 3px 18px rgba(0,0,0,0.5)",
      };
    }

    // interpolation progressive
    const ratio = (len - 20) / (60 - 20);
    const fontSize = Math.round(maxSize - ratio * (maxSize - minSize));

    return {
      fontSize,
      lineHeight: 1.12,
      letterSpacing: "0.02em",
      textShadow: "0 3px 18px rgba(0,0,0,0.5)",
    };
  }, [title]);

  return <>{children(style)}</>;
}