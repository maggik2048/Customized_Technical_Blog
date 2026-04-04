"use client";

import Link from "next/link";

type Props = {
  imageSrc: string;
  href: string;
  width?: number;
  height?: number;
};

export default function ClickableImageBox({
  imageSrc,
  href,
  width = 260,
  height = 160,
}: Props) {
  return (
    <Link href={href}>
      <div
        style={{
          width,
          height,
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      />
    </Link>
  );
}