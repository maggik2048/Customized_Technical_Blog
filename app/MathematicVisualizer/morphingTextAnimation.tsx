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
  const offA = useRef<HTMLCanvasElement | null>(null);
  const offB = useRef<HTMLCanvasElement | null>(null);

  const [t, setT] = useState(0);

  // animation driver
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

  // render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;

    const w = (canvas.width = size);
    const h = (canvas.height = 120);

    if (!offA.current) offA.current = document.createElement("canvas");
    if (!offB.current) offB.current = document.createElement("canvas");

    const a = offA.current!;
    const b = offB.current!;

    a.width = b.width = w;
    a.height = b.height = h;

    const aCtx = a.getContext("2d")!;
    const bCtx = b.getContext("2d")!;

    // draw Σ
    aCtx.clearRect(0, 0, w, h);
    aCtx.fillStyle = "white";
    aCtx.font = "70px serif";
    aCtx.textAlign = "center";
    aCtx.textBaseline = "middle";
    aCtx.fillText("Σ", w / 2, h / 2);

    // draw ∀
    bCtx.clearRect(0, 0, w, h);
    bCtx.fillStyle = "white";
    bCtx.font = "70px serif";
    bCtx.textAlign = "center";
    bCtx.textBaseline = "middle";
    bCtx.fillText("∀", w / 2, h / 2);

    const dataA = aCtx.getImageData(0, 0, w, h).data;
    const dataB = bCtx.getImageData(0, 0, w, h).data;

    ctx.clearRect(0, 0, w, h);

    const time = t * Math.PI * 2;

    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        const i = (y * w + x) * 4;

        const aAlpha = dataA[i + 3];
        const bAlpha = dataB[i + 3];

        // 🔥 CROSS MORPH WEIGHT
        const wa = (1 - t) * (aAlpha / 255);
        const wb = t * (bAlpha / 255);

        const intensity = wa + wb;

        if (intensity > 0.05) {
          // field warp (shared space deformation)
          const dx =
            Math.sin(y * 0.08 + time) * 5 +
            Math.sin((x + y) * 0.03 + time) * 2;

          const dy =
            Math.cos(x * 0.08 + time) * 5 +
            Math.sin(y * 0.05 + time * 1.5) * 2;

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