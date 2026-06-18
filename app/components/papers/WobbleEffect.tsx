// app/components/papers/WobbleEffect.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';

interface WobbleEffectProps {
  children: React.ReactNode;
  isActive: boolean;
  progress: number;
  direction: 'forward' | 'backward' | null;
  className?: string;
}

export default function WobbleEffect({
  children,
  isActive,
  progress,
  direction,
  className = '',
}: WobbleEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    const container = containerRef.current;
    const isForward = direction === 'forward';

    // progress가 0~1 사이인지 확인
    const p = Math.min(Math.max(progress, 0), 1);
    
    // 중간에서 wobble이 가장 강하게
    const wobbleStrength = Math.sin(p * Math.PI) * 0.8;
    
    // 시간에 따른 변동 (살짝 떨림)
    const time = Date.now() / 200;
    const flutter = Math.sin(time) * 0.02;

    // 3D 회전
    const rotateY = isForward ? -180 * p : 180 * p;
    
    // wobble: 살짝 비틀고 흔들림
    const rotateZ = (Math.sin(p * Math.PI * 1.5 + time) * 3 + 
                     Math.sin(p * Math.PI * 0.7 + time * 0.5) * 2) * wobbleStrength;
    
    const skewX = (Math.sin(p * Math.PI * 1.2 + time * 0.8) * 2) * wobbleStrength;
    const skewY = (Math.sin(p * Math.PI * 0.9 + time * 0.6) * 1) * wobbleStrength;

    // 종이 휘어짐 (scale)
    const scaleX = 1 - p * 0.02 + Math.sin(p * Math.PI * 1.3) * 0.005;
    const scaleY = 1 - p * 0.01 + Math.sin(p * Math.PI * 0.8) * 0.005;

    // transform 적용
    container.style.transform = `
      perspective(1200px) 
      rotateY(${rotateY}deg) 
      rotateZ(${rotateZ}deg) 
      skewX(${skewX}deg) 
      skewY(${skewY}deg) 
      scale(${scaleX}, ${scaleY})
    `;
    container.style.transformOrigin = isForward ? 'left center' : 'right center';
    container.style.transition = 'none';

    // 그림자 (wobble에 따라 변동)
    const shadowIntensity = Math.sin(p * Math.PI) * 0.35;
    const shadowX = isForward 
      ? -shadowIntensity * 25 + Math.sin(p * Math.PI * 1.5 + time) * 5
      : shadowIntensity * 25 + Math.sin(p * Math.PI * 1.5 + time) * 5;
    
    container.style.boxShadow = `
      ${shadowX}px 8px ${30 + wobbleStrength * 20}px rgba(0,0,0,${shadowIntensity * 0.4}),
      0 4px 20px rgba(0,0,0,${shadowIntensity * 0.15})
    `;

    // 종이 가장자리 빛 반사
    const highlightAngle = isForward 
      ? 30 + Math.sin(p * Math.PI * 1.2 + time * 0.5) * 15
      : 150 + Math.sin(p * Math.PI * 1.2 + time * 0.5) * 15;
    
    container.style.background = `
      linear-gradient(
        ${highlightAngle}deg,
        rgba(255,255,255,${0.05 + wobbleStrength * 0.08}) 0%,
        rgba(255,255,255,0) 40%,
        rgba(255,255,255,0) 70%,
        rgba(255,255,255,${0.03 + wobbleStrength * 0.05}) 100%
      ),
      white
    `;

  }, [isActive, progress, direction]);

  return (
    <div
      ref={containerRef}
      className={`wobble-effect-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '500px',
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        willChange: 'transform, box-shadow, background',
      }}
    >
      {children}
      
      {/* 종이 질감 오버레이 */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 2,
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.01) 2px,
                rgba(0,0,0,0.01) 3px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0,0,0,0.005) 2px,
                rgba(0,0,0,0.005) 3px
              )
            `,
            opacity: 0.5,
          }}
        />
      )}
    </div>
  );
}