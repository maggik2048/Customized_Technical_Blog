// app/post/[id]/pageFlipController.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { windConfigs, windConfigList, getWindConfig } from "@/app/data/windConfigs";
import type { WindConfig } from "@/app/data/windConfigs";

// 컨트롤러 프롭스 타입 정의
type PageFlipControllerProps = {
  isDark: boolean;
  currentPageIndex: number;
  totalPages: number;
  isFlipping: boolean;
  isWobble: boolean;
  selectedWindId: string;
  windConfig: WindConfig;
  onFlipBackward: () => void;
  onFlipForward: () => void;
  onWindConfigChange: (windId: string) => void;
  onWobbleToggle: () => void;
};

// 컨트롤러 UI 컴포넌트 (스타일 포함)
const PageFlipControllerUI: React.FC<PageFlipControllerProps> = ({
  isDark,
  currentPageIndex,
  totalPages,
  isFlipping,
  isWobble,
  selectedWindId,
  windConfig,
  onFlipBackward,
  onFlipForward,
  onWindConfigChange,
  onWobbleToggle,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '40px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '280px',
      }}
    >
      {/* Wobble 체크박스 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          fontSize: '13px',
          color: isDark ? '#eee' : '#333',
        }}
      >
        <input
          type="checkbox"
          id="wobble-toggle"
          checked={isWobble}
          onChange={onWobbleToggle}
          style={{
            width: '18px',
            height: '18px',
            cursor: 'pointer',
            accentColor: isDark ? '#666' : '#333',
          }}
        />
        <label htmlFor="wobble-toggle" style={{ cursor: 'pointer' }}>
          🌊 3D Wobble
        </label>
      </div>

      {/* 바람 설정 드롭다운 (wobble 활성화 시에만 표시) */}
      {isWobble && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px',
            background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            fontSize: '12px',
            color: isDark ? '#eee' : '#333',
          }}
        >
          <span style={{ fontSize: '11px', opacity: 0.7 }}>💨</span>
          <select
            value={selectedWindId}
            onChange={(e) => onWindConfigChange(e.target.value)}
            style={{
              flex: 1,
              padding: '4px 8px',
              background: 'transparent',
              color: isDark ? '#eee' : '#333',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {windConfigList.map((config) => (
              <option key={config.id} value={config.id}>
                {config.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Previous 버튼 */}
      <button
        onClick={onFlipBackward}
        disabled={currentPageIndex === 0 || isFlipping}
        style={{
          padding: '12px 20px',
          background: isDark ? '#444' : '#eee',
          color: isDark ? '#fff' : '#333',
          border: 'none',
          borderRadius: '8px',
          cursor: currentPageIndex > 0 && !isFlipping ? 'pointer' : 'not-allowed',
          opacity: currentPageIndex > 0 && !isFlipping ? 1 : 0.5,
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
      >
        ◀ Previous
      </button>

      {/* Next 버튼 */}
      <button
        onClick={onFlipForward}
        disabled={currentPageIndex === totalPages - 1 || isFlipping}
        style={{
          padding: '12px 20px',
          background: isDark ? '#444' : '#eee',
          color: isDark ? '#fff' : '#333',
          border: 'none',
          borderRadius: '8px',
          cursor: currentPageIndex < totalPages - 1 && !isFlipping ? 'pointer' : 'not-allowed',
          opacity: currentPageIndex < totalPages - 1 && !isFlipping ? 1 : 0.5,
          fontSize: '14px',
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
      >
        Next ▶
      </button>

      {/* 페이지 정보 표시 */}
      <div
        style={{
          fontSize: '11px',
          color: isDark ? '#aaa' : '#666',
          textAlign: 'center',
          background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.8)',
          padding: '4px 8px',
          borderRadius: '4px',
        }}
      >
        {currentPageIndex + 1} / {totalPages || 1}
        {isFlipping && ' 🔄'}
        {isWobble && ` 🌊 ${windConfig.name}`}
      </div>
    </div>
  );
};

// 🔥 수정: PageFlipController가 children을 받도록 함
type PageFlipControllerMainProps = {
  isDark: boolean;
  totalPages: number;
  isWobble: boolean;
  onWobbleToggle: () => void;
  children?: React.ReactNode; // 🔥 children 추가
};

export const PageFlipController: React.FC<PageFlipControllerMainProps> = ({
  isDark,
  totalPages,
  isWobble,
  onWobbleToggle,
  children, // 🔥 children 받기
}) => {
  // 내부 상태 관리
  const [isFlipping, setIsFlipping] = React.useState(false);
  const [flipDirection, setFlipDirection] = React.useState<'forward' | 'backward'>('forward');
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [flipProgress, setFlipProgress] = React.useState(0);
  const [selectedWindId, setSelectedWindId] = React.useState('gentleBreeze');
  const [windConfig, setWindConfig] = React.useState<WindConfig>(windConfigs.gentleBreeze);

  // 바람 설정 변경 핸들러
  const handleWindConfigChange = React.useCallback((windId: string) => {
    setSelectedWindId(windId);
    setWindConfig(getWindConfig(windId));
  }, []);

  // 플립 포워드 핸들러
  const handleFlipForward = React.useCallback(() => {
    if (currentPageIndex < totalPages - 1 && !isFlipping) {
      setFlipDirection('forward');
      setIsFlipping(true);
      setFlipProgress(0);
    }
  }, [currentPageIndex, totalPages, isFlipping]);

  // 플립 백워드 핸들러
  const handleFlipBackward = React.useCallback(() => {
    if (currentPageIndex > 0 && !isFlipping) {
      setFlipDirection('backward');
      setIsFlipping(true);
      setFlipProgress(0);
    }
  }, [currentPageIndex, isFlipping]);

  // 플립 완료 핸들러
  const handleFlipComplete = React.useCallback(() => {
    const newIndex = flipDirection === 'forward'
      ? Math.min(currentPageIndex + 1, totalPages - 1)
      : Math.max(currentPageIndex - 1, 0);
    setCurrentPageIndex(newIndex);
    setIsFlipping(false);
    setFlipProgress(0);
  }, [flipDirection, currentPageIndex, totalPages]);

  // 플립 애니메이션 효과
  React.useEffect(() => {
    if (!isFlipping) return;

    const startTime = performance.now();
    const duration = isWobble ? (windConfig.flipDuration || 1200) : 600;

    const animate = (timestamp: number) => {
      const elapsed = (timestamp - startTime) / duration;
      const progress = Math.min(elapsed, 1);
      
      // easing
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      setFlipProgress(eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isFlipping, isWobble, windConfig]);

  // 컨트롤러 프롭스 준비
  const controllerProps: PageFlipControllerProps = {
    isDark,
    currentPageIndex,
    totalPages,
    isFlipping,
    isWobble,
    selectedWindId,
    windConfig,
    onFlipBackward: handleFlipBackward,
    onFlipForward: handleFlipForward,
    onWindConfigChange: handleWindConfigChange,
    onWobbleToggle,
  };

  // 현재 페이지 인덱스와 플립 상태를 외부에서 접근 가능하도록
  const contextValue = React.useMemo(() => ({
    currentPageIndex,
    isFlipping,
    flipDirection,
    flipProgress,
    windConfig,
    isWobble,
    handleFlipComplete,
  }), [currentPageIndex, isFlipping, flipDirection, flipProgress, windConfig, isWobble, handleFlipComplete]);

  return (
    <PageFlipContext.Provider value={contextValue}>
      {/* 🔥 UI 컨트롤러와 children 모두 렌더링 */}
      <PageFlipControllerUI {...controllerProps} />
      {children}
    </PageFlipContext.Provider>
  );
};

// Context 생성
type PageFlipContextType = {
  currentPageIndex: number;
  isFlipping: boolean;
  flipDirection: 'forward' | 'backward';
  flipProgress: number;
  windConfig: WindConfig;
  isWobble: boolean;
  handleFlipComplete: () => void;
};

const PageFlipContext = React.createContext<PageFlipContextType | null>(null);

// Context 훅
export const usePageFlip = () => {
  const context = React.useContext(PageFlipContext);
  if (!context) {
    throw new Error('usePageFlip must be used within PageFlipController');
  }
  return context;
};

// 외부에서도 사용할 수 있는 타입 익스포트
export type { PageFlipControllerProps, PageFlipControllerMainProps };