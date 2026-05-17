"use client";

import "./globals.css";
import { usePathname } from "next/navigation";

import SidebarState from "./components/SidebarCategory/SidebarState";
import { DarkModeProvider } from "./context/DarkModeContext.tsx";
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
                    url('/images/artofcode.png')
                  `,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  overflow: "hidden",
                }}
              >
                {/* HOME MAIN */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 40px",
                  }}
                >
                  {children}
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  height: "100vh",
                }}
              >
                {/* CATEGORY SIDEBAR 유지 */}
                <SidebarState />

                {/* MAIN CONTENT */}
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