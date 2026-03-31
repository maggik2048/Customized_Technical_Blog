// app/components/TopHeaderText.tsx
"use client"; // client component 필요

import Link from "next/link";
import React from "react";

const topNavItems = [
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
  { label: "Resume", href: "/resume" },
];

export default function TopHeaderText() {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        marginBottom: "2rem",
        fontSize: "0.85rem",
        fontWeight: 500,
        color: "rgba(255, 255, 255, 0.8)",
      }}
    >
      {topNavItems.map((item) => (
        <Link key={item.label} href={item.href} style={{ cursor: "pointer" }}>
          {item.label}
        </Link>
      ))}
    </div>
  );
}