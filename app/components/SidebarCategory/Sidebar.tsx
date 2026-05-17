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
    <>
      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        {menu.map((section, sectionIdx) => (
          <div
            key={section.slug}
            style={{
              marginBottom: 58,
            }}
          >
            {/* SECTION TITLE */}
            <div
              style={{
                fontSize: 26,
                color: "rgba(219,205,180,0.88)",
                marginBottom: 18,
                textShadow:
                  "0 1px 8px rgba(0,0,0,0.45)",
              }}
            >
              {section.name}
            </div>

            {/* BOOKS */}
            <div>
              {section.children?.map(
                (child, idx) => (
                  <Book
                    key={child.slug}
                    item={child}
                    index={
                      idx + sectionIdx * 10
                    }
                    pathname={pathname}
                  />
                )
              )}
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

          mixBlendMode: "overlay",
        }}
      />
    </>
  );
}