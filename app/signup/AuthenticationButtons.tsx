"use client";

import { useRouter } from "next/navigation";

export default function AuthenticationButtons() {
  const router = useRouter();

  const baseButtonStyle: React.CSSProperties = {
    minWidth: "180px",

    padding: "14px 22px",

    borderRadius: "14px",

    cursor: "pointer",

    fontSize: "13px",

    fontWeight: 800,

    letterSpacing: "1.8px",

    textTransform: "uppercase",

    fontFamily:
      '"Playfair Display", "Cormorant Garamond", "Times New Roman", serif',

    transition: "all 0.28s ease",

    boxSizing: "border-box",

    color: "#ffffff",

    background:
      "rgba(165,170,185,0.08)",

    backdropFilter:
      "invert(1) brightness(0.90)",

    WebkitBackdropFilter:
      "invert(1) brightness(0.90)",

    border:
      "1px solid rgba(255,255,255,0.16)",

    boxShadow: `
      0 14px 40px rgba(0,0,0,0.18),
      inset 0 1px 0 rgba(255,255,255,0.10)
    `,

    textShadow:
      "0 2px 4px rgba(0,0,0,0.70)",
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.currentTarget.style.transform =
      "translateY(-4px) scale(1.02)";

    e.currentTarget.style.backdropFilter =
      "invert(1) brightness(0.98)";

    (
      e.currentTarget.style as any
    ).webkitBackdropFilter =
      "invert(1) brightness(0.98)";

    e.currentTarget.style.boxShadow =
      "0 24px 60px rgba(0,0,0,0.24)";
  };

  const handleMouseLeave = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.currentTarget.style.transform =
      "translateY(0px) scale(1)";

    e.currentTarget.style.backdropFilter =
      "invert(1) brightness(0.90)";

    (
      e.currentTarget.style as any
    ).webkitBackdropFilter =
      "invert(1) brightness(0.90)";

    e.currentTarget.style.boxShadow =
      "0 14px 40px rgba(0,0,0,0.18)";
  };

  return (
    <div
      style={{
        display: "flex",

        flexDirection: "row",

        alignItems: "center",

        gap: "12px",
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