"use client";

import { useRouter } from "next/navigation";

export default function ProjectBoxRenderer() {
  const router = useRouter();

  const cardStyle: React.CSSProperties = {
    width: "240px",

    height: "240px",

    borderRadius: "18px",

    overflow: "hidden",

    cursor: "pointer",

    border:
      "1px solid rgba(255,255,255,0.12)",

    background:
      "rgba(165,170,185,0.10)",

    backdropFilter:
      "invert(1) brightness(0.92)",

    WebkitBackdropFilter:
      "invert(1) brightness(0.92)",

    boxShadow:
      "0 14px 40px rgba(0,0,0,0.18)",

    transition:
      "transform 0.25s ease, box-shadow 0.25s ease",

    display: "flex",

    flexDirection: "column",
  };

  const imageStyle: React.CSSProperties = {
    flex: 1,

    width: "100%",

    objectFit: "cover",

    display: "block",
  };

  const titleStyle: React.CSSProperties = {
    height: "54px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#fff",

    fontWeight: 700,

    letterSpacing: "1px",

    textTransform: "uppercase",

    textShadow:
      "0 2px 4px rgba(0,0,0,0.75)",

    borderTop:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(0,0,0,0.18)",
  };

  const handleEnter = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.currentTarget.style.transform =
      "translateY(-6px) scale(1.02)";

    e.currentTarget.style.boxShadow =
      "0 22px 60px rgba(0,0,0,0.26)";
  };

  const handleLeave = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.currentTarget.style.transform =
      "translateY(0px) scale(1)";

    e.currentTarget.style.boxShadow =
      "0 14px 40px rgba(0,0,0,0.18)";
  };

  return (
    <div
      style={{
        position: "absolute",

        left: 40,

        bottom: 40,

        display: "flex",

        flexDirection: "row",

        gap: 20,

        zIndex: 9999,
      }}
    >
      {/* PENCIL */}
      <div
        style={cardStyle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={() =>
          router.push(
            "/Graphics/PencilEffect"
          )
        }
      >
        <img
          src="/images/pencildrawing/artistic.jpg"
          alt="Pencil Background"
          style={imageStyle}
        />

        <div style={titleStyle}>
          Pencil Background
        </div>
      </div>

      {/* HDRI */}
      <div
        style={cardStyle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={() =>
          router.push(
            "/Graphics/MaterialSystem"
          )
        }
      >
        <img
          src="/images/materialsystem/Screenshot 2026-05-20 070042.png"
          alt="HDRI Renderer"
          style={imageStyle}
        />

        <div style={titleStyle}>
          HDRI Renderer
        </div>
      </div>

      {/* WORLD STREAM */}
      <div
        style={cardStyle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onClick={() =>
          router.push(
            "/Graphics/WorldStreamingSystem"
          )
        }
      >
        <img
          src="/images/GIS/Capture d’écran 2026-06-12 080402.jpg"
          alt="World Stream Renderer"
          style={imageStyle}
        />

        <div style={titleStyle}>
          WorldStreamRenderer
        </div>
      </div>
    </div>
  );
}