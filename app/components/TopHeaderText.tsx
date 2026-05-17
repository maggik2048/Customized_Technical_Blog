"use client";

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
        fontSize: "1rem",
        fontWeight: 600,
        color: "#3b2a1f", // 진갈색
      }}
    >
      {topNavItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          style={{
            cursor: "pointer",
            color: "#3b2a1f",
            transition: "color 0.25s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "#000000";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "#3b2a1f";
          }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}