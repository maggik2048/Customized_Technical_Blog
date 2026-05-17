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

        // sidebar edge tracking
        left: sidebarWidth + sidebarTranslateX,
        top: "50%",

        transform: "translate(-50%, -50%)",

        zIndex: 200,

        background: "transparent",
        border: "none",
        outline: "none",

        cursor: "pointer",

        padding: 0,
        margin: 0,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        transition:
          "left 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s ease",

        userSelect: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translate(-50%, -50%) scale(1.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translate(-50%, -50%) scale(1)";
      }}
    >
      {/* SYMBOL */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          // open 상태면 약간 어두운 아이보리
          color: open ? "rgba(175, 169, 154, 0.92)" : "#050505",

          fontSize: 58,

          // Ψ thinner
          fontWeight: open ? 100 : 900,

          fontFamily:
            '"STIX Two Math", "Cambria Math", "Times New Roman", serif',

          lineHeight: 1,

          transform: "rotate(90deg)",

          // stronger & wider dark emboss
          textShadow: open
            ? `
              -2.8px -2.8px 4px rgba(8,8,8,0.92),
              -1.5px -1.5px 2px rgba(20,20,20,0.72),

               1px 1px 1px rgba(255,248,235,0.22),

               0 0 12px rgba(255,240,200,0.06),
               0 3px 10px rgba(0,0,0,0.32)
            `
            : `
              0 0 1px rgba(255,255,255,0.9),
              0 0 14px rgba(255,215,120,0.18),
              0 2px 12px rgba(0,0,0,0.35)
            `,

          transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {open ? "Ψ" : "Ω"}
      </span>

      {/* CENTERED VERTICAL TEXT */}
      <span
        style={{
          position: "absolute",

          // Ω / Ψ 기준 오른쪽 중앙
          left: 58,
          top: "-27%",

          transform: "translateY(-50%) rotate(90deg)",
          transformOrigin: "left center",

          color: open
            ? "rgba(222,216,202,0.78)"
            : "rgba(10,10,10,0.78)",

          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.12em",

          fontFamily:
            '"STIX Two Text", "Times New Roman", "Georgia", serif',

          textTransform: "uppercase",

          whiteSpace: "nowrap",

          textShadow: open
            ? "0 0 8px rgba(255,245,220,0.10)"
            : "0 1px 1px rgba(255,255,255,0.4)",

          transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {open ? "Close Sidebar" : "Open Sidebar"}
      </span>
    </button>
  );
}