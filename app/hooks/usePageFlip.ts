// app/hooks/usePageFlip.ts
import { useState, useEffect, useRef } from 'react';

interface FlipState {
  progress: number;
  isFlipping: boolean;
  direction: 'forward' | 'backward' | null;
  pageIndex: number;
  isWobble: boolean;
}

export const usePageFlip = (totalPages: number, initialPage: number = 0) => {
  const [state, setState] = useState<FlipState>({
    progress: 0,
    isFlipping: false,
    direction: null,
    pageIndex: initialPage,
    isWobble: false,
  });

  const animationRef = useRef<number | null>(null);

  const startFlip = (direction: 'forward' | 'backward', wobble: boolean = false) => {
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
      isWobble: wobble,
    });

    const startTime = performance.now();
    const duration = wobble ? 800 : 600; // wobble은 조금 더 느리게

    const animate = (timestamp: number) => {
      const elapsed = (timestamp - startTime) / duration;
      const progress = Math.min(elapsed, 1);
      
      // wobble일 때는 약간 다른 easing (더 자연스러운 종이 느낌)
      const eased = wobble
        ? progress < 0.5 
          ? 3 * progress * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2
        : progress < 0.5 
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
          isWobble: false,
        });
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const toggleWobble = () => {
    setState(prev => ({
      ...prev,
      isWobble: !prev.isWobble,
    }));
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
    toggleWobble,
  };
};