// 8_getEndpoint.ts

import { HatchResult } from "./1_hatchWithOneSide";

type EndpointOptions = {
  endpointRadius?: number;

  endpointColor?: string;
};

export function drawHatchEndpoints(
  canvas: HTMLCanvasElement,
  hatchResult:
    | HatchResult
    | undefined
    | null,
  options: EndpointOptions = {}
): void {
  // =========================
  // 방어코드
  // =========================

  if (
    !hatchResult ||
    !hatchResult.hatchBlocks
  ) {
    console.warn(
      "drawHatchEndpoints: hatchResult missing"
    );

    return;
  }

  const ctx =
    canvas.getContext("2d");

  if (!ctx) return;

  const {
    hatchBlocks,
    blockSize,
  } = hatchResult;

  const endpointRadius =
    options.endpointRadius ?? 2;

  const endpointColor =
    options.endpointColor ??
    "blue";

  const rows =
    hatchBlocks.length;

  if (rows === 0) return;

  const cols =
    hatchBlocks[0]?.length ?? 0;

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

      // propagation 종료점
      if (!continues) {
        const x =
          gx * blockSize;

        const y =
          gy * blockSize;

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