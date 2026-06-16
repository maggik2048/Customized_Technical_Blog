// ClientLayout.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import ClickableImageBox from "./ClickableImageBox"; // Make sure this path is correct

export default function ClientLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  if (isHome) {
    return (
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
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "180px",
            height: "100%",
            width: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "28px",
          }}
        >
          <ClickableImageBox
            imageSrc="/images/manim.png"
            onClick={() => router.push("/category/art")}
          />
          <ClickableImageBox
            imageSrc="/images/painting.png"
            onClick={() => router.push("/category/code")}
          />
        </div>

        <div style={{ paddingLeft: "80px" }}>{children}</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {sidebar}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}