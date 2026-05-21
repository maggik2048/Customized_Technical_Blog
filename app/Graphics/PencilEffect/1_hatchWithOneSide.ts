// 1_hatchWithOneSide.ts

export type HatchReplaceOptions = {
  minGray?: number;
  maxGray?: number;

  blockSize?: number;

  hatchSpacing?: number;

  lineWidth?: number;

  hatchColor?: string;

  backgroundColor?: string;

  coverageThreshold?: number;
};

export type HatchResult = {
  hatchBlocks: boolean[][];
  blockSize: number;
};

export function replaceGrayRangeWithHatch(
  canvas: HTMLCanvasElement,
  options: HatchReplaceOptions = {}
): HatchResult {
  const ctx =
    canvas.getContext("2d");

  if (!ctx) {
    return {
      hatchBlocks: [],
      blockSize:
        options.blockSize ?? 6,
    };
  }

  const minGray =
    options.minGray ?? 0;

  const maxGray =
    options.maxGray ?? 30;

  const blockSize =
    options.blockSize ?? 6;

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
  // image read
  // =========================

  const imageData =
    ctx.getImageData(
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

  for (
    let i = 0;
    i < data.length;
    i += 4
  ) {
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
  // hatch topology 저장
  // =========================

  const cols = Math.ceil(
    width / blockSize
  );

  const rows = Math.ceil(
    height / blockSize
  );

  const hatchBlocks: boolean[][] =
    [];

  ctx.save();

  ctx.lineWidth = lineWidth;

  ctx.strokeStyle = hatchColor;

  ctx.fillStyle = backgroundColor;

  for (
    let gy = 0;
    gy < rows;
    gy++
  ) {
    hatchBlocks[gy] = [];

    for (
      let gx = 0;
      gx < cols;
      gx++
    ) {
      const x = gx * blockSize;

      const y = gy * blockSize;

      let insideCount = 0;

      let total = 0;

      for (
        let j = 0;
        j < blockSize;
        j++
      ) {
        for (
          let i = 0;
          i < blockSize;
          i++
        ) {
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

      const shouldFill =
        ratio >=
        coverageThreshold;

      const shouldDrawHatch =
        (gx + gy) %
          Math.max(
            1,
            Math.round(
              hatchSpacing
            )
          ) ===
          0 && shouldFill;

      hatchBlocks[gy][gx] =
        shouldDrawHatch;

      if (shouldFill) {
        ctx.fillRect(
          x,
          y,
          blockSize,
          blockSize
        );

        if (shouldDrawHatch) {
          drawHatch(
            ctx,
            x,
            y,
            blockSize
          );
        }
      }
    }
  }

  ctx.restore();

  return {
    hatchBlocks,
    blockSize,
  };
}

function drawHatch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number
): void {
  ctx.beginPath();

  // 좌하단 -> 우상단

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