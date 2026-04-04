"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import SidebarContainer from "./components/SidebarContainer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {isHome ? (
          // 🔥 HOME HERO LAYOUT
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
                url('/images/lee-su-yeon-header-lighten3.jpg')
              `,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "white",
              overflow: "hidden",
            }}
          >
            {/* LEFT OVERLAY BAR with image */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "180px",
                height: "100%",
                width: "630px",
                background: `
                  linear-gradient(rgba(40,40,50,0.65), rgba(40,40,40,0.99)),
                  url('/images/dvinch6.jpg')
                `,
                backgroundSize: "150% auto",
                backgroundPosition: "center",
                backdropFilter: "blur(3px)",
              }}
            />

            {/* CONTENT LAYER */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
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
          // 🔥 NON-HOME LAYOUT (PostPage 등)
          <div style={{ display: "flex", height: "100vh" }}>
            <SidebarContainer />

            <main
              style={{
                flex: 1,
                background: "#f3f4f6",
                padding: "24px",
                overflow: "auto",
                color: "#111", // 🔹 전체 글자색 기본 지정
              }}
            >
              {children}
            </main>
          </div>
        )}
      </body>
    </html>
  );
}