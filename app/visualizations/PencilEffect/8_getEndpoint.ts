// 8_getEndpoint.ts

type EndpointOptions = {
  minGray?: number;
  maxGray?: number;

  blockSize?: number;

  hatchSpacing?: number;

  coverageThreshold?: number;

  endpointRadius?: number;

  endpointColor?: string;
};

/**
 * hatch endpoint만 계산해서
 * "점만" 그리는 디버그 함수
 *
 * hatch 자체는 절대 다시 그리지 않음
 */
export function drawHatchEndpoints(
  canvas: HTMLCanvasElement,
  options: EndpointOptions = {}
): void {
  const ctx =
    canvas.getContext("2d");

  if (!ctx) return;

  const width = canvas.width;

  const height = canvas.height;

  const minGray =
    options.minGray ?? 0;

  const maxGray =
    options.maxGray ?? 30;

  const blockSize =
    options.blockSize ?? 6;

  const hatchSpacing =
    options.hatchSpacing ?? 2;

  const coverageThreshold =
    options.coverageThreshold ??
    0.5;

  const endpointRadius =
    options.endpointRadius ?? 2;

  // 빨간색 → 파란색
  const endpointColor =
    options.endpointColor ??
    "blue";

  // =========================
  // 현재 canvas 읽기
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
  // threshold 영역 mask 생성
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
  // hatch 존재 block 계산
  // =========================

  const hatchBlocks: boolean[][] =
    [];

  const cols = Math.ceil(
    width / blockSize
  );

  const rows = Math.ceil(
    height / blockSize
  );

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
    }
  }

  // =========================
  // endpoint만 표시
  // =========================

  ctx.save();

  ctx.fillStyle =
    endpointColor;

  for (
    let gy = 0;
    gy < rows;
    gy++
  ) {
    for (
      let gx = 0;
      gx < cols;
      gx++
    ) {
      if (
        !hatchBlocks[gy][gx]
      ) {
        continue;
      }

      // propagate 방향
      const nextGX = gx + 1;

      const nextGY = gy - 1;

      let continues = false;

      if (
        nextGX >= 0 &&
        nextGX < cols &&
        nextGY >= 0 &&
        nextGY < rows
      ) {
        continues =
          hatchBlocks[nextGY]?.[
            nextGX
          ] ?? false;
      }

      // propagation 종료
      if (!continues) {
        const x =
          gx * blockSize;

        const y =
          gy * blockSize;

        // hatch line endpoint
        const endX =
          x + blockSize;

        const endY = y;

        ctx.beginPath();

        ctx.arc(
          endX,
          endY,
          endpointRadius,
          0,
          Math.PI * 2
        );

        ctx.fill();
      }
    }
  }

  ctx.restore();
}