"use client";

import Link from "next/link";

type Props = {
  href?: string;
  text?: string;
  backgroundColor?: string;
};

export default function WritePostButton({
  href = "/admin/write",
  text = "Write New Post",
  backgroundColor = "#1e40af",
}: Props) {
  return (
    <Link href={href}>
      <button
        style={{
          padding: "12px 24px",
          backgroundColor,
          color: "#fff",
          fontWeight: "bold",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 16,
          border: "none",
        }}
      >
        {text}
      </button>
    </Link>
  );
}