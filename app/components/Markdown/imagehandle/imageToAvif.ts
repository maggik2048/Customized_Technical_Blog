// imageToAvif.ts
export function convertToAvif(file: File, quality = 0.4): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not available"));

      ctx.drawImage(img, 0, 0);

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