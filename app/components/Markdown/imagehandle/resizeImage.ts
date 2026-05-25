export function resizeImage(
  file: File,
  maxSize = 1000
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.src = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;

      if (
        width > maxSize ||
        height > maxSize
      ) {
        const scale = Math.min(
          maxSize / width,
          maxSize / height
        );

        width *= scale;
        height *= scale;
      }

      const canvas =
        document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

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
                "이미지 blob 생성 실패"
              )
            );
            return;
          }

          resolve(blob);
        },
        "image/jpeg",
        0.9
      );
    };

    img.onerror = () => {
      reject(
        new Error("이미지 로딩 실패")
      );
    };
  });
}