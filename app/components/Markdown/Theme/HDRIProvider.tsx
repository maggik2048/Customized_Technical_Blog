// app/components/Markdown/Theme/HDRIProvider.tsx
"use client";

import React, { 
  createContext, 
  useContext, 
  useEffect, 
  useRef, 
  useState  // ✅ useState 추가!
} from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const HDRIContext = createContext<THREE.DataTexture | null>(null);

export function HDRIProvider({ children }: { children: React.ReactNode }) {
  const [texture, setTexture] = useState<THREE.DataTexture | null>(null);
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

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, []);

  return (
    <HDRIContext.Provider value={texture}>
      {children}
    </HDRIContext.Provider>
  );
}

export function useHDRI() {
  const context = useContext(HDRIContext);
  if (context === undefined) {
    throw new Error("useHDRI must be used within a HDRIProvider");
  }
  return context;
}