const MAX_SIZE = 600;

export function resizeAndCompressToAvif(
  file: File,
  quality = 0.35
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      const scale = Math.min(1, MAX_SIZE / Math.max(width, height));

      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context error"));

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("AVIF conversion failed"));
          resolve(blob);
        },
        "image/avif",
        quality
      );
    };

    img.onerror = () => reject(new Error("Image load failed"));

    img.src = URL.createObjectURL(file);
  });
}