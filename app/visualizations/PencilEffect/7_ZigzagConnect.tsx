// 7_ZigzagConnect.tsx

export type ZigzagConnectOptions = {
  blockSize?: number;
  hatchSpacing?: number;

  lineWidth?: number;

  color?: string;
};

/**
 * 기존 hatch line들의:
 *
 * 이전 선의 B end
 * → 다음 선의 A start
 *
 * 를 zigzag 방식으로 연결
 *
 * 기존 hatch 자체는 건드리지 않음.
 */
export function drawZigzagConnections(
  canvas: HTMLCanvasElement,
  options: ZigzagConnectOptions = {}
): void {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const blockSize =
    options.blockSize ?? 6;

  const hatchSpacing =
    options.hatchSpacing ?? 2;

  const lineWidth =
    options.lineWidth ?? 1;

  const color =
    options.color ?? "#000";

  const width = canvas.width;

  const height = canvas.height;

  type Segment = {
    a: {
      x: number;
      y: number;
    };

    b: {
      x: number;
      y: number;
    };
  };

  const segments: Segment[] = [];

  // =========================
  // hatch가 실제로 그려졌던
  // 동일한 grid 조건 재현
  // =========================

  for (
    let y = 0;
    y < height;
    y += blockSize
  ) {
    for (
      let x = 0;
      x < width;
      x += blockSize
    ) {
      const gridX =
        Math.floor(x / blockSize);

      const gridY =
        Math.floor(y / blockSize);

      const shouldDraw =
        (gridX + gridY) %
          Math.max(
            1,
            Math.round(hatchSpacing)
          ) ===
        0;

      if (!shouldDraw) {
        continue;
      }

      // 기존 hatch:
      // A = 좌하단
      // B = 우상단

      const a = {
        x,
        y: y + blockSize,
      };

      const b = {
        x: x + blockSize,
        y,
      };

      segments.push({
        a,
        b,
      });
    }
  }

  if (segments.length < 2) {
    return;
  }

  // =========================
  // 이전 B → 다음 A 연결
  // =========================

  ctx.save();

  ctx.beginPath();

  ctx.lineWidth = lineWidth;

  ctx.strokeStyle = color;

  for (let i = 0; i < segments.length - 1; i++) {
    const current = segments[i];

    const next = segments[i + 1];

    // previous B
    ctx.moveTo(
      current.b.x,
      current.b.y
    );

    // next A
    ctx.lineTo(
      next.a.x,
      next.a.y
    );
  }

  ctx.stroke();

  ctx.restore();
}
