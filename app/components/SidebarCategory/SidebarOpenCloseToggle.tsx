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
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          color: "#050505",

          fontSize: 58,
          fontWeight: 900,

          fontFamily:
            '"STIX Two Math", "Cambria Math", "Times New Roman", serif',

          lineHeight: 1,

          transform: "rotate(90deg)",

          textShadow: `
            0 0 1px rgba(255,255,255,0.9),
            0 0 14px rgba(255,215,120,0.18),
            0 2px 12px rgba(0,0,0,0.35)
          `,

          transition: "all 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {open ? "Ψ" : "Ω"}
      </span>
    </button>
  );
}