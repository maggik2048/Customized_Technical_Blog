"use client";

export default function PaperStack({ children }: any) {
  return (
    <div
      style={{
        position: "relative",
        marginBottom: 100,
        padding: 40,
      }}
    >
      {/* 뒤 종이 2 */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: "100%",
          height: "100%",
          background: "rgba(255,255,255,0.2)",
          borderRadius: 12,
          transform: "scale(0.96)",
          zIndex: 0,
        }}
      />

      {/* 뒤 종이 1 */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: "100%",
          height: "100%",
          background: "rgba(255,255,255,0.35)",
          borderRadius: 12,
          transform: "scale(0.98)",
          zIndex: 0,
        }}
      />

      {/* 실제 페이지 */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}