"use client";

export default function SidebarOpenCloseToggle({
  open,
  setOpen,
  sidebarTranslateX,
  sidebarWidth,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  sidebarTranslateX: number;
  sidebarWidth: number;
}) {
  return (
    <button
      onClick={() => setOpen(!open)}
      style={{
        position: "fixed",

        // 핵심: sidebar 위치 + width 기준으로 항상 붙음
        left: sidebarWidth + sidebarTranslateX,
        top: "50%",
        transform: "translate(-50%, -50%)",

        width: 34,
        height: 34,
        borderRadius: "50%",

        zIndex: 200,

        background: "rgba(20,20,20,0.85)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 0 18px rgba(0,0,0,0.45)",
        backdropFilter: "blur(10px)",

        cursor: "pointer",

        transition: "left 0.85s cubic-bezier(0.16, 1, 0.3, 1)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        color: "#e8d7b0",
        fontSize: 14,
      }}
    >
      {open ? "‹" : "›"}
    </button>
  );
}