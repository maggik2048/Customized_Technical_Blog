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
              backgroundImage: "url('/images/lee-su-yeon-header-bright.jpg')",
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
                width: "630px", // adjust width here
                background: "rgba(0.5, 0.5, 0.5, 0.7)", // adjust opacity here
                backdropFilter: "blur(3px)", // osptional sci-fi glass effect
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
                paddingLeft: "80px", // pushes content into the bar
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