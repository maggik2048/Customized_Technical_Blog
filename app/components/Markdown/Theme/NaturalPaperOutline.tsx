```tsx
"use client";

import React, {
  useMemo,
} from "react";

export default function NaturalPaperOutline({
  children,
}: {
  children: React.ReactNode;
}) {

  const clipPath =
    useMemo(() => {

      /*
        자연스러운 종이 outline
        너무 랜덤하면 렌더마다 흔들리므로
        고정 polygon 사용
      */

      return `
        polygon(
          0.8% 2.2%,
          3.5% 0.6%,
          8% 1.1%,
          14% 0.4%,
          21% 1.2%,
          28% 0.5%,
          36% 1.4%,
          43% 0.7%,
          51% 1.3%,
          58% 0.4%,
          66% 1.1%,
          73% 0.5%,
          81% 1.4%,
          89% 0.8%,
          96.5% 1.8%,
          99.2% 4.4%,

          99.5% 10%,
          98.8% 18%,
          99.4% 26%,
          98.7% 34%,
          99.3% 43%,
          98.6% 51%,
          99.2% 60%,
          98.5% 69%,
          99.1% 77%,
          98.4% 86%,
          99.3% 94%,

          96.8% 98.4%,
          89% 99.1%,
          82% 98.3%,
          75% 99.4%,
          67% 98.6%,
          59% 99.3%,
          52% 98.4%,
          45% 99.2%,
          38% 98.5%,
          30% 99.4%,
          23% 98.6%,
          16% 99.3%,
          9% 98.5%,
          3% 99.1%,
          0.7% 96%,

          0.4% 88%,
          1.2% 79%,
          0.5% 71%,
          1.4% 63%,
          0.6% 54%,
          1.1% 46%,
          0.5% 37%,
          1.3% 28%,
          0.7% 19%,
          1.2% 11%
        )
      `;
    }, []);

  return (

    <div
      style={{

        position: "relative",

        clipPath,

        WebkitClipPath: clipPath,

        overflow: "hidden",

        isolation: "isolate",

        transform:
          "translateZ(0)",
      }}
    >
      {/* PAPER EDGE SHADOW */}
      <div
        style={{

          position: "absolute",

          inset: 0,

          pointerEvents: "none",

          boxShadow:
            `
              inset 0 0 0 1px rgba(90,60,30,0.04),
              inset 0 0 28px rgba(0,0,0,0.04)
            `,

          mixBlendMode:
            "multiply",

          zIndex: 2,
        }}
      />

      {children}

    </div>
  );
}
```
