// ClientLayout.tsx
"use client";

import { usePathname, useRouter } from "next/navigation"; // Add useRouter
import ClickableImageBox from "./ClickableImageBox";

export default function ClientLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter(); // Add this
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
        {/* 좌측 이미지 박스 */}
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
            onClick={() => router.push("/category/art")} // Use onClick instead of href
          />
          <ClickableImageBox
            imageSrc="/images/painting.png"
            onClick={() => router.push("/category/code")} // Use onClick instead of href
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