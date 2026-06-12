"use client";

import { useRouter } from "next/navigation";

export default function AuthenticationButtons() {
  const router = useRouter();

  const baseButtonStyle: React.CSSProperties = {
    minWidth: "220px",

    padding: "18px 28px",

    borderRadius: "4px",

    cursor: "pointer",

    fontSize: "16px",

    fontWeight: 800,

    letterSpacing: "2.8px",

    textTransform: "uppercase",

    fontFamily:
      '"Cormorant Garamond", "Playfair Display", "Times New Roman", serif',

    transition: "all 0.25s ease",

    boxSizing: "border-box",

    background: "rgba(255,255,255,0.03)",

    color: "#111111",

    border: "1px solid rgba(184,134,11,0.65)",

    boxShadow: `
      inset 0 3px 0 rgba(255, 252, 232, 0.95),
      inset 0 18px 28px rgba(0,0,0,0.10),
      inset 0 -1px 0 rgba(184,134,11,0.25)
    `,

    textShadow:
      "0 1px 0 rgba(255,255,255,0.45)",

    backdropFilter: "blur(1px)",

    WebkitBackdropFilter: "blur(1px)",
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.currentTarget.style.transform =
      "translateY(-2px)";

    e.currentTarget.style.border =
      "1px solid rgba(255,215,0,0.95)";

    e.currentTarget.style.boxShadow = `
      inset 0 4px 0 rgba(255,215,0,1),
      inset 0 22px 32px rgba(0,0,0,0.13),
      inset 0 -1px 0 rgba(255,215,0,0.35)
    `;
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.currentTarget.style.transform =
      "translateY(0px)";

    e.currentTarget.style.border =
      "1px solid rgba(184,134,11,0.65)";

    e.currentTarget.style.boxShadow = `
      inset 0 3px 0 rgba(255,215,0,0.95),
      inset 0 18px 28px rgba(0,0,0,0.10),
      inset 0 -1px 0 rgba(184,134,11,0.25)
    `;
  };

  return (
    <div
      style={{
        display: "flex",

        flexDirection: "row",

        alignItems: "center",

        gap: "14px",
      }}
    >
      <button
        onClick={() => router.push("/enter")}
        style={baseButtonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Enter Site
      </button>

      <button
        onClick={() => router.push("/login")}
        style={baseButtonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Admin Login
      </button>

      <button
        onClick={() => router.push("/signup")}
        style={baseButtonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Admin Sign Up
      </button>
    </div>
  );
}