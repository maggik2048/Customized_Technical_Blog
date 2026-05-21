// longestside.ts

export interface PolygonDirectionData {
  polygonIndex: number;

  // 가장 긴 변
  longestEdge: {
    start: { x: number; y: number };
    end: { x: number; y: number };
    length: number;
  };

  // 방향 벡터 (normalized)
  direction: {
    x: number;
    y: number;
  };

  // 각도(rad)
  angle: number;
}

export interface PolygonPoint {
  x: number;
  y: number;
}

/**
 * convex decomposition 결과 다각형들을 받아
 * 각 다각형의 가장 긴 변을 찾고
 * 그 변을 노란색으로 렌더링하며
 * direction 정보를 반환
 */
export function processLongestSides(
  canvas: HTMLCanvasElement,
  polygons: PolygonPoint[][]
): PolygonDirectionData[] {
  const ctx = canvas.getContext("2d")!;

  const results: PolygonDirectionData[] = [];

  ctx.lineWidth = 4;
  ctx.strokeStyle = "yellow";

  polygons.forEach((polygon, polygonIndex) => {
    if (polygon.length < 2) return;

    let maxLength = -1;

    let bestStart = polygon[0];
    let bestEnd = polygon[1];

    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i];
      const b = polygon[(i + 1) % polygon.length];

      const dx = b.x - a.x;
      const dy = b.y - a.y;

      const length = Math.hypot(dx, dy);

      if (length > maxLength) {
        maxLength = length;
        bestStart = a;
        bestEnd = b;
      }
    }

    // direction normalize
    const dirX = bestEnd.x - bestStart.x;
    const dirY = bestEnd.y - bestStart.y;

    const mag = Math.hypot(dirX, dirY);

    const nx = mag === 0 ? 0 : dirX / mag;
    const ny = mag === 0 ? 0 : dirY / mag;

    const angle = Math.atan2(ny, nx);

    // 노란색 가장 긴 변 draw
    ctx.beginPath();
    ctx.moveTo(bestStart.x, bestStart.y);
    ctx.lineTo(bestEnd.x, bestEnd.y);
    ctx.stroke();

    results.push({
      polygonIndex,

      longestEdge: {
        start: bestStart,
        end: bestEnd,
        length: maxLength,
      },

      direction: {
        x: nx,
        y: ny,
      },

      angle,
    });
  });

  return results;
}