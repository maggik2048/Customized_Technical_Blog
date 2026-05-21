// 6_AreaCalculator.ts

import { PolygonPoint } from "./4_longestside";

export interface PolygonAreaData {
  polygonIndex: number;
  area: number;
  center: {
    x: number;
    y: number;
  };
}

/**
 * 각 polygon의 면적 계산 + 중앙 좌표 계산 + canvas 출력
 */
export function calculatePolygonAreas(
  canvas: HTMLCanvasElement,
  polygons: PolygonPoint[][]
): PolygonAreaData[] {
  const ctx = canvas.getContext("2d");

  if (!ctx) return [];

  const results: PolygonAreaData[] = [];

  ctx.save();

  ctx.fillStyle = "blue";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  polygons.forEach((polygon, index) => {
    if (polygon.length < 3) return;

    // 면적 계산
    const area =
      calculatePolygonArea(polygon);

    // 중심 계산
    const center =
      calculatePolygonCenter(polygon);

    // canvas에 숫자 출력
    ctx.fillText(
      `${Math.round(area)}`,
      center.x,
      center.y
    );

    results.push({
      polygonIndex: index,
      area,
      center,
    });
  });

  ctx.restore();

  return results;
}

/**
 * Shoelace Formula
 */
function calculatePolygonArea(
  polygon: PolygonPoint[]
): number {
  let area = 0;

  for (
    let i = 0;
    i < polygon.length;
    i++
  ) {
    const current = polygon[i];

    const next =
      polygon[
        (i + 1) % polygon.length
      ];

    area +=
      current.x * next.y -
      next.x * current.y;
  }

  return Math.abs(area / 2);
}

/**
 * polygon 중심 계산
 */
function calculatePolygonCenter(
  polygon: PolygonPoint[]
) {
  let sumX = 0;
  let sumY = 0;

  polygon.forEach((p) => {
    sumX += p.x;
    sumY += p.y;
  });

  return {
    x: sumX / polygon.length,
    y: sumY / polygon.length,
  };
}