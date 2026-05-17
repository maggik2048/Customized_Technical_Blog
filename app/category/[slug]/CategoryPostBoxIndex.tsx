"use client";

export default function CategoryPostBoxIndex({
  categoryIndex,
  globalIndex,
  isSimple,
}: {
  categoryIndex: number;
  globalIndex: number;
  isSimple: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 8,
        top: "50%",
        transform: "translateY(-50%)",

        zIndex: 20, // 🔥 핵심 (무조건 위로 올림)

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,

        fontSize: 9,
        letterSpacing: "0.08em",

        pointerEvents: "none", // 클릭 방해 방지

        color: isSimple
          ? "rgba(60,60,60,0.65)"
          : "rgba(255,255,255,0.75)",
      }}
    >
      <div>{categoryIndex}</div>
      <div style={{ opacity: 0.7 }}>{globalIndex}</div>
    </div>
  );
}