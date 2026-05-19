declare global {
  interface Window {
    cv: any;
  }
}

export function convexDecomposition(canvas: HTMLCanvasElement) {
  if (!window.cv) return;

  const ctx = canvas.getContext("2d")!;

  const src = window.cv.imread(canvas);
  const gray = new window.cv.Mat();
  const binary = new window.cv.Mat();

  window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY, 0);

  //  IMPORTANT:
  // threshold 제거 → 이미 applyThreshold 결과 사용
  window.cv.threshold(gray, binary, 127, 255, window.cv.THRESH_BINARY);

  const contours = new window.cv.MatVector();
  const hierarchy = new window.cv.Mat();

  window.cv.findContours(
    binary,
    contours,
    hierarchy,
    window.cv.RETR_EXTERNAL,
    window.cv.CHAIN_APPROX_SIMPLE
  );

  ctx.lineWidth = 2;
  ctx.strokeStyle = "red";

  for (let i = 0; i < contours.size(); i++) {
    const cnt = contours.get(i);

    const approx = new window.cv.Mat();
    window.cv.approxPolyDP(cnt, approx, 2, true);

    const hull = new window.cv.Mat();
    window.cv.convexHull(approx, hull, false, true);

    drawContour(ctx, hull);

    cnt.delete();
    approx.delete();
    hull.delete();
  }

  src.delete();
  gray.delete();
  binary.delete();
  contours.delete();
  hierarchy.delete();
}

function drawContour(ctx: CanvasRenderingContext2D, mat: any) {
  ctx.beginPath();

  for (let i = 0; i < mat.rows; i++) {
    const x = mat.data32S[i * 2];
    const y = mat.data32S[i * 2 + 1];

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.closePath();
  ctx.stroke();
}