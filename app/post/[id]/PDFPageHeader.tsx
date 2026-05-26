"use client";

import React from "react";
import { Cormorant_SC } from "next/font/google";

import PostAdminActions from "@/app/admin/PostAdminActions";
import PDFPageIndexPanel from "./PDFPageIndexPanel";
import HeadertitleAdjustment from "./HeadertitleAdjustment";

const cormorant = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Props = {
  data: any;
  isDark: boolean;
  headerImage: string;
  globalIndex?: number;
  localIndex?: number;
  localTotal?: number;
  headerHeight?: number;
};

export default function PDFPageHeader({
  data,
  isDark,
  headerImage,
  globalIndex,
  localIndex,
  localTotal,
  headerHeight = 560,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: headerHeight,
        overflow: "hidden",
      }}
    >
      {/* HEADER IMAGE */}
      <img
        src={headerImage}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          transform: "scale(1.02)",
        }}
      />

      {/* TOP DARK VIGNETTE */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.18) 16%, rgba(0,0,0,0.00) 34%)",
          zIndex: 1,
        }}
      />

      {/* BOTTOM BRIGHT VIGNETTE */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "42%",
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.55) 18%, rgba(255,255,255,0.18) 32%, rgba(255,255,255,0.00) 55%)",
          mixBlendMode: "screen",
          zIndex: 1,
        }}
      />

      {/* ADMIN ACTIONS */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 40,
          zIndex: 10,
        }}
      >
        <PostAdminActions
          postId={data.id}
          category={data.category}
        />
      </div>

      {/* INDEX PANEL */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <PDFPageIndexPanel
          globalIndex={globalIndex}
          localIndex={localIndex}
          localTotal={localTotal}
          category={data?.category}
        />
      </div>

      {/* TITLE */}
      <div
        style={{
          position: "absolute",
          bottom: 38,
          left: 48,
          right: 48,
          color: "#fff",
          zIndex: 10,
        }}
      >
        <HeadertitleAdjustment title={data.title}>
          {(style) => (
            <h1 className={cormorant.className} style={style}>
              {data.title}
            </h1>
          )}
        </HeadertitleAdjustment>
      </div>
    </div>
  );
}