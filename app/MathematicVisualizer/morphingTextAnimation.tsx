"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  active: boolean;
  size?: number;
};

export default function MorphingTextAnimation({
  active,
  size = 220,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [t, setT] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let frame: number;

    const animate = (time: number) => {
      if (!start) start = time;

      const raw = (time - start) / 800;

      const value = active
        ? Math.min(raw, 1)
        : Math.max(1 - raw, 0);

      setT(value);

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    const w = (canvas.width = size);
    const h = (canvas.height = 120);

    const offA = document.createElement("canvas");
    const offB = document.createElement("canvas");

    offA.width = offB.width = w;
    offA.height = offB.height = h;

    const aCtx = offA.getContext("2d")!;
    const bCtx = offB.getContext("2d")!;

    const renderGlyph = (
      ctx: CanvasRenderingContext2D,
      text: string
    ) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "white";
      ctx.font = "70px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h / 2);
    };

    const smooth = t * t * (3 - 2 * t);
    const sigmaGate = Math.pow(1 - smooth, 2.5);
    const forallGate = Math.pow(smooth, 2.5);
    const warpIntensity = 1 - smooth;

    const time = t * Math.PI * 2;

    ctx.clearRect(0, 0, w, h);

    // 🔥 CRITICAL FIX: 매 frame마다 glyph 재렌더링
    renderGlyph(aCtx, "Σ");
    renderGlyph(bCtx, "∀");

    const dataA = aCtx.getImageData(0, 0, w, h).data;
    const dataB = bCtx.getImageData(0, 0, w, h).data;

    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const i = (y * w + x) * 4;

        const aAlpha = dataA[i + 3];
        const bAlpha = dataB[i + 3];

        const sigma = (aAlpha / 255) * sigmaGate;
        const forall = (bAlpha / 255) * forallGate;

        const intensity = sigma + forall;

        if (intensity > 0.02) {
          const dx =
            (Math.sin(y * 0.08 + time) * 5 +
              Math.sin((x + y) * 0.03 + time) * 2) *
            warpIntensity;

          const dy =
            (Math.cos(x * 0.08 + time) * 5 +
              Math.sin(y * 0.05 + time * 1.5) * 2) *
            warpIntensity;

          ctx.fillStyle = `rgba(255,255,255,${intensity})`;
          ctx.fillRect(x + dx, y + dy, 2, 2);
        }
      }
    }
  }, [t, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: size,
        height: 120,
        display: "block",
      }}
    />
  );
}