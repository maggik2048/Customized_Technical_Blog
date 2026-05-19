"use client";

import React, { useEffect, useRef } from "react";

import { applyThreshold } from "./0_threshold";
import { convexDecomposition } from "./3_convexDecomposition";

import {
  processLongestSides,
  PolygonDirectionData,
  PolygonPoint,
} from "./4_longestside";

import {
  getPerpendicularDirections,
  PerpendicularDirectionData,
} from "./5_getPerpendicular";

type Props = {
  img: HTMLImageElement;
  threshold?: number;
};

export default function BasicRenderer({
  img,
  threshold = 128,
}: Props) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

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

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // STEP 0: original image
    ctx.drawImage(img, 0, 0);

    // STEP 1: threshold
    applyThreshold(canvas, threshold);

    // STEP 2: convex decomposition
    const result =
      convexDecomposition(canvas);

    if (!result) return;

    const {
      polygons,
      directionData,
    }: {
      polygons: PolygonPoint[][];
      directionData: PolygonDirectionData[];
    } = result;

    // STEP 3:
    // longest side 계산 + 노란선 draw
    const longestSideData =
      processLongestSides(
        canvas,
        polygons
      );

    console.log(
      "polygons",
      polygons
    );

    console.log(
      "directionData",
      directionData
    );

    // STEP 4:
    // perpendicular 계산 + 하늘색선 draw
    const perpendicularData:
      PerpendicularDirectionData[] =
      getPerpendicularDirections(
        canvas,
        longestSideData
      );

    console.log(
      "perpendicularData",
      perpendicularData
    );
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