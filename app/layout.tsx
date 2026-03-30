"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";

import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <html lang="en">
      <body className={orbitron.className} style={{ margin: 0 }}>
        {isHome ? (
          // 🔥 HOME (강제 블랙)
          <div
            style={{
              width: "100vw",
              height: "100vh",
              backgroundImage: "url('/images/lee-su-yeon-header.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {children}
          </div>
        ) : (
          // 🔥 DOCS
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