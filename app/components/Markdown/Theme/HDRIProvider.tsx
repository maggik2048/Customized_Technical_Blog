"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

interface HDRIContextType {
  texture: THREE.DataTexture | null;
  scrollY: number;
  setScrollY: (y: number) => void;
  isLoading: boolean;
  error: Error | null;
}

const HDRIContext = createContext<HDRIContextType | null>(null);

// ✅ 전역 텍스처 캐시 (모든 HDRIProvider 인스턴스가 공유)
const textureCache = new Map<string, THREE.DataTexture>();
const loadingPromises = new Map<string, Promise<THREE.DataTexture>>();

export function HDRIProvider({ 
  children, 
  hdriUrl = "/environments/poly_haven_studio_4k.hdr",
  onLoad,
  onError,
}: { 
  children: React.ReactNode;
  hdriUrl?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}) {
  const [texture, setTexture] = useState<THREE.DataTexture | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const textureRef = useRef<THREE.DataTexture | null>(null);
  const mountedRef = useRef(true);
  const loadAttemptedRef = useRef(false);

  // ✅ 스크롤 핸들러 (메모이제이션)
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY || window.pageYOffset || 0);
  }, []);

  // ✅ HDRI 로드 함수 (캐시 및 중복 로드 방지)
  const loadHDRI = useCallback(async () => {
    // 이미 로드 시도 중이면 건너뛰기
    if (loadAttemptedRef.current) return;
    loadAttemptedRef.current = true;

    // ✅ 캐시 확인
    if (textureCache.has(hdriUrl)) {
      const cachedTexture = textureCache.get(hdriUrl)!;
      textureRef.current = cachedTexture;
      setTexture(cachedTexture);
      setIsLoading(false);
      onLoad?.();
      console.log("✅ HDRIProvider: 캐시된 HDRI 사용");
      return;
    }

    // ✅ 이미 로딩 중인지 확인 (중복 요청 방지)
    if (loadingPromises.has(hdriUrl)) {
      try {
        const tex = await loadingPromises.get(hdriUrl)!;
        if (mountedRef.current) {
          textureRef.current = tex;
          setTexture(tex);
          setIsLoading(false);
          onLoad?.();
        }
        return;
      } catch (err) {
        // 로딩 실패 처리
      }
    }

    setIsLoading(true);
    setError(null);

    // ✅ 새로운 로딩 Promise 생성
    const loadPromise = new Promise<THREE.DataTexture>((resolve, reject) => {
      console.log("🔄 HDRIProvider: HDRI 로딩 시작...", hdriUrl);
      
      const loader = new RGBELoader();
      loader.load(
        hdriUrl,
        (tex) => {
          tex.mapping = THREE.EquirectangularReflectionMapping;
          
          // ✅ 텍스처 최적화 설정
          tex.anisotropy = 4; // 성능 최적화 (8에서 4로 낮춤)
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = true;
          
          // ✅ 캐시 저장
          textureCache.set(hdriUrl, tex);
          
          console.log("✅ HDRIProvider: HDRI 로드 완료!");
          resolve(tex);
        },
        (progress) => {
          // 진행률 로깅 (선택사항)
          if (progress.total > 0) {
            const percent = (progress.loaded / progress.total) * 100;
            if (percent % 25 < 1) { // 25% 단위로만 로깅
              console.log(`📊 HDRI 로딩: ${Math.round(percent)}%`);
            }
          }
        },
        (err) => {
          console.error("❌ HDRIProvider: HDRI 로드 실패:", err);
          reject(err);
        }
      );
    });

    // ✅ Promise 캐시 저장
    loadingPromises.set(hdriUrl, loadPromise);

    try {
      const tex = await loadPromise;
      if (mountedRef.current) {
        textureRef.current = tex;
        setTexture(tex);
        setIsLoading(false);
        onLoad?.();
      }
    } catch (err) {
      if (mountedRef.current) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setIsLoading(false);
        onError?.(errorObj);
        
        //  폴백: 기본 조명용 더미 텍스처 생성
        const fallbackTexture = createFallbackTexture();
        textureRef.current = fallbackTexture;
        setTexture(fallbackTexture);
      }
    } finally {
      loadingPromises.delete(hdriUrl);
    }
  }, [hdriUrl, onLoad, onError]);

  //  폴백 텍스처 생성 (HDRI 로드 실패 시)
  const createFallbackTexture = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext("2d")!;
    
    // 그라데이션 배경
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#404060");
    gradient.addColorStop(1, "#606080");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }, []);

  //  useEffect로 HDRI 로드
  useEffect(() => {
    mountedRef.current = true;
    loadAttemptedRef.current = false;

    loadHDRI();

    // 스크롤 이벤트 등록
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기값 설정

    return () => {
      mountedRef.current = false;
      window.removeEventListener("scroll", handleScroll);
      
      //  주의: 컴포넌트 언마운트 시 텍스처 해제하지 않음 (캐시됨)
      // 필요시 캐시에서 제거하려면 아래 주석 해제
      // if (textureRef.current && !textureCache.has(hdriUrl)) {
      //   textureRef.current.dispose();
      // }
    };
  }, [hdriUrl, loadHDRI, handleScroll]);

  //  메모리 사용량 확인 (개발 환경)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const checkMemory = () => {
        if (texture) {
          const info = {
            textureSize: `${texture.image?.width || 0}x${texture.image?.height || 0}`,
            cacheSize: textureCache.size,
          };
          console.log('📊 HDRI Cache Info:', info);
        }
      };
      
      // 30초마다 메모리 상태 체크
      const interval = setInterval(checkMemory, 30000);
      return () => clearInterval(interval);
    }
  }, [texture]);

  const contextValue = {
    texture,
    scrollY,
    setScrollY,
    isLoading,
    error,
  };

  return (
    <HDRIContext.Provider value={contextValue}>
      {children}
    </HDRIContext.Provider>
  );
}

//  useHDRI 훅 (에러 처리 강화)
export function useHDRI() {
  const context = useContext(HDRIContext);
  if (!context) {
    throw new Error("useHDRI must be used within a HDRIProvider");
  }
  return context;
}

//  HDRI 캐시 초기화 (필요시 사용)
export function clearHDRICache() {
  textureCache.forEach((texture) => {
    texture.dispose();
  });
  textureCache.clear();
  loadingPromises.clear();
  console.log("🧹 HDRI 캐시 초기화 완료");
}

//  HDRI 캐시 상태 확인
export function getHDRICacheStatus() {
  return {
    size: textureCache.size,
    urls: Array.from(textureCache.keys()),
    loading: Array.from(loadingPromises.keys()),
  };
}