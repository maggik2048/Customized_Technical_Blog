import React, { useRef, useState, useEffect } from "react";

declare global {
  interface Window {
    cv: any;
  }
}

export default function BasicRenderer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  const blockSize = 6;

  // -------------------------
  // Image upload handler
  // -------------------------
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const image = new Image();
    image.onload = () => setImg(image);
    image.src = URL.createObjectURL(file);
  };

  // -------------------------
  // Main render pipeline
  // -------------------------
  useEffect(() => {
    if (!img || !canvasRef.current) return;
    if (!window.cv) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const src = window.cv.imread(canvas);
    const gray = new window.cv.Mat();
    const binary = new window.cv.Mat();

    window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);
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

    ctx.lineWidth = 1;
    ctx.strokeStyle = "red";

    // -------------------------
    // Loop polygons
    // -------------------------
    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);

      const approx = new window.cv.Mat();
      window.cv.approxPolyDP(cnt, approx, 2, true);

      const hull = new window.cv.Mat();
      window.cv.convexHull(approx, hull, false, true);

      // -------------------------
      // Polygon path
      // -------------------------
      ctx.save();
      ctx.beginPath();

      for (let j = 0; j < hull.rows; j++) {
        const x = hull.data32S[j * 2];
        const y = hull.data32S[j * 2 + 1];

        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();

      // clip inside polygon
      ctx.clip();

      // hatch rendering
      drawHatch(ctx, canvas.width, canvas.height, blockSize);

      ctx.restore();
      ctx.stroke();

      cnt.delete();
      approx.delete();
      hull.delete();
    }

    src.delete();
    gray.delete();
    binary.delete();
    contours.delete();
    hierarchy.delete();
  }, [img]);

  // -------------------------
  // Hatch renderer
  // -------------------------
  const drawHatch = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    size: number
  ) => {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    for (let y = 0; y < height; y += size) {
      for (let x = 0; x < width; x += size) {
        if ((x + y) % (size * 2) === 0) {
          ctx.beginPath();
          ctx.moveTo(x, y + size);
          ctx.lineTo(x + size, y);
          ctx.stroke();
        }
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <input type="file" onChange={onUpload} />
      <br />
      <canvas ref={canvasRef} style={{ border: "1px solid #ccc" }} />
    </div>
  );
}