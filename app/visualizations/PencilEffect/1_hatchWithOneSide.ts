// 1_hatchWithOneSide.ts

type HatchReplaceOptions = {
  // 이 범위의 grayscale을 hatch로 "대체"
  minGray?: number;
  maxGray?: number;

  // 영역 판정 resolution
  blockSize?: number;

  // hatch 성김 정도
  hatchSpacing?: number;

  lineWidth?: number;

  hatchColor?: string;

  backgroundColor?: string;

  coverageThreshold?: number;
};

export function replaceGrayRangeWithHatch(
  canvas: HTMLCanvasElement,
  options: HatchReplaceOptions = {}
): void {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const minGray =
    options.minGray ?? 0;

  const maxGray =
    options.maxGray ?? 30;

  // coverage 판정용
  const blockSize =
    options.blockSize ?? 6;

  // hatch density 전용
  const hatchSpacing =
    options.hatchSpacing ?? 2;

  const lineWidth =
    options.lineWidth ?? 1;

  const hatchColor =
    options.hatchColor ?? "#000";

  const backgroundColor =
    options.backgroundColor ??
    "#fff";

  const coverageThreshold =
    options.coverageThreshold ??
    0.5;

  const width = canvas.width;

  const height = canvas.height;

  // =========================
  // 현재 canvas 읽기
  // =========================

  const imageData = ctx.getImageData(
    0,
    0,
    width,
    height
  );

  const data = imageData.data;

  // =========================
  // mask 생성
  // =========================

  const mask: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];

    const g = data[i + 1];

    const b = data[i + 2];

    const gray =
      0.299 * r +
      0.587 * g +
      0.114 * b;

    if (
      gray >= minGray &&
      gray <= maxGray
    ) {
      mask.push(1);
    } else {
      mask.push(0);
    }
  }

  // =========================
  // 기존 threshold 영역을
  // hatch로 "교체"
  // =========================

  ctx.save();

  ctx.lineWidth = lineWidth;

  ctx.strokeStyle = hatchColor;

  ctx.fillStyle = backgroundColor;

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
      let insideCount = 0;

      let total = 0;

      for (let j = 0; j < blockSize; j++) {
        for (let i = 0; i < blockSize; i++) {
          const px = x + i;

          const py = y + j;

          if (
            px >= width ||
            py >= height
          ) {
            continue;
          }

          const idx =
            py * width + px;

          total++;

          if (mask[idx] === 1) {
            insideCount++;
          }
        }
      }

      const ratio =
        insideCount / total;

      // 충분히 해당 gray range이면
      // 기존 픽셀을 지우고 hatch로 교체
      if (
        ratio >= coverageThreshold
      ) {
        ctx.fillRect(
          x,
          y,
          blockSize,
          blockSize
        );

        drawHatch(
          ctx,
          x,
          y,
          blockSize,
          hatchSpacing
        );
      }
    }
  }

  ctx.restore();
}

function drawHatch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  spacing: number
): void {
  ctx.beginPath();

  // 기존 룩 유지:
  // block 내부에 단일 diagonal만 그림
  // 단지 spacing 기준으로 일부 block만 그림

  const gridX =
    Math.floor(x / size);

  const gridY =
    Math.floor(y / size);

  const shouldDraw =
    (gridX + gridY) %
      Math.max(
        1,
        Math.round(spacing)
      ) ===
    0;

  if (shouldDraw) {
    // 좌하단 → 우상단
    ctx.moveTo(
      x,
      y + size
    );

    ctx.lineTo(
      x + size,
      y
    );
  }

  ctx.stroke();
}