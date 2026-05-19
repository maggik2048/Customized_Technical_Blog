declare global {
  interface Window {
    cv: any;
  }
}

import {
  processLongestSides,
  PolygonPoint,
} from "./4_longestside";

export function convexDecomposition(canvas: HTMLCanvasElement) {
  if (!window.cv) return;

  const ctx = canvas.getContext("2d")!;

  const src = window.cv.imread(canvas);

  const gray = new window.cv.Mat();
  const binary = new window.cv.Mat();

  // grayscale
  window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0);

  // binary
  window.cv.threshold(gray, binary, 127, 255, window.cv.THRESH_BINARY);

  // contours
  const contours = new window.cv.MatVector();
  const hierarchy = new window.cv.Mat();

  window.cv.findContours(
    binary,
    contours,
    hierarchy,
    window.cv.RETR_EXTERNAL,
    window.cv.CHAIN_APPROX_SIMPLE
  );

  // polygon 저장용
  const polygons: PolygonPoint[][] = [];

  // 기존 hull draw
  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";

  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i);

    // contour simplify
    const approx = new window.cv.Mat();

    window.cv.approxPolyDP(
      cnt,
      approx,
      2,
      true
    );

    // convex hull
    const hull = new window.cv.Mat();

    window.cv.convexHull(
      approx,
      hull,
      false,
      true
    );

    // draw red polygon
    drawContour(ctx, hull);

    // hull -> polygon points
    const polygon: PolygonPoint[] = [];

    for (let j = 0; j < hull.rows; j++) {
      polygon.push({
        x: hull.data32S[j * 2],
        y: hull.data32S[j * 2 + 1],
      });
    }

    polygons.push(polygon);

    // cleanup
    cnt.delete();
    approx.delete();
    hull.delete();
  }

  // 가장 긴 변 계산 + 노란선 draw
  const directionData = processLongestSides(
    canvas,
    polygons
  );

  console.log("directionData", directionData);

  // cleanup
  src.delete();
  gray.delete();
  binary.delete();
  contours.delete();
  hierarchy.delete();

  return {
    polygons,
    directionData,
  };
}

function drawContour(
  ctx: CanvasRenderingContext2D,
  mat: any
) {
  if (mat.rows === 0) return;

  ctx.beginPath();

  for (let i = 0; i < mat.rows; i++) {
    const x = mat.data32S[i * 2];
    const y = mat.data32S[i * 2 + 1];

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.stroke();
}