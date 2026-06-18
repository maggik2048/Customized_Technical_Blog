// app/hooks/usePageFlip.ts
import { useState, useEffect, useRef } from 'react';

interface FlipState {
  progress: number;
  isFlipping: boolean;
  direction: 'forward' | 'backward' | null;
  pageIndex: number;
}

export const usePageFlip = (totalPages: number, initialPage: number = 0) => {
  const [state, setState] = useState<FlipState>({
    progress: 0,
    isFlipping: false,
    direction: null,
    pageIndex: initialPage,
  });

  const animationRef = useRef<number | null>(null);

  const startFlip = (direction: 'forward' | 'backward') => {
    if (state.isFlipping) return;
    
    const newIndex = direction === 'forward' 
      ? Math.min(state.pageIndex + 1, totalPages - 1)
      : Math.max(state.pageIndex - 1, 0);
    
    if (newIndex === state.pageIndex) return;

    setState({
      progress: 0,
      isFlipping: true,
      direction,
      pageIndex: state.pageIndex,
    });

    const startTime = performance.now();
    const duration = 600;

    const animate = (timestamp: number) => {
      const elapsed = (timestamp - startTime) / duration;
      const progress = Math.min(elapsed, 1);
      
      // 부드러운 easing
      const eased = progress < 0.5 
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      setState(prev => ({
        ...prev,
        progress: eased,
      }));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setState({
          progress: 1,
          isFlipping: false,
          direction: null,
          pageIndex: newIndex,
        });
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    ...state,
    startFlip,
  };
};