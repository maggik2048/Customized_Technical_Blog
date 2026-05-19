export function applyThreshold(
  canvas: HTMLCanvasElement,
  threshold: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 1. get image pixels
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 2. loop pixels (RGBA)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // luminance (same as HTML version)
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // threshold decision
    const value = gray < threshold ? 0 : 255;

    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;

    // alpha 유지
    data[i + 3] = 255;
  }

  // 3. write back to canvas
  ctx.putImageData(imageData, 0, 0);
}