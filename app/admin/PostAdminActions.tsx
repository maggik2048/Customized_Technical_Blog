"use client";

import React from "react";

import { supabase } from "@/lib/supabase";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { Pencil, Trash2 } from "lucide-react";

import { Cormorant_SC } from "next/font/google";

const cormorant = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function PostAdminActions({
  postId,
}: {
  postId: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure that you want to delete this post?"
      )
    )
      return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      alert("Deletion Failed: " + error.message);

      return;
    }

    alert("Deletion Completed");

    router.push("/");
  };

  const buttonStyle: React.CSSProperties = {
    position: "relative",

    display: "flex",

    alignItems: "center",

    gap: 8,

    padding: "7px 13px",

    borderRadius: 999,

    border: "1px solid rgba(255,255,255,0.10)",

    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.005), rgba(255,255,255,0.002))",

    backdropFilter: "blur(14px)",

    WebkitBackdropFilter: "blur(14px)",

    color: "rgba(255,255,255,0.92)",

    cursor: "pointer",

    overflow: "hidden",

    transition: "all 0.24s ease",

    boxShadow: `
      0 8px 24px rgba(0,0,0,0.18),
      inset 0 1px 0 rgba(255,255,255,0.04)
    `,
  };

  const innerLineStyle: React.CSSProperties = {
    position: "absolute",

    inset: 3,

    borderRadius: 999,

    border: "1px solid rgba(255,255,255,0.05)",

    pointerEvents: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,

    letterSpacing: "0.16em",

    textTransform: "uppercase",

    fontWeight: 500,

    opacity: 0.84,

    position: "relative",

    top: 0.5,

    whiteSpace: "nowrap",
  };

  const iconWrapStyle: React.CSSProperties = {
    width: 18,

    height: 18,

    borderRadius: "50%",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    border: "1px solid rgba(255,255,255,0.24)",

    background:
      "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.015))",

    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.08),
      0 0 10px rgba(255,255,255,0.05)
    `,
  };

  return (
    <div
      style={{
        display: "flex",

        gap: 8,
      }}
    >
      {/* MODIFY */}
      <Link href={`/admin/edit/${postId}`}>
        <button
          className={cormorant.className}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-1px) scale(1.02)";

            e.currentTarget.style.border =
              "1px solid rgba(255,255,255,0.16)";

            e.currentTarget.style.background =
              "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02))";

            e.currentTarget.style.boxShadow = `
              0 12px 32px rgba(0,0,0,0.24),
              inset 0 1px 0 rgba(255,255,255,0.06)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0) scale(1)";

            e.currentTarget.style.border =
              "1px solid rgba(255,255,255,0.10)";

            e.currentTarget.style.background =
              "linear-gradient(to bottom, rgba(255,255,255,0.015), rgba(255,255,255,0.002))";

            e.currentTarget.style.boxShadow = `
              0 8px 24px rgba(0,0,0,0.18),
              inset 0 1px 0 rgba(255,255,255,0.04)
            `;
          }}
        >
          <div style={innerLineStyle} />

          <div style={iconWrapStyle}>
            <Pencil
              size={10}
              strokeWidth={1.9}
            />
          </div>

          <span style={labelStyle}>
            Modify Post
          </span>
        </button>
      </Link>

      {/* DELETE */}
      <button
        onClick={handleDelete}
        className={cormorant.className}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "translateY(-1px) scale(1.02)";

          e.currentTarget.style.border =
            "1px solid rgba(255,255,255,0.16)";

          e.currentTarget.style.background =
            "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02))";

          e.currentTarget.style.boxShadow = `
            0 12px 32px rgba(0,0,0,0.24),
            inset 0 1px 0 rgba(255,255,255,0.06)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "translateY(0) scale(1)";

          e.currentTarget.style.border =
            "1px solid rgba(255,255,255,0.10)";

          e.currentTarget.style.background =
            "linear-gradient(to bottom, rgba(255,255,255,0.055), rgba(255,255,255,0.012))";

          e.currentTarget.style.boxShadow = `
            0 8px 24px rgba(0,0,0,0.18),
            inset 0 1px 0 rgba(255,255,255,0.04)
          `;
        }}
      >
        <div style={innerLineStyle} />

        <div style={iconWrapStyle}>
          <Trash2
            size={10}
            strokeWidth={1.9}
          />
        </div>

        <span style={labelStyle}>
          Delete Post
        </span>
      </button>
    </div>
  );
}