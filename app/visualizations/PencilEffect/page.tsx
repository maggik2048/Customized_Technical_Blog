"use client";

export default function PencilEffectPage() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: "url('/images/pencildrawing/testbg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          background: "rgba(0,0,0,0.4)",
          padding: "20px",
          borderRadius: "12px",
          backdropFilter: "blur(6px)",
        }}
      >
        Pencil Effect Visualization
      </div>
    </div>
  );
}