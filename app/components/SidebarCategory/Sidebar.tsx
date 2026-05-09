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

const BOOK_HEIGHTS = [42, 48, 54, 60];
const BOOK_WIDTHS = [180, 210, 240, 270];

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

          borderRadius: "6px",
          marginBottom: "10px",

          display: "flex",
          alignItems: "center",

          paddingLeft: "18px",
          paddingRight: "16px",

          position: "relative",
          cursor: "pointer",

          borderLeft: active
            ? "8px solid gold"
            : "4px solid rgba(255,255,255,0.12)",

          boxShadow: active
            ? "0 0 18px rgba(255,215,0,0.45)"
            : `
                inset 0 2px 4px rgba(255,255,255,0.08),
                inset 0 -4px 8px rgba(0,0,0,0.25),
                0 4px 10px rgba(0,0,0,0.35)
              `,

          transform: `rotate(${(index % 5) - 2}deg)`,

          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `
            translateX(8px)
            scale(1.02)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `rotate(${
            (index % 5) - 2
          }deg)`;
        }}
      >
        {/* 책 위 highlight */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            height: "5px",
            background: "rgba(255,255,255,0.10)",
            borderRadius: "6px 6px 0 0",
          }}
        />

        {/* 책 제목 */}
        <span
          style={{
            color: "#f5f1e8",
            fontFamily: font,
            fontSize: "15px",
            letterSpacing: "0.4px",
            lineHeight: 1.1,
            userSelect: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",

            textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
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
            marginBottom: "46px",
          }}
        >
          {/* 대분류 */}
          <div
            style={{
              marginBottom: "18px",
              paddingLeft: "4px",

              color: "#d7c2a3",

              fontSize: "20px",

              fontFamily: `"Cormorant Garamond", serif`,

              letterSpacing: "1px",

              textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
            }}
          >
            {section.name}
          </div>

          {/* 책 더미 */}
          <div
            style={{
              position: "relative",

              padding: "12px",

              borderRadius: "10px",

              background: "rgba(255,255,255,0.02)",

              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.04),
                0 4px 20px rgba(0,0,0,0.2)
              `,
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

            {/* 바닥 나무 */}
            <div
              style={{
                marginTop: "12px",

                height: "12px",

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
          </div>
        </div>
      ))}
    </aside>
  );
}