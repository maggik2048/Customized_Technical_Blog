"use client";

import React from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";


export default function PostAdminActions({
  postId,
  category,
}: {
  postId: string;
  category?: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure that you want to delete this post?"))
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
    border: "1px solid rgba(255,255,255,0.22)",
    background: "transparent",
    color: "rgba(255,255,255,0.92)",
    cursor: "pointer",
    overflow: "hidden",
    transition: "all 0.24s ease",
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)`,
    pointerEvents: "auto",
  };

  const innerLineStyle: React.CSSProperties = {
    position: "absolute",
    inset: 3,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.06)",
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
    border: "1px solid rgba(255,255,255,0.26)",
    background: "transparent",
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.06)`,
  };

  const hoverEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "translateY(-1px) scale(1.02)";
    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.38)";
    e.currentTarget.style.boxShadow = `
      inset 0 1px 0 rgba(255,255,255,0.06),
      0 0 18px rgba(255,255,255,0.04)
    `;
  };

  const leaveEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = "translateY(0) scale(1)";
    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.22)";
    e.currentTarget.style.boxShadow = `inset 0 1px 0 rgba(255,255,255,0.03)`;
  };

  return (
    <div 
      style={{ 
        display: "flex", 
        gap: 8,
        pointerEvents: "auto",
        position: "relative",
        zIndex: 9999,
      }}
    >
      {/* WRITE */}
      <Link 
        href={`/admin/write${category ? `?category=${category}` : ""}`}
        style={{ pointerEvents: "auto" }}
      >
        <button
          className="font-cormorant-sc"
          style={buttonStyle}
          onMouseEnter={hoverEffect}
          onMouseLeave={leaveEffect}
        >
          <div style={innerLineStyle} />
          <div style={iconWrapStyle}>
            <Plus size={10} strokeWidth={1.9} />
          </div>
          <span style={labelStyle}>Write Post</span>
        </button>
      </Link>

      {/* MODIFY */}
      <Link 
        href={`/admin/edit/${postId}`}
        style={{ pointerEvents: "auto" }}
      >
        <button
          className="font-cormorant-sc"
          style={buttonStyle}
          onMouseEnter={hoverEffect}
          onMouseLeave={leaveEffect}
        >
          <div style={innerLineStyle} />
          <div style={iconWrapStyle}>
            <Pencil size={10} strokeWidth={1.9} />
          </div>
          <span style={labelStyle}>Modify Post</span>
        </button>
      </Link>

      {/* DELETE */}
      <button
        onClick={handleDelete}
        className="font-cormorant-sc"
        style={buttonStyle}
        onMouseEnter={hoverEffect}
        onMouseLeave={leaveEffect}
      >
        <div style={innerLineStyle} />
        <div style={iconWrapStyle}>
          <Trash2 size={10} strokeWidth={1.9} />
        </div>
        <span style={labelStyle}>Delete Post</span>
      </button>
    </div>
  );
}