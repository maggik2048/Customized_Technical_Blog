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
      <img
        src={headerImage}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          transform: "scale(1.02)",
        }}
      />

      {/* OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
        }}
      />

      {/* ADMIN ACTIONS (🔥 FIX 핵심) */}
      <div style={{ position: "absolute", top: 16, right: 40 }}>
        <PostAdminActions
          postId={data.id}
          category={data.category}   // 🔥 여기 추가
        />
      </div>

      {/* INDEX */}
      <PDFPageIndexPanel
        globalIndex={globalIndex}
        localIndex={localIndex}
        localTotal={localTotal}
        category={data?.category}
      />

      {/* TITLE */}
      <div
        style={{
          position: "absolute",
          bottom: 38,
          left: 48,
          right: 48,
          color: "#fff",
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