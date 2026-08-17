// app/components/papers/PaperFlipPage.tsx
"use client";

import React from 'react';
import PaperWobble3D from './PageFlippingAnimation/PaperWobble3D';
import { windConfigs, WindConfig } from '@/app/data/windConfigs';

interface PaperFlipPageProps {
  children: React.ReactNode;
  isFlipping: boolean;
  direction: 'forward' | 'backward' | null;
  progress: number;
  isWobble: boolean;
  className?: string;
  imagePath?: string; // For PaperWobble3D
  onFlipComplete?: () => void; // For PaperWobble3D
  onClose?: () => void; // For PaperWobble3D
  windConfigId?: string; // Use wind config ID instead of name
}

export default function PaperFlipPage({
  children,
  isFlipping,
  direction,
  progress,
  isWobble,
  className = '',
  imagePath = '',
  onFlipComplete,
  onClose,
  windConfigId = 'gentleBreeze',
}: PaperFlipPageProps) {
  const isForward = direction === 'forward';
  
  // Get wind config by ID
  const windConfig = windConfigs[windConfigId] || windConfigs.gentleBreeze;
  
  // wobble이 아닐 때는 기본 3D 회전
  if (!isWobble) {
    const rotateY = isForward 
      ? -180 * progress 
      : 180 * progress;
    
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
          willChange: 'transform, box-shadow',
        }}
      >
        {children}
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

  // 🆕 wobble 활성화 시 3D 종이 시뮬레이션
  return (
    <PaperWobble3D
      imagePath={imagePath}
      isActive={isFlipping}
      progress={progress}
      direction={direction}
      onFlipComplete={onFlipComplete}
      windConfig={windConfig}
      onClose={onClose}
    />
  );
}