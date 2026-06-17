"use client";

import "./globals.css";
import { usePathname } from "next/navigation";

import SidebarState from "./components/SidebarCategory/SidebarState";
import { DarkModeProvider } from "./context/DarkModeContext.tsx";
import { CastShadowFilterProvider } from "./context/CastShadowFilterContext";

import { HDRIProvider } from "./components/Markdown/Theme/HDRIProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const bgImage = "/images/mathdraw32.png";
  const birdsImage = "/images/birds2.png";

  return (
    <html lang="en">
      <body className="font-lm m-0">

        {/* ✅ HDRIProvider로 전체 감싸기 (기존 Provider들은 내부에 그대로) */}
        <HDRIProvider>
          <CastShadowFilterProvider>
            <DarkModeProvider>

              {/* ================= HOME BACKGROUND ================= */}
              {isHome && (
                <>
                  {/* BASE BACKGROUND */}
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      backgroundImage: `url("${bgImage}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transform: "scale(1.02)",
                      zIndex: -6,
                    }}
                  />

                  {/* INVERT LAYER */}
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      backgroundImage: `url("${bgImage}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transform: "scale(1.02)",

                      filter: `
                        invert(1)
                        hue-rotate(200deg)
                        saturate(1.6)
                        contrast(1.15)
                        brightness(0.88)
                        sepia(0.05)
                      `,

                      opacity: 0.92,
                      zIndex: -5,
                      pointerEvents: "none",

                      maskImage: `
                        linear-gradient(
                          to top,
                          rgba(0,0,0,1) 0%,
                          rgba(0,0,0,0.97) 22%,
                          rgba(0,0,0,0.88) 38%,
                          rgba(0,0,0,0.70) 58%,
                          rgba(0,0,0,0.48) 78%,
                          rgba(0,0,0,0.26) 90%,
                          rgba(0,0,0,0.10) 100%
                        )
                      `,

                      WebkitMaskImage: `
                        linear-gradient(
                          to top,
                          rgba(0,0,0,1) 0%,
                          rgba(0,0,0,0.97) 22%,
                          rgba(0,0,0,0.88) 38%,
                          rgba(0,0,0,0.70) 58%,
                          rgba(0,0,0,0.48) 78%,
                          rgba(0,0,0,0.26) 90%,
                          rgba(0,0,0,0.10) 100%
                        )
                      `,
                    }}
                  />

                  {/* CLAMP LAYER (BOTTOM → TOP GRADIENT) */}
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: -4,
                      pointerEvents: "none",

                      background: `
                        linear-gradient(
                          to bottom,

                          rgba(255,255,255,0.05) 0%,

                          rgba(245,248,255,0.09) 10%,
                          rgba(210,220,245,0.36) 22%,

                          rgba(254, 254, 255, 0.42) 35%,
                          rgba(150,165,205,0.30) 50%,

                          rgba(120,130,170,0.38) 65%,
                          rgba(95,100,140,0.48) 80%,

                          rgba(35,40,70,0.62) 92%,
                          rgba(10,12,25,0.75) 100%
                        )
                      `,

                      mixBlendMode: "lighten",
                    }}
                  />

                  {/* DEPTH */}
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: -3,
                      pointerEvents: "none",

                      background: `
                        radial-gradient(
                          circle at 85% 50%,
                          rgba(80, 85, 122, 0.35),
                          transparent 60%
                        )
                      `,

                      mixBlendMode: "screen",
                    }}
                  />

                  {/* BIRDS */}
                  <div
                    style={{
                      position: "fixed",
                      right: "-15vw",
                      bottom: "-14vh",
                      width: "48vw",
                      height: "48vw",
                      backgroundImage: `url("${birdsImage}")`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "contain",
                      backgroundPosition: "bottom right",
                      zIndex: -2,
                      pointerEvents: "none",
                      opacity: 0.6,
                      filter: `
                        drop-shadow(0 0 40px rgba(120,140,255,0.22))
                        contrast(1.08)
                        saturate(1.1)
                      `,
                      transform: "rotate(-2deg)",
                    }}
                  />

                  {/* GRAIN */}
                  <div
                    style={{
                      position: "fixed",
                      inset: 0,
                      zIndex: -1,
                      opacity: 0.07,
                      pointerEvents: "none",
                      backgroundImage:
                        "url('https://www.transparenttextures.com/patterns/noise.png')",
                    }}
                  />
                </>
              )}

              {/* ================= MAIN ================= */}
              {isHome ? (
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 40px",
                  }}
                >
                  {children}
                </div>
              ) : (
                <div style={{ display: "flex", height: "100vh" }}>
                  <SidebarState />

                  <main
                    style={{
                      flex: 1,
                      padding: "24px",
                      overflow: "auto",
                      background: "transparent",
                    }}
                  >
                    {children}
                  </main>
                </div>
              )}

            </DarkModeProvider>
          </CastShadowFilterProvider>
        </HDRIProvider>

      </body>
    </html>
  );
}