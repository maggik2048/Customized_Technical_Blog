"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import SidebarWrapper from "./components/SidebarWrapper";
import ClickableImageBox from "./components/ClickableImageBox";
import { DarkModeProvider } from "./context/DarkModeContext.tsx";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <html lang="en">
      {/*  폰트 로드 (핵심) */}
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/latin-modern-web@1.1.0/fonts.css"
          rel="stylesheet"
        />
      </head>

      {/*  전역 폰트 적용 */}
      <body className="font-lm m-0">
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
                  url('/images/lee-su-yeon-header.jpg')
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                color: "var(--fg-color)",
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
                <ClickableImageBox imageSrc="/images/manim.png" href="/category/art" />
                <ClickableImageBox imageSrc="/images/painting.png" href="/category/code" />
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
              <SidebarWrapper />
              <main
                style={{
                  flex: 1,
                  background: "transparent",
                  padding: "24px",
                  overflow: "auto",
                  color: "var(--fg-color)",
                }}
              >
                {children}
              </main>
            </div>
          )}
        </DarkModeProvider>
      </body>
    </html>
  );
}