"use client";

import "./globals.css";
import { usePathname } from "next/navigation";

import SidebarState from "./components/SidebarCategory/SidebarState";
import ClickableImageBox from "./components/ClickableImageBox";
import { DarkModeProvider } from "./context/DarkModeContext.tsx";

// 👉 추가
import { CastShadowFilterProvider } from "./context/CastShadowFilterContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/latin-modern-web@1.1.0/fonts.css"
          rel="stylesheet"
        />
      </head>

      <body className="font-lm m-0">
        {/* ✅ 여기 중요: Shadow Filter Provider를 DarkMode 위에 올려도 OK */}
        <CastShadowFilterProvider>
          <DarkModeProvider>
            {isHome ? (
              <div
                style={{
                  position: "relative",
                  width: "100vw",
                  height: "100vh",
                  backgroundImage: `
                    radial-gradient(circle at center, 
                      rgba(0,0,0,0) 40%, 
                      rgba(0,0,0,0.2) 70%, 
                      rgba(0,0,0,0.2) 100%
                    ),
                    url('/images/bgdraw.png')
                  `,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  overflow: "hidden",
                }}
              >
                {/* LEFT OVERLAY */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "180px",
                    height: "100%",
                    width: "630px",
                    background: `
                      linear-gradient(rgba(40,40,60,0.65), rgba(40,40,40,0.95)),
                      url('/images/dvinch6.jpg')
                    `,
                    backgroundSize: "150% auto",
                    backgroundPosition: "center",
                    backdropFilter: "blur(3px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "28px",
                    zIndex: 1,
                  }}
                >
                  <ClickableImageBox
                    imageSrc="/images/manim.png"
                    href="/category/art"
                  />
                  <ClickableImageBox
                    imageSrc="/images/painting.png"
                    href="/category/code"
                  />
                </div>

                {/* MAIN */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "80px",
                  }}
                >
                  {children}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", height: "100vh" }}>
                <SidebarState />

                <main
                  style={{
                    flex: 1,
                    background: "transparent",
                    padding: "24px",
                    overflow: "auto",
                  }}
                >
                  {children}
                </main>
              </div>
            )}
          </DarkModeProvider>
        </CastShadowFilterProvider>
      </body>
    </html>
  );
}