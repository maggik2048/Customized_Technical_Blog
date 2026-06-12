"use client";

import { useRouter } from "next/navigation";

export default function ProjectBoxRenderer() {
  const router = useRouter();

  const buttonStyle: React.CSSProperties = {
    width: "220px",

    padding: "14px 20px",

    borderRadius: "14px",

    border: "1px solid rgba(255,255,255,0.12)",

    background:
      "rgba(165,170,185,0.10)",

    backdropFilter:
      "invert(1) brightness(0.92)",

    WebkitBackdropFilter:
      "invert(1) brightness(0.92)",

    color: "#ffffff",

    cursor: "pointer",

    fontSize: "13px",

    fontWeight: 700,

    letterSpacing: "1.2px",

    textTransform: "uppercase",

    transition: "all 0.25s ease",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.18)",

    textShadow:
      "0 2px 4px rgba(0,0,0,0.65)",
  };

  return (
    <div
      style={{
        position: "absolute",

        left: 40,

        bottom: 40,

        display: "flex",

        flexDirection: "column",

        gap: 12,

        zIndex: 9999,
      }}
    >
      <button
        style={buttonStyle}
        onClick={() =>
          router.push(
            "/Graphics/PencilEffect"
          )
        }
      >
        Pencil Background
      </button>

      <button
        style={buttonStyle}
        onClick={() =>
          router.push(
            "/Graphics/MaterialSystem"
          )
        }
      >
        HDRI Renderer
      </button>

      <button
        style={buttonStyle}
        onClick={() =>
          router.push(
            "/Graphics/WorldStreamingSystem"
          )
        }
      >
        WorldStreamRenderer
      </button>
    </div>
  );
}