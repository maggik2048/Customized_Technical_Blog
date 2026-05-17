"use client";

import Link from "next/link";

type Props = {
  href?: string;
  text?: string;
  borderColor?: string;
};

export default function WritePostButton({
  href = "/admin/write",
  text = "Write New Post",
  borderColor = "#000",
}: Props) {
  return (
    <Link href={href}>
      <button
        style={{
          padding: "18px 42px",
          backgroundColor: "transparent",
          color: "#000",
          fontWeight: 500,
          borderRadius: 2,
          cursor: "pointer",
          fontSize: 18,
          border: `1px solid ${borderColor}`,
          letterSpacing: "1.5px",
          fontFamily:
            `"Bodoni Moda", "Didot", "Times New Roman", serif`,
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#000";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#000";
        }}
      >
        {text}
      </button>
    </Link>
  );
}