// app/components/papers/PaperFlipPage.tsx
"use client";

import React from 'react';

interface PaperFlipPageProps {
  children: React.ReactNode;
  isFlipping: boolean;
  direction: 'forward' | 'backward' | null;
  progress: number;
  className?: string;
}

export default function PaperFlipPage({
  children,
  isFlipping,
  direction,
  progress,
  className = '',
}: PaperFlipPageProps) {
  const isForward = direction === 'forward';
  
  // 3D 회전 각도
  const rotateY = isForward 
    ? -180 * progress 
    : 180 * progress;
  
  // 그림자 강도
  const shadowIntensity = Math.sin(progress * Math.PI) * 0.3;

  return (
    <div
      className={`paper-flip-page ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '500px',
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden',
        transform: `perspective(1200px) rotateY(${rotateY}deg)`,
        transformOrigin: isForward ? 'left center' : 'right center',
        boxShadow: `0 4px 30px rgba(0,0,0,${shadowIntensity})`,
        transition: 'none',
        willChange: 'transform, box-shadow',
      }}
    >
      {children}
      
      {/* 페이지 그림자 오버레이 */}
      {isFlipping && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isForward
              ? `linear-gradient(to right, rgba(0,0,0,${shadowIntensity * 0.3}), transparent 60%)`
              : `linear-gradient(to left, rgba(0,0,0,${shadowIntensity * 0.3}), transparent 60%)`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
}