"use client";

import { useEffect, useState } from "react";
import BasicRenderer from "./BasicRenderer";

export default function PencilEffectPage() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [cvReady, setCvReady] = useState(false);

  // 1. OpenCV 로딩 (정석)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://docs.opencv.org/4.x/opencv.js";
    script.async = true;

    script.onload = () => {
      // 🔥 핵심: wasm init까지 기다려야 함
      window.cv.onRuntimeInitialized = () => {
        console.log("cv fully ready");
        setCvReady(true);
      };
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 2. 이미지 로딩
  useEffect(() => {
    const image = new Image();
    image.src = "/images/pencildrawing/test.png";

    image.onload = () => {
      setImg(image);
    };
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {cvReady && img && <BasicRenderer img={img} />}
    </div>
  );
}