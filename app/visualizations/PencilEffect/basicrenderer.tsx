"use client";

import React, { useEffect, useRef } from "react";
import { applyThreshold } from "./0_threshold";
import { convexDecomposition } from "./3_convexDecomposition";

type Props = {
  img: HTMLImageElement;
  threshold?: number;
};

export default function BasicRenderer({
  img,
  threshold = 128,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !img) return;

    render();
  }, [img, threshold]);

  const render = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // clear + resize
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw original image
    ctx.drawImage(img, 0, 0);

    // STEP 1: threshold (UI controlled)
    applyThreshold(canvas, threshold);

    // STEP 2: convex decomposition
    convexDecomposition(canvas);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        maxWidth: "90vw",
        maxHeight: "90vh",
        border: "1px solid #444",
        display: "block",
      }}
    />
  );
}