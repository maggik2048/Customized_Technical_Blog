"use client";

export default function SidebarOpenCloseToggle({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => setOpen(!open)}
      style={{
        position: "fixed",

        /**
         * 🔥 sidebar 오른쪽 중앙 고정
         * sidebar width = 390 기준
         */
        left: 390,
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

        transition:
          "transform 0.3s ease, background 0.3s ease",

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