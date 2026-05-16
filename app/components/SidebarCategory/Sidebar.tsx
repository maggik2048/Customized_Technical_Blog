"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { CATEGORY_TREE } from "./CategoryTree";
import Book from "./SidebarBook";
import SidebarOpenCloseToggle from "./SidebarOpenCloseToggle";

export default function Sidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const shelfData = useMemo(() => CATEGORY_TREE, []);

  return (
    <>
      <aside
        className="sidebar"
        style={{
          position: "relative",
          width: 390,
          height: "100vh",
          overflowY: "auto",

          background:
            "linear-gradient(rgba(10,10,10,0.46), rgba(10,10,10,0.72)), url('/images/covers/bg.jpg') center / cover no-repeat",

          padding: "40px 22px",

          WebkitMaskImage:
            "linear-gradient(to right, black 0%, black 78%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, black 0%, black 78%, transparent 100%)",
        }}
      >
        {/* SVG DEFINITIONS (tri pattern) */}
        <svg width="0" height="0">
          <defs>
            <pattern
              id="sidebarTriPattern"
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 14 L7 0 L14 14 Z"
                fill="white"
                opacity="0.08"
              />
            </pattern>

            <mask id="sidebarTriMask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x="260"
                width="140"
                height="100%"
                fill="url(#sidebarTriPattern)"
              />
            </mask>
          </defs>
        </svg>

        {/* CONTENT */}
        <div style={{ position: "relative", zIndex: 2 }}>
          {shelfData.map((section, sectionIdx) => (
            <div key={section.slug} style={{ marginBottom: 58 }}>
              <div
                style={{
                  fontSize: 26,
                  color: "rgba(219,205,180,0.88)",
                  marginBottom: 18,
                  textShadow: "0 1px 8px rgba(0,0,0,0.45)",
                }}
              >
                {section.name}
              </div>

              <div>
                {section.children?.map((child, idx) => (
                  <Book
                    key={child.slug}
                    item={child}
                    index={idx + sectionIdx * 10}
                    pathname={pathname}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* EDGE SCI-FI LAYER */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 160,
            height: "100%",

            pointerEvents: "none",

            background: `
              linear-gradient(to left,
                rgba(10,10,10,0.9),
                rgba(10,10,10,0.4),
                rgba(10,10,10,0)
              ),
              repeating-linear-gradient(
                135deg,
                rgba(220,190,120,0.12) 0px,
                rgba(220,190,120,0.12) 1px,
                transparent 1px,
                transparent 10px
              )
            `,

            opacity: 0.9,

            maskImage: "url(#sidebarTriMask)",
            WebkitMaskImage: "url(#sidebarTriMask)",

            mixBlendMode: "overlay",
          }}
        />
      </aside>

      {/* 🔥 TOGGLE BUTTON (IMPORT + RIGHT CENTER) */}
      <SidebarOpenCloseToggle open={open} setOpen={setOpen} />
    </>
  );
}