"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import SidebarContainer from "./components/SidebarContainer";
import ClickableImageBox from "./components/ClickableImageBox";

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
              color: "white",
              overflow: "hidden",
            }}
          >
            {/* 🔥 LEFT OVERLAY BAR */}
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
                zIndex: 2,
              }}
            >
              {/* ✅ WORKING IMAGE BOXES */}
              <ClickableImageBox
                imageSrc="/images/manim.png"
                href="/category/art"
              />

              <ClickableImageBox
                imageSrc="/images/painting.png" // ✅ FIXED
                href="/category/code"
              />
            </div>

            {/* 🔥 MAIN CONTENT */}
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
          <div style={{ display: "flex", height: "100vh" }}>
            <SidebarContainer />

            <main
              style={{
                flex: 1,
                background: "#f3f4f6",
                padding: "24px",
                overflow: "auto",
                color: "#111",
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