// page.tsx

"use client";

import {
  useEffect,
  useState,
} from "react";

import BasicRenderer from "./BasicRenderer";

import {
  AnnotationProvider,
  AnnotationPanel,
} from "./annotationManager";

export default function PencilEffectPage() {
  const [img, setImg] =
    useState<HTMLImageElement | null>(
      null
    );

  const [cvReady, setCvReady] =
    useState(false);

  // =========================
  // OpenCV load
  // =========================

  useEffect(() => {
    const script =
      document.createElement("script");

    script.src =
      "https://docs.opencv.org/4.x/opencv.js";

    script.async = true;

    script.onload = () => {
      // wasm init 기다려야함
      window.cv.onRuntimeInitialized =
        () => {
          console.log(
            "cv fully ready"
          );

          setCvReady(true);
        };
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(
        script
      );
    };
  }, []);

  // =========================
  // image load
  // =========================

  useEffect(() => {
    const image = new Image();

    image.src =
      "/images/pencildrawing/test.png";

    image.onload = () => {
      setImg(image);
    };
  }, []);

  // =========================
  // loading
  // =========================

  if (!cvReady || !img) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#111",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
        }}
      >
        loading...
      </div>
    );
  }

  // =========================
  // render
  // =========================

  return (
    <AnnotationProvider>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#111",

          display: "flex",
          flexDirection: "row",

          gap: 20,

          alignItems: "flex-start",
          justifyContent: "flex-start",

          padding: 20,

          boxSizing: "border-box",
        }}
      >
        {/* LEFT PANEL */}
        <AnnotationPanel />

        {/* RENDERER */}
        <BasicRenderer img={img} />
      </div>
    </AnnotationProvider>
  );
}