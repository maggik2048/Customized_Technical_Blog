// 5_getPerpendicular.ts

import {
  PolygonDirectionData,
} from "./4_longestside";

export interface PerpendicularDirectionData {
  polygonIndex: number;

  // perpendicular 방향 벡터
  perpendicularDirection: {
    x: number;
    y: number;
  };

  // perpendicular angle(rad)
  angle: number;

  // 시각화 정보
  line: {
    start: {
      x: number;
      y: number;
    };

    end: {
      x: number;
      y: number;
    };

    length: number;
  };
}

/**
 * longest edge direction 기준으로
 * perpendicular 방향 계산
 *
 * 노란선의 midpoint 에서
 * perpendicular 하늘색선 draw
 */
export function getPerpendicularDirections(
  canvas: HTMLCanvasElement,
  directionData: PolygonDirectionData[]
): PerpendicularDirectionData[] {
  const ctx = canvas.getContext("2d")!;

  const results: PerpendicularDirectionData[] = [];

  // 하늘색 perpendicular line
  ctx.strokeStyle = "#00d8ff";
  ctx.lineWidth = 3;

  directionData.forEach((item) => {
    const start = item.longestEdge.start;
    const end = item.longestEdge.end;

    // longest edge midpoint
    const midX = (start.x + end.x) * 0.5;
    const midY = (start.y + end.y) * 0.5;

    // original direction
    const dx = item.direction.x;
    const dy = item.direction.y;

    /**
     * perpendicular
     *
     * (x, y)
     * ->
     * (-y, x)
     */
    const perpX = -dy;
    const perpY = dx;

    const perpAngle = Math.atan2(
      perpY,
      perpX
    );

    // 시각화 길이
    const visualLength = 40;

    // midpoint 기준 양방향으로 그림
    const x1 =
      midX - perpX * visualLength;

    const y1 =
      midY - perpY * visualLength;

    const x2 =
      midX + perpX * visualLength;

    const y2 =
      midY + perpY * visualLength;

    // draw perpendicular line
    ctx.beginPath();

    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.stroke();

    results.push({
      polygonIndex: item.polygonIndex,

      perpendicularDirection: {
        x: perpX,
        y: perpY,
      },

      angle: perpAngle,

      line: {
        start: {
          x: x1,
          y: y1,
        },

        end: {
          x: x2,
          y: y2,
        },

        length: visualLength * 2,
      },
    });
  });

  return results;
}