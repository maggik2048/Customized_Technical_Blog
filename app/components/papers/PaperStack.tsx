"use client";

export default function PaperStack({ children }: any) {
  return (
    <div style={{ position: "relative", marginBottom: 80 }}>
      
      {/* 뒤 종이 1 */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          right: -12,
          bottom: -12,
          background: "rgba(255,255,255,0.35)",
          borderRadius: 12,
          zIndex: 0,
        }}
      />

      {/* 뒤 종이 2 */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          right: -24,
          bottom: -24,
          background: "rgba(255,255,255,0.2)",
          borderRadius: 12,
          zIndex: 0,
        }}
      />

      {/* 실제 콘텐츠 */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}