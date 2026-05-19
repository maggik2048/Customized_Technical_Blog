// BasicRenderer.tsx

"use client";

import React, {
  useEffect,
  useRef,
} from "react";

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

import {
  calculatePolygonAreas,
  PolygonAreaData,
} from "./6_AreaCalculator";

// 핵심 변경
import {
  replaceGrayRangeWithHatch,
} from "./1_hatchWithOneSide";

import {
  useAnnotationManager,
} from "./annotationManager";

type Props = {
  img: HTMLImageElement;
  threshold?: number;
};

export default function BasicRenderer({
  img,
  threshold = 128,
}: Props) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );

  const { annotations } =
    useAnnotationManager();

  useEffect(() => {
    if (!canvasRef.current || !img)
      return;

    render();
  }, [
    img,
    threshold,
    annotations,
  ]);

  const render = () => {
    const canvas =
      canvasRef.current!;

    const ctx =
      canvas.getContext("2d")!;

    // ====================
    // resize
    // ====================

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // ====================
    // original image
    // ====================

    ctx.drawImage(img, 0, 0);

    // ====================
    // threshold
    // ====================

    if (
      annotations.showThreshold
    ) {
      applyThreshold(
        canvas,
        threshold
      );
    }

    // ====================
    // IMPORTANT
    //
    // threshold의 검은 영역을
    // hatch로 "교체"
    //
    // multiply 아님
    // overlay 아님
    // 뒤에 깔리는것도 아님
    //
    // 실제 픽셀 replacement
    // ====================

    if (
      annotations.showHatching
    ) {
      replaceGrayRangeWithHatch(
        canvas,
        {
          // 검은색만 hatch로 치환
          minGray: 0,
          maxGray: 1,

          blockSize: 6,

          lineWidth: 1,

          hatchColor: "#000",

          backgroundColor:
            "#fff",

          coverageThreshold: 0.5,
        }
      );
    }

    // ====================
    // convex decomposition
    // ====================

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

    console.log(
      "polygons",
      polygons
    );

    console.log(
      "directionData",
      directionData
    );

    // ====================
    // longest side
    // ====================

    let longestSideData: any =
      null;

    if (
      annotations.showLongestSide
    ) {
      longestSideData =
        processLongestSides(
          canvas,
          polygons
        );

      console.log(
        "longestSideData",
        longestSideData
      );
    }

    // ====================
    // perpendicular
    // ====================

    if (
      annotations.showPerpendicular &&
      longestSideData
    ) {
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
    }

    // ====================
    // area text
    // ====================

    if (
      annotations.showAreaText
    ) {
      const areaData:
        PolygonAreaData[] =
        calculatePolygonAreas(
          canvas,
          polygons
        );

      console.log(
        "areaData",
        areaData
      );
    }
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