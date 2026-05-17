"use client";

import { usePathname } from "next/navigation";
import Book from "./SidebarBook";
import { Item } from "./types";

export default function Sidebar({
  menu,
}: {
  menu: Item[];
}) {
  const pathname = usePathname();

  return (
    <div
      className="sidebar"
      style={{
        position: "relative",
        zIndex: 2,

        height: "100%",
        overflowY: "auto",

        scrollbarWidth: "none",
        msOverflowStyle: "none",

        // 핵심: 블렌딩 감각 살리기
        WebkitMaskImage:
          "linear-gradient(to right, black 85%, transparent 100%)",
      }}
    >
      {/* scrollbar hide */}
      <style jsx>{`
        .sidebar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* CONTENT */}
      <div>
        {menu.map((section, sectionIdx) => (
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

      {/* =======================================
          🌫 AIRBRUSH FADE SYSTEM (2 LAYERS)
      ======================================= */}

      {/* LAYER 1: soft light lift (밝아지는 느낌 핵심) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 180,
          height: "100%",
          pointerEvents: "none",

          background: `
            linear-gradient(
              to left,
              rgba(255,255,255,0.06) 0%,
              rgba(255,255,255,0.02) 35%,
              rgba(255,255,255,0.00) 70%
            )
          `,

          mixBlendMode: "screen",
          zIndex: 5,
        }}
      />

      {/* LAYER 2: depth falloff (공기처럼 사라지는 핵심) */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 200,
          height: "100%",
          pointerEvents: "none",

          background: `
            linear-gradient(
              to left,
              rgba(10,10,10,0.35) 0%,
              rgba(10,10,10,0.15) 40%,
              rgba(10,10,10,0.05) 70%,
              rgba(10,10,10,0.00) 100%
            )
          `,

          mixBlendMode: "multiply",
          zIndex: 4,
        }}
      />
    </div>
  );
}