// 1_hatchWithOneSide.ts

type HatchOptions = {
  threshold?: number;
  blockSize?: number;
  lineWidth?: number;
  hatchColor?: string;
  blackRatio?: number;
};

export function hatchBlackAreas(
  canvas: HTMLCanvasElement,
  options: HatchOptions = {}
): void {
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const threshold =
    options.threshold ?? 128;

  const blockSize =
    options.blockSize ?? 6;

  const lineWidth =
    options.lineWidth ?? 1;

  const hatchColor =
    options.hatchColor ?? "#000";

  const blackRatio =
    options.blackRatio ?? 0.5;

  const width = canvas.width;
  const height = canvas.height;

  // 현재 캔버스 상태 읽기
  // (이미 threshold + polygon visualization
  // + line visualization 다 그려진 상태)
  const imageData = ctx.getImageData(
    0,
    0,
    width,
    height
  );

  const data = imageData.data;

  // =========================
  // IMPORTANT
  // 기존 캔버스 절대 clear 안함
  // fillRect 안함
  // 덮어쓰기 안함
  // 오직 검은 영역 위에만 hatch 추가
  // =========================

  ctx.save();

  ctx.strokeStyle = hatchColor;
  ctx.lineWidth = lineWidth;

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
      let blackCount = 0;
      let total = 0;

      // 블록 내부 검사
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

          const pixelIndex =
            (py * width + px) * 4;

          const r =
            data[pixelIndex];

          const g =
            data[pixelIndex + 1];

          const b =
            data[pixelIndex + 2];

          const gray =
            0.299 * r +
            0.587 * g +
            0.114 * b;

          total++;

          // threshold 기준 검정 판단
          if (gray < threshold) {
            blackCount++;
          }
        }
      }

      const ratio =
        blackCount / total;

      // 검정 비율 높은 영역만 해치
      if (ratio > blackRatio) {
        drawHatch(
          ctx,
          x,
          y,
          blockSize
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
  size: number
): void {
  ctx.beginPath();

  // 좌하단 → 우상단
  ctx.moveTo(
    x,
    y + size
  );

  ctx.lineTo(
    x + size,
    y
  );

  ctx.stroke();
}