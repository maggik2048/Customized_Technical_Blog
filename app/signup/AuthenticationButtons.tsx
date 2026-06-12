"use client";

import { useRouter } from "next/navigation";

export default function AuthenticationButtons() {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        marginTop: "16px",
        marginLeft: "4px",
        flexWrap: "wrap",
      }}
    >
      {/* ENTER SITE */}
      <button
        onClick={() => router.push("/enter")}
        style={{
          padding: "12px 20px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.12)",
          cursor: "pointer",
          background:
            "linear-gradient(135deg, rgba(44,92,255,0.95), rgba(20,40,120,0.95))",
          color: "#fff",
          fontWeight: 600,
          letterSpacing: "0.3px",
          boxShadow:
            "0 10px 30px rgba(44,92,255,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          transition: "all 0.25s ease",
        }}
        onMouseOver={(e) => {
          (e.currentTarget.style.transform = "translateY(-2px)");
          (e.currentTarget.style.boxShadow =
            "0 14px 40px rgba(44,92,255,0.35)");
        }}
        onMouseOut={(e) => {
          (e.currentTarget.style.transform = "translateY(0px)");
          (e.currentTarget.style.boxShadow =
            "0 10px 30px rgba(44,92,255,0.25)");
        }}
      >
        Enter Site
      </button>

      {/* ADMIN LOGIN */}
      <button
        onClick={() => router.push("/login")}
        style={{
          padding: "12px 20px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          background:
            "linear-gradient(135deg, rgba(20,20,20,0.95), rgba(50,50,50,0.95))",
          color: "#fff",
          fontWeight: 600,
          letterSpacing: "0.3px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
          transition: "all 0.25s ease",
        }}
        onMouseOver={(e) => {
          (e.currentTarget.style.transform = "translateY(-2px)");
          (e.currentTarget.style.boxShadow =
            "0 14px 40px rgba(0,0,0,0.45)");
        }}
        onMouseOut={(e) => {
          (e.currentTarget.style.transform = "translateY(0px)");
          (e.currentTarget.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.35)");
        }}
      >
        Admin Login
      </button>

      {/* ADMIN SIGNUP */}
      <button
        onClick={() => router.push("/signup")}
        style={{
          padding: "12px 20px",
          borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.15)",
          cursor: "pointer",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(230,230,230,0.95))",
          color: "#111",
          fontWeight: 600,
          letterSpacing: "0.3px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
          backdropFilter: "blur(8px)",
          transition: "all 0.25s ease",
        }}
        onMouseOver={(e) => {
          (e.currentTarget.style.transform = "translateY(-2px)");
          (e.currentTarget.style.boxShadow =
            "0 14px 40px rgba(0,0,0,0.18)");
        }}
        onMouseOut={(e) => {
          (e.currentTarget.style.transform = "translateY(0px)");
          (e.currentTarget.style.boxShadow =
            "0 10px 30px rgba(0,0,0,0.12)");
        }}
      >
        Admin Sign Up
      </button>
    </div>
  );
}