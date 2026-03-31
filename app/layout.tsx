"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <html lang="en">
      <body className={orbitron.className} style={{ margin: 0 }}>
        {isHome ? (
          // 🔥 HOME (Hero Section)
          <div
            style={{
              position: "relative",
              width: "100vw",
              height: "100vh",

              // ✅ 여기만 수정됨 (vignette 추가)
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
            {/* 🔳 LEFT VERTICAL OVERLAY BAR */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "180px",
                height: "100%",
                width: "630px",
                background: "rgba(0.5, 0.5, 0.5, 0.7)",
                backdropFilter: "blur(3px)",
              }}
            />

            {/* 🧠 CONTENT LAYER */}
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
          // 🔥 DOCS LAYOUT
          <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />

            <main
              style={{
                flex: 1,
                background: "#f3f4f6",
                padding: "24px",
                overflow: "auto",
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