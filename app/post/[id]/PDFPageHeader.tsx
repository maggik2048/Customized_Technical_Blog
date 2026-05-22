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
  const headerOverlayStyle = React.useMemo(
    () => ({
      position: "absolute" as const,
      inset: 0,
      background: isDark
        ? `
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.38) 22%,
            rgba(0,0,0,0.08) 48%,
            rgba(20,20,20,0.22) 68%,
            rgba(30,30,30,0.82) 100%
          )
        `
        : `
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.58) 0%,
            rgba(0,0,0,0.18) 24%,
            rgba(255,255,255,0) 68%,
            rgba(255,255,255,0.78) 95%,
            rgba(255,255,255,1) 100%
          )
        `,
    }),
    [isDark]
  );

  const headerWrapperStyle = React.useMemo(
    () => ({
      position: "absolute" as const,
      top: 0,
      left: 0,
      width: "100%",
      height: headerHeight,
      overflow: "hidden" as const,
    }),
    [headerHeight]
  );

  const titleContainerStyle = React.useMemo(
    () => ({
      position: "absolute" as const,
      bottom: 38,
      left: 48,
      right: 48,
      color: "#fff",
    }),
    []
  );

  return (
    <div style={headerWrapperStyle}>
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

      <div style={headerOverlayStyle} />

      {/* ADMIN */}
      <div style={{ position: "absolute", top: 16, right: 40 }}>
        <PostAdminActions postId={data.id} />
      </div>

      {/* INDEX */}
      <PDFPageIndexPanel
        globalIndex={globalIndex}
        localIndex={localIndex}
        localTotal={localTotal}
        category={data?.category}
      />

      {/* TITLE */}
      <div style={titleContainerStyle}>
        <HeadertitleAdjustment title={data.title}>
          {(style) => (
            <h1
              className={cormorant.className}
              style={style}
            >
              {data.title}
            </h1>
          )}
        </HeadertitleAdjustment>
      </div>
    </div>
  );
}