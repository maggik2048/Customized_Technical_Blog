"use client";

import { useRouter } from "next/navigation";

export default function AuthenticationButtons() {
  const router = useRouter();

  const baseButtonStyle: React.CSSProperties = {
    minWidth: "220px",

    padding: "18px 34px",

    borderRadius: "18px",

    cursor: "pointer",

    fontSize: "15px",

    fontWeight: 800,

    letterSpacing: "2.5px",

    textTransform: "uppercase",

    fontFamily:
      '"Playfair Display", "Cormorant Garamond", "Times New Roman", serif',

    transition: "all 0.28s ease",

    backdropFilter: "blur(10px)",

    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "18px",
        marginTop: "22px",
        marginLeft: "4px",
        flexWrap: "wrap",
      }}
    >
      {/* ENTER SITE */}
      <button
        onClick={() => router.push("/enter")}
        style={{
          ...baseButtonStyle,

          background:
            "linear-gradient(180deg,#0f0f10 0%,#050505 100%)",

          color: "#f7f7f7",

          border:
            "1px solid rgba(255,255,255,0.18)",

          boxShadow: `
            0 20px 50px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(255,255,255,0.12)
          `,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform =
            "translateY(-4px) scale(1.015)";

          e.currentTarget.style.boxShadow = `
            0 28px 70px rgba(0,0,0,0.38),
            inset 0 1px 0 rgba(255,255,255,0.18)
          `;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform =
            "translateY(0px) scale(1)";

          e.currentTarget.style.boxShadow = `
            0 20px 50px rgba(0,0,0,0.30),
            inset 0 1px 0 rgba(255,255,255,0.12)
          `;
        }}
      >
        Enter Site
      </button>

      {/* ADMIN LOGIN */}
      <button
        onClick={() => router.push("/login")}
        style={{
          ...baseButtonStyle,

          background:
            "rgba(15,15,15,0.88)",

          color: "#ffffff",

          border:
            "1px solid rgba(255,255,255,0.10)",

          boxShadow: `
            0 20px 50px rgba(0,0,0,0.25)
          `,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform =
            "translateY(-4px) scale(1.015)";

          e.currentTarget.style.background =
            "rgba(5,5,5,0.95)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform =
            "translateY(0px) scale(1)";

          e.currentTarget.style.background =
            "rgba(15,15,15,0.88)";
        }}
      >
        Admin Login
      </button>

      {/* ADMIN SIGN UP */}
      <button
        onClick={() => router.push("/signup")}
        style={{
          ...baseButtonStyle,

          background:
            "linear-gradient(180deg,#faf8f3 0%,#ece7dd 100%)",

          color: "#111",

          border:
            "1px solid rgba(0,0,0,0.10)",

          boxShadow: `
            0 20px 50px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.9)
          `,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform =
            "translateY(-4px) scale(1.015)";

          e.currentTarget.style.boxShadow = `
            0 26px 60px rgba(0,0,0,0.18),
            inset 0 1px 0 rgba(255,255,255,1)
          `;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform =
            "translateY(0px) scale(1)";

          e.currentTarget.style.boxShadow = `
            0 20px 50px rgba(0,0,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.9)
          `;
        }}
      >
        Admin Sign Up
      </button>
    </div>
  );
}