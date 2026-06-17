// app/components/papers/PDFPageScrollBar.tsx
"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

interface PDFPageScrollBarProps {
  isDark: boolean;
  totalPages?: number;
  currentPage?: number;
}

export default function PDFPageScrollBar({
  isDark,
  totalPages,
  currentPage,
}: PDFPageScrollBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 스크롤 위치 추적
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      setScrollProgress(progress);
      
      // 스크롤바 가시성 (스크롤이 100px 이상 내려가면 표시)
      setIsVisible(scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 초기 실행
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 스크롤바 드래그
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateScrollPosition(e);
  }, []);

  const updateScrollPosition = useCallback((e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const scrollBar = scrollBarRef.current;
    if (!scrollBar) return;

    const rect = scrollBar.getBoundingClientRect();
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    const progress = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    setScrollProgress(progress);

    // 실제 스크롤 이동
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * maxScroll,
      behavior: "smooth"
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 전역 이벤트
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      updateScrollPosition(e);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateScrollPosition(e);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, updateScrollPosition, handleDragEnd]);

  // Portal을 사용하여 body에 직접 렌더링
  if (!mounted) return null;

  const scrollBarElement = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={scrollBarRef}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            width: 6,
            height: 300,
            borderRadius: 3,
            background: isDark
              ? "rgba(255, 255, 255, 0.08)"
              : "rgba(0, 0, 0, 0.06)",
            cursor: "pointer",
            touchAction: "none",
            userSelect: "none",
            zIndex: 999999,
            backdropFilter: "blur(10px)",
            boxShadow: isDark
              ? "0 0 20px rgba(0,0,0,0.3)"
              : "0 0 20px rgba(0,0,0,0.05)",
          }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          {/* 진행바 */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: `${scrollProgress * 100}%`,
              borderRadius: 3,
              background: isDark
                ? "linear-gradient(to bottom, #8b5cf6, #6d28d9)"
                : "linear-gradient(to bottom, #7c3aed, #4f46e5)",
              boxShadow: isDark
                ? "0 0 20px rgba(139, 92, 246, 0.3)"
                : "0 0 20px rgba(124, 58, 237, 0.2)",
              transition: isDragging ? "none" : "height 0.1s ease",
            }}
          />

          {/* 드래그 핸들 */}
          <motion.div
            style={{
              position: "absolute",
              left: "50%",
              top: `${scrollProgress * 100}%`,
              transform: "translate(-50%, -50%)",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: isDark ? "#8b5cf6" : "#7c3aed",
              boxShadow: isDark
                ? "0 0 30px rgba(139, 92, 246, 0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                : "0 0 30px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
              border: isDark
                ? "2px solid rgba(255, 255, 255, 0.2)"
                : "2px solid rgba(255, 255, 255, 0.9)",
              transition: isDragging ? "none" : "all 0.2s ease",
              scale: isDragging ? 1.3 : 1,
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />

          {/* 페이지 표시 */}
          {totalPages && currentPage && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                position: "absolute",
                right: 28,
                top: `${scrollProgress * 100}%`,
                transform: "translateY(-50%)",
                fontSize: 12,
                fontWeight: 600,
                color: isDark ? "#e2e8f0" : "#1e293b",
                background: isDark
                  ? "rgba(30, 30, 30, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                padding: "6px 12px",
                borderRadius: 6,
                backdropFilter: "blur(10px)",
                border: isDark
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.06)",
                whiteSpace: "nowrap",
                boxShadow: isDark
                  ? "0 4px 12px rgba(0,0,0,0.3)"
                  : "0 4px 12px rgba(0,0,0,0.08)",
                letterSpacing: "0.5px",
              }}
            >
              {currentPage} / {totalPages}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // createPortal로 body에 직접 렌더링
  return createPortal(scrollBarElement, document.body);
}