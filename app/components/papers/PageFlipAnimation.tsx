// app/components/papers/PageFlipAnimation.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SnapshotData } from './SnapshotManager';

interface PageFlipAnimationProps {
  snapshots: SnapshotData[];
  currentIndex: number;
  totalPages: number;
  onFlipComplete?: (newIndex: number) => void;
  isFlipping?: boolean;
  flipDirection?: 'forward' | 'backward';
  duration?: number;
}

export default function PageFlipAnimation({
  snapshots,
  currentIndex,
  totalPages,
  onFlipComplete,
  isFlipping = false,
  flipDirection = 'forward',
  duration = 0.8,
}: PageFlipAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const currentSnapshot = snapshots[currentIndex];
  const nextSnapshot = flipDirection === 'forward' 
    ? snapshots[currentIndex + 1] 
    : snapshots[currentIndex - 1];

  console.log('📖 PageFlipAnimation state:', {
    currentIndex,
    hasCurrent: !!currentSnapshot,
    hasNext: !!nextSnapshot,
    isFlipping,
    progress,
    isAnimating,
    totalSnapshots: snapshots.length
  });

  // 플립 애니메이션 시작
  useEffect(() => {
    if (isFlipping && !isAnimating && currentSnapshot && nextSnapshot) {
      console.log('🚀 Starting flip animation');
      startAnimation();
    } else if (isFlipping && !nextSnapshot) {
      console.warn('⚠️ No next snapshot available for flip');
      // 다음 페이지가 없으면 플립 완료 처리
      if (onFlipComplete) {
        onFlipComplete(currentIndex);
      }
    }
  }, [isFlipping, currentSnapshot, nextSnapshot]);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setProgress(0);
    startTimeRef.current = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const rawProgress = Math.min(elapsed / duration, 1);
      
      // 더 자연스러운 easing (책 넘김처럼)
      const eased = rawProgress < 0.5 
        ? 2 * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;
      
      setProgress(eased);

      if (rawProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // 애니메이션 완료
        setProgress(1);
        setIsAnimating(false);
        
        const newIndex = flipDirection === 'forward' 
          ? Math.min(currentIndex + 1, totalPages - 1)
          : Math.max(currentIndex - 1, 0);
        
        console.log('✅ Flip complete, newIndex:', newIndex);
        if (onFlipComplete) {
          onFlipComplete(newIndex);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [duration, flipDirection, currentIndex, totalPages, onFlipComplete]);

  // 클린업
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 스냅샷이 없으면 로딩 표시
  if (!currentSnapshot) {
    return (
      <div style={{
        width: '100%',
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f0f0',
        borderRadius: '8px'
      }}>
        <span>⏳ Loading page...</span>
      </div>
    );
  }

  // 애니메이션이 없으면 현재 페이지 표시
  if (!isAnimating && progress === 0) {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <img
          src={currentSnapshot.imageData}
          alt={`Page ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        />
      </div>
    );
  }

  // 📖 종이책 넘김 애니메이션
  const isForward = flipDirection === 'forward';
  
  // 3D 회전 각도 (책 넘김처럼)
  const rotateY = isForward 
    ? -180 * progress 
    : 180 * progress;
  
  // 그림자 효과
  const shadowIntensity = Math.sin(progress * Math.PI) * 0.4;
  
  // 페이지 너비 비율 (책 넘김 효과)
  const pageWidth = 100 - (progress * 100);
  const pageOffset = isForward 
    ? progress * 100 
    : -progress * 100;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        perspective: '1500px',
        perspectiveOrigin: isForward ? 'left center' : 'right center',
        minHeight: '500px',
        overflow: 'hidden'
      }}
    >
      {/* 뒷면 페이지 (넘겨질 페이지) */}
      {nextSnapshot && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <img
            src={nextSnapshot.imageData}
            alt={`Page ${isForward ? currentIndex + 2 : currentIndex}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>
      )}

      {/* 넘기는 페이지 (3D 회전) */}
      <div
        style={{
          position: 'relative',
          width: `${pageWidth}%`,
          marginLeft: isForward ? 0 : `${100 - pageWidth}%`,
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotateY}deg)`,
          transformOrigin: isForward ? 'left center' : 'right center',
          zIndex: 1,
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: `0 4px 30px rgba(0,0,0,${shadowIntensity})`
        }}
      >
        <img
          src={currentSnapshot.imageData}
          alt={`Page ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            backfaceVisibility: 'hidden',
            borderRadius: '8px'
          }}
        />

        {/* 그림자 오버레이 (책 넘김 효과) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: isForward
              ? `linear-gradient(to right, rgba(0,0,0,${shadowIntensity * 0.3}), transparent)`
              : `linear-gradient(to left, rgba(0,0,0,${shadowIntensity * 0.3}), transparent)`,
            borderRadius: '8px',
            pointerEvents: 'none'
          }}
        />

        {/* 페이지 가장자리 그림자 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            [isForward ? 'right' : 'left']: 0,
            width: '4px',
            height: '100%',
            background: `linear-gradient(to ${isForward ? 'left' : 'right'}, rgba(0,0,0,${shadowIntensity * 0.5}), transparent)`,
            pointerEvents: 'none'
          }}
        />
      </div>
    </div>
  );
}