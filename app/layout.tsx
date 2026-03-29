"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        {isHome ? (
          // 🔥 HOME (강제 블랙)
          <div
            style={{
              width: "100vw",
              height: "100vh",
              background: "black",
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