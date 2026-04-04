"use client";

import Image from "next/image";
import Link from "next/link";

type ClickableImageBoxProps = {
  imageSrc: string;
  href: string;
  alt?: string;
  width?: number;
  height?: number;
};

export default function ClickableImageBox({
  imageSrc,
  href,
  alt = "image",
  width = 300,
  height = 200,
}: ClickableImageBoxProps) {
  return (
    <Link href={href}>
      <div
        style={{
          position: "relative",
          width: width,
          height: height,
          overflow: "hidden",
          borderRadius: "12px",
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
        }}
      >
        <Image
          src={imageSrc}
          alt={alt}
          fill
          style={{
            objectFit: "cover",
          }}
        />

        {/* Optional dark overlay on hover */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.15)",
          }}
        />
      </div>
    </Link>
  );
}