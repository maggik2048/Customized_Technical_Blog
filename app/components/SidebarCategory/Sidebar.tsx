"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { CATEGORY_TREE } from "./CategoryTree";

type BookItem = {
  name: string;
  slug: string;
};

const BOOK_FONTS = [
  `"Cormorant Garamond", serif`,
  `"Baskerville", serif`,
  `"Garamond", serif`,
  `"Times New Roman", serif`,
  `"Palatino Linotype", serif`,
  `"Book Antiqua", serif`,
];

const BOOK_COLORS = [
  "#5C4033",
  "#4A2F27",
  "#3B2F2F",
  "#2F3A56",
  "#4B5320",
  "#6B4226",
  "#3E2723",
  "#5D3A00",
];

const BOOK_HEIGHTS = [54, 60, 68, 74, 82];
const BOOK_WIDTHS = [42, 48, 54, 62];

function randomFrom<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

function Book({
  item,
  index,
  pathname,
}: {
  item: BookItem;
  index: number;
  pathname: string;
}) {
  const font = randomFrom(BOOK_FONTS, index);
  const color = randomFrom(BOOK_COLORS, index + 2);
  const height = randomFrom(BOOK_HEIGHTS, index + 3);
  const width = randomFrom(BOOK_WIDTHS, index + 5);

  const href = `/category/${item.slug}`;
  const active = pathname.includes(item.slug);

  return (
    <a
      href={href}
      style={{
        textDecoration: "none",
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: color,
          borderRadius: "4px 4px 2px 2px",
          marginRight: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          padding: "8px 4px",
          position: "relative",
          cursor: "pointer",

          borderLeft: active
            ? "6px solid gold"
            : "3px solid rgba(255,255,255,0.15)",

          boxShadow: active
            ? "0 0 14px rgba(255,215,0,0.5)"
            : `
                inset -4px 0 8px rgba(255,255,255,0.08),
                inset 4px 0 8px rgba(0,0,0,0.35),
                2px 3px 10px rgba(0,0,0,0.35)
              `,

          transform: `rotate(${(index % 5) - 2}deg)`,

          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `rotate(${
            (index % 5) - 2
          }deg)`;
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "6px",
            background: "rgba(255,255,255,0.12)",
          }}
        />

        <span
          style={{
            color: "#f5f1e8",
            fontFamily: font,
            fontSize: "13px",
            letterSpacing: "0.8px",
            textAlign: "center",
            lineHeight: 1.1,
            userSelect: "none",
          }}
        >
          {item.name}
        </span>
      </div>
    </a>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const shelfData = useMemo(() => CATEGORY_TREE, []);

  return (
    <aside
      style={{
        width: "340px",
        height: "100vh",
        overflowY: "auto",
        padding: "28px 18px",
        background: `
          linear-gradient(
            to right,
            #2d1f17 0%,
            #3a281d 30%,
            #241811 100%
          )
        `,
        boxShadow: "inset -12px 0 24px rgba(0,0,0,0.4)",
      }}
    >
      {shelfData.map((section, sectionIdx) => (
        <div
          key={section.slug}
          style={{
            marginBottom: "42px",
          }}
        >
          <div
            style={{
              marginBottom: "14px",
              paddingLeft: "6px",
              color: "#d7c2a3",
              fontSize: "18px",
              fontFamily: `"Cormorant Garamond", serif`,
              letterSpacing: "1px",
              textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {section.name}
          </div>

          <div
            style={{
              position: "relative",
              paddingBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                minHeight: "120px",
                paddingLeft: "8px",
              }}
            >
              {section.children?.map((child, idx) => (
                <Book
                  key={child.slug}
                  item={child}
                  index={idx + sectionIdx * 10}
                  pathname={pathname}
                />
              ))}
            </div>

            <div
              style={{
                height: "14px",
                width: "100%",
                background: `
                  linear-gradient(
                    to bottom,
                    #6d4c41,
                    #4e342e
                  )
                `,
                borderRadius: "2px",
                boxShadow: `
                  0 4px 10px rgba(0,0,0,0.45),
                  inset 0 2px 2px rgba(255,255,255,0.08)
                `,
              }}
            />

            <div
              style={{
                marginTop: "16px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>
        </div>
      ))}
    </aside>
  );
}