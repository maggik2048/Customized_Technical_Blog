"use client";

import React from "react";

type Props = {
  title: string;
  children: (style: React.CSSProperties) => React.ReactNode;
};

export default function HeadertitleAdjustment({ title, children }: Props) {
  const style = React.useMemo(() => {
    const len = title?.length ?? 0;

    const maxSize = 58;
    const minSize = 38;

    // très court → plus grand qu'avant
    if (len <= 20) {
      return {
        fontSize: 48,
        lineHeight: 1.05,
        letterSpacing: "0.02em",
        textShadow: "0 3px 18px rgba(0,0,0,0.5)",
      };
    }

    // zone stable jusqu'à 30 caractères
    if (len <= 30) {
      return {
        fontSize: maxSize,
        lineHeight: 1.08,
        letterSpacing: "0.02em",
        textShadow: "0 3px 18px rgba(0,0,0,0.5)",
      };
    }

    // interpolation progressive à partir de 30
    const ratio = (len - 30) / (60 - 30);
    let fontSize = maxSize - ratio * (maxSize - minSize);

    //  핵심 수정: 너무 작아지는 것만 살짝 방지
    fontSize = Math.max(30, fontSize);

    return {
      fontSize: Math.round(fontSize),
      lineHeight: 1.12,
      letterSpacing: "0.02em",
      textShadow: "0 3px 18px rgba(0,0,0,0.5)",
    };
  }, [title]);

  return <>{children(style)}</>;
}