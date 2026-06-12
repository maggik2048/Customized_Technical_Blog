"use client";

import { useRouter } from "next/navigation";

export default function ProjectBoxRenderer() {
  const router = useRouter();

  const projects = [
    {
      title: "Pencil Background",
      image:
        "/images/pencildrawing/artistic.jpg",
      href:
        "/Graphics/PencilEffect",
    },

    {
      title: "HDRI Renderer",
      image:
        "/images/materialsystem/Screenshot 2026-05-20 070042.png",
      href:
        "/Graphics/MaterialSystem",
    },

    {
      title: "World Stream Renderer",
      image:
        "/images/GIS/Capture d’écran 2026-06-12 080402.jpg",
      href:
        "/Graphics/WorldStreamingSystem",
    },
  ];

  return (
    <div
      style={{
        position: "absolute",

        left: 40,

        bottom: 40,

        display: "flex",

        flexDirection: "column",

        gap: 20,

        zIndex: 9999,
      }}
    >
      {projects.map((project) => (
        <div
          key={project.title}
          onClick={() =>
            router.push(project.href)
          }
          style={{
            position: "relative",

            width: 300,

            height: 220,

            cursor: "pointer",

            borderRadius: 18,

            overflow: "visible",

            background:
              "rgba(165,170,185,0.08)",

            backdropFilter:
              "invert(1) brightness(0.92)",

            WebkitBackdropFilter:
              "invert(1) brightness(0.92)",

            border:
              "1px solid rgba(255,255,255,0.12)",

            boxShadow:
              "0 20px 60px rgba(0,0,0,0.25)",

            transition:
              "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-6px) scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0px) scale(1)";
          }}
        >
          {/* IMAGE AREA */}
          <div
            style={{
              position: "absolute",

              top: 0,
              left: 0,
              right: 0,

              height: "82%",

              overflow: "hidden",

              borderRadius:
                "18px 18px 0 0",
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{
                width: "100%",

                height: "100%",

                objectFit: "cover",

                display: "block",
              }}
            />
          </div>

          {/* FOLDER TAB */}
          <div
            style={{
              position: "absolute",

              bottom: -1,

              left: 0,

              width: "72%",

              height: 52,

              display: "flex",

              alignItems: "center",

              paddingLeft: 18,

              background:
                "rgba(35,35,35,0.92)",

              borderTop:
                "1px solid rgba(255,255,255,0.12)",

              borderRight:
                "1px solid rgba(255,255,255,0.10)",

              borderRadius:
                "0 18px 0 18px",

              boxShadow:
                "0 -1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <span
              style={{
                color: "#fff",

                fontWeight: 700,

                fontSize: 13,

                letterSpacing: "1.4px",

                textTransform:
                  "uppercase",

                textShadow:
                  "0 2px 4px rgba(0,0,0,0.6)",
              }}
            >
              {project.title}
            </span>
          </div>

          {/* OUTER GLOW */}
          <div
            style={{
              position: "absolute",

              inset: 0,

              pointerEvents: "none",

              borderRadius: 18,

              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          />
        </div>
      ))}
    </div>
  );
}