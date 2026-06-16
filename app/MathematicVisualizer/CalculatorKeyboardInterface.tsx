"use client";

import React, { useEffect, useState } from "react";
import MorphingTextAnimation from "../../MathematicVisualizer/morphingTextAnimation";
import CalculatorGraphTheme from "../../MathematicVisualizer/CalculatorGraphTheme";

type Props = {
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  initialValue?: string;
};

export default function SearchBarButton({
  onSearch,
  onFilterClick,
  initialValue = "",
}: Props) {
  const [value, setValue] = useState(initialValue);
  const [isActive, setIsActive] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [lastSearched, setLastSearched] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
    setLastSearched(initialValue);
  }, [initialValue]);

  const handleSearch = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setLastSearched("");
      await onSearch?.("");
      return;
    }
    if (trimmed === lastSearched) return;
    try {
      setIsSearching(true);
      setLastSearched(trimmed);
      await onSearch?.(trimmed);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!value.trim()) {
      onSearch?.("");
      setLastSearched("");
      return;
    }
    const timer = setTimeout(() => {
      handleSearch();
    }, 400);
    return () => clearTimeout(timer);
  }, [value]);

  const Magnifier = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="1.6" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );

  const CalculatorIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="3" stroke="rgba(0,0,0,0.75)" strokeWidth="1.4" />
      <rect x="7" y="5" width="10" height="3" rx="1" fill="rgba(0,0,0,0.6)" />
      <circle cx="8" cy="12" r="1" fill="rgba(0,0,0,0.7)" />
      <circle cx="12" cy="12" r="1" fill="rgba(0,0,0,0.7)" />
      <circle cx="16" cy="12" r="1" fill="rgba(0,0,0,0.7)" />
      <circle cx="8" cy="16" r="1" fill="rgba(0,0,0,0.7)" />
      <circle cx="12" cy="16" r="1" fill="rgba(0,0,0,0.7)" />
      <circle cx="16" cy="16" r="1" fill="rgba(0,0,0,0.7)" />
    </svg>
  );

  return (
    <>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          maxWidth: 560,
          padding: "6px 14px",
          background: "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.42))",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          borderRadius: 999,
        }}
      >
        {/* LEFT */}
        <div
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
          style={{
            position: "absolute",
            left: -48,
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
            zIndex: 9999,
          }}
          onClick={handleSearch}
        >
          <MorphingTextAnimation active={isActive} size={60} />
          <span
            style={{
              filter: `drop-shadow(2px 3px 0px rgba(0,0,0,0.65)) drop-shadow(0px 1px 6px rgba(0,0,0,0.55))`,
            }}
          >
            <Magnifier size={18} />
          </span>
        </div>

        {/* INPUT */}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Search On this Category..."
          style={{
            flex: 1,
            marginLeft: 10,
            marginRight: 180,
            height: 34,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 14,
            fontFamily: "ui-serif, Georgia, 'Times New Roman', Times, serif",
            color: "#1a1a1a",
          }}
        />

        {/* RIGHT ACTIONS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {/* CALCULATOR - Temporarily using CalculatorGraphTheme */}
          <button
            onClick={() => setShowCalculator(true)}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.24)",
              background: "rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <CalculatorIcon size={18} />
          </button>

          {/* SEARCH */}
          <button
            onClick={handleSearch}
            disabled={isSearching}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 30,
              padding: "0 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(0,0,0,0.04)",
              color: "rgba(0,0,0,0.7)",
              fontSize: 12,
              cursor: isSearching ? "wait" : "pointer",
              opacity: isSearching ? 0.7 : 1,
              fontFamily: "ui-serif, Georgia, 'Times New Roman', Times, serif",
            }}
          >
            <Magnifier size={14} />
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>

        {/* FILTER */}
        <span
          onClick={onFilterClick}
          style={{
            position: "absolute",
            right: -78,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 12,
            letterSpacing: "0.18em",
            fontFamily: "ui-serif, Georgia, 'Times New Roman', Times, serif",
            color: "rgba(255,255,255,0.55)",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          FILTER
        </span>
      </div>

      {/* CALCULATOR MODAL */}
      {showCalculator && (
        <div
          onClick={() => setShowCalculator(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: "58vh",
              background: `linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.28), rgba(0,0,0,0.0))`,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              pointerEvents: "none",
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              paddingBottom: -10,
              animation: "slideUpCalc 0.24s ease",
            }}
          >
            <CalculatorGraphTheme 
              onClose={() => setShowCalculator(false)}
              title="CALCULATOR"
            >
              <div style={{ padding: 40, textAlign: "center", color: "#f8ead2" }}>
                <h2>Calculator Coming Soon</h2>
                <p style={{ marginTop: 20, opacity: 0.7 }}>
                  그래프 계산기 인터페이스가 준비 중입니다.
                </p>
              </div>
            </CalculatorGraphTheme>
          </div>
        </div>
      )}
    </>
  );
}