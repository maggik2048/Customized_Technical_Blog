"use client";

import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
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
        gap: "1.5rem",
        fontSize: "1.7rem",
        color: "#3b2a1f", // 진갈색
      }}
    >
      {socialLinks.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            transition: "color 0.25s ease",
            cursor: "pointer",
            color: "#3b2a1f",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "#000000"; // 검정
            e.currentTarget.style.transform = "scale(1.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "#3b2a1f";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {item.icon}
        </Link>
      ))}
    </div>
  );
}