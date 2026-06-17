// HDRIProvider.tsx 수정
"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

interface HDRIContextType {
  texture: THREE.DataTexture | null;
  scrollY: number;
  setScrollY: (y: number) => void;
}

const HDRIContext = createContext<HDRIContextType | null>(null);

export function HDRIProvider({ children }: { children: React.ReactNode }) {
  const [texture, setTexture] = useState<THREE.DataTexture | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const textureRef = useRef<THREE.DataTexture | null>(null);

  useEffect(() => {
    console.log("🔄 HDRIProvider: HDRI 로딩 시작...");
    
    const loader = new RGBELoader();
    loader.load(
      "/environments/studio_small_09_2k.hdr",
      (tex) => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        textureRef.current = tex;
        setTexture(tex);
        console.log("✅ HDRIProvider: HDRI 로드 완료!");
      },
      undefined,
      (error) => {
        console.error("❌ HDRIProvider: HDRI 로드 실패:", error);
      }
    );

    // ✅ 글로벌 스크롤 이벤트 리스너
    const handleScroll = () => {
      setScrollY(window.scrollY || window.pageYOffset || 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기값 설정

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <HDRIContext.Provider value={{ texture, scrollY, setScrollY }}>
      {children}
    </HDRIContext.Provider>
  );
}

export function useHDRI() {
  const context = useContext(HDRIContext);
  if (!context) {
    throw new Error("useHDRI must be used within a HDRIProvider");
  }
  return context;
}