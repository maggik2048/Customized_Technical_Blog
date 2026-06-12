const MAX_SIZE = 600;

export function resizeAndCompressToAvif(
  file: File,
  quality = 0.35
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      const scale = Math.min(
        1,
        MAX_SIZE /
          Math.max(width, height)
      );

      width = Math.round(
        width * scale
      );

      height = Math.round(
        height * scale
      );

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width = width;
      canvas.height = height;

      const ctx =
        canvas.getContext("2d");

      if (!ctx) {
        reject(
          new Error(
            "Canvas context 생성 실패"
          )
        );

        return;
      }

      ctx.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error(
                "AVIF 생성 실패"
              )
            );

            return;
          }

          resolve(blob);
        },
        "image/avif",
        quality
      );
    };

    img.onerror = () => {
      reject(
        new Error(
          "이미지 로딩 실패"
        )
      );
    };

    img.src =
      URL.createObjectURL(file);
  });
}