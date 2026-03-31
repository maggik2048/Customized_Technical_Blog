"use client";

import { FaTwitter, FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";
import React from "react";
import Link from "next/link";

const socialLinks = [
  { icon: <FaTwitter />, href: "https://twitter.com" },
  { icon: <FaFacebookF />, href: "https://facebook.com" },
  { icon: <FaInstagram />, href: "https://instagram.com" },
  { icon: <FaEnvelope />, href: "mailto:hello@example.com" },
];

export default function SocialIcons() {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        fontSize: "1.1rem",
        color: "rgba(255, 255, 255, 0.8)",
      }}
    >
      {socialLinks.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            transition: "color 0.2s",
            cursor: "pointer",
          }}
          onMouseOver={(e) => ((e.currentTarget.style.color = "#fff"))}
          onMouseOut={(e) => ((e.currentTarget.style.color = "rgba(255,255,255,0.8)"))}
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
}