"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Cormorant_SC } from "next/font/google";

import { CATEGORY_TREE } from "./CategoryTree";

/* =========================
   🎨 FONT SYSTEM
========================= */

const cormorant400 = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400"],
});

const cormorant500 = Cormorant_SC({
  subsets: ["latin"],
  weight: ["500"],
});

const cormorant600 = Cormorant_SC({
  subsets: ["latin"],
  weight: ["600"],
});

const cormorant700 = Cormorant_SC({
  subsets: ["latin"],
  weight: ["700"],
});

/* =========================
   📚 TYPES
========================= */

type BookItem = {
  name: string;
  slug: string;
};

/* =========================
   🎨 DARK ACADEMIA PALETTE
========================= */

const BOOK_FONT_CLASSES = [
  cormorant400.className,
  cormorant500.className,
  cormorant600.className,
  cormorant700.className,
];

const BOOK_COLORS = [
  "#111111", // obsidian black
  "#191919", // charcoal
  "#1E1A1A", // graphite brown-black
  "#20242B", // dark desaturated blue
  "#1D2621", // dark forest
  "#2A1F1F", // dried wine
  "#2A2420", // aged walnut
  "#262626", // neutral dark gray
  "#F1ECE4", // antique ivory
  "#DDD6CC", // muted parchment
];

const BOOK_HEIGHTS = [42, 46, 52, 58];

const BOOK_WIDTHS = [190, 220, 250, 280];

function randomFrom<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

/* =========================
   📕 BOOK COMPONENT
========================= */

function Book({
  item,
  index,
  pathname,
}: {
  item: BookItem;
  index: number;
  pathname: string;
}) {
  const fontClass = randomFrom(BOOK_FONT_CLASSES, index);

  const color = randomFrom(BOOK_COLORS, index + 2);

  const height = randomFrom(BOOK_HEIGHTS, index + 3);

  const width = randomFrom(BOOK_WIDTHS, index + 5);

  const href = `/category/${item.slug}`;

  const active = pathname.includes(item.slug);

  const isLightBook =
    color === "#F1ECE4" || color === "#DDD6CC";

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

          position: "relative",

          overflow: "hidden",

          borderRadius: "4px",

          marginBottom: "10px",

          display: "flex",
          alignItems: "center",

          paddingLeft: "20px",
          paddingRight: "16px",

          cursor: "pointer",

          background: `
            linear-gradient(
              180deg,
              rgba(255,255,255,0.045) 0%,
              rgba(255,255,255,0.01) 14%,
              rgba(0,0,0,0.02) 100%
            ),
            ${color}
          `,

          border: active
            ? "1px solid rgba(201,168,97,0.65)"
            : isLightBook
            ? "1px solid rgba(120,110,90,0.16)"
            : "1px solid rgba(255,255,255,0.045)",

          boxShadow: active
            ? `
                0 0 24px rgba(173,140,71,0.16),
                inset 0 1px 0 rgba(255,255,255,0.06),
                inset 0 -1px 0 rgba(0,0,0,0.25)
              `
            : `
                inset 0 1px 0 rgba(255,255,255,0.025),
                inset 0 -1px 0 rgba(0,0,0,0.25),
                0 3px 10px rgba(0,0,0,0.22)
              `,

          transform: `rotate(${(index % 5) - 2}deg)`,

          transition: `
            transform 0.28s ease,
            box-shadow 0.28s ease,
            border 0.28s ease
          `,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `
            translateX(10px)
            scale(1.015)
          `;

          e.currentTarget.style.boxShadow = `
            0 12px 30px rgba(0,0,0,0.34),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = `rotate(${
            (index % 5) - 2
          }deg)`;

          e.currentTarget.style.boxShadow = active
            ? `
                0 0 24px rgba(173,140,71,0.16),
                inset 0 1px 0 rgba(255,255,255,0.06),
                inset 0 -1px 0 rgba(0,0,0,0.25)
              `
            : `
                inset 0 1px 0 rgba(255,255,255,0.025),
                inset 0 -1px 0 rgba(0,0,0,0.25),
                0 3px 10px rgba(0,0,0,0.22)
              `;
        }}
      >
        {/* subtle cloth/leather texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,

            opacity: 0.06,

            backgroundImage: `
              radial-gradient(
                rgba(255,255,255,0.55) 0.4px,
                transparent 0.8px
              )
            `,

            backgroundSize: "5px 5px",

            mixBlendMode: "overlay",

            pointerEvents: "none",
          }}
        />

        {/* thin emboss line */}
        <div
          style={{
            position: "absolute",

            left: "11px",
            top: "7px",
            bottom: "7px",

            width: "1px",

            background: isLightBook
              ? "rgba(70,60,40,0.22)"
              : "rgba(255,255,255,0.08)",

            boxShadow: isLightBook
              ? "1px 0 1px rgba(255,255,255,0.25)"
              : "1px 0 1px rgba(0,0,0,0.45)",
          }}
        />

        {/* gold accent line */}
        <div
          style={{
            position: "absolute",

            left: "15px",
            top: "9px",
            bottom: "9px",

            width: "1px",

            background: active
              ? "rgba(201,168,97,0.65)"
              : "rgba(201,168,97,0.16)",

            boxShadow: `
              0 0 2px rgba(201,168,97,0.22)
            `,
          }}
        />

        {/* title */}
        <span
          className={fontClass}
          style={{
            position: "relative",
            zIndex: 2,

            color: isLightBook
              ? "#2B2622"
              : "rgba(245,239,228,0.92)",

            fontSize: "18px",

            letterSpacing: "0.6px",

            lineHeight: 1.1,

            userSelect: "none",

            whiteSpace: "nowrap",

            overflow: "hidden",

            textOverflow: "ellipsis",

            textShadow: isLightBook
              ? `
                  0 1px 0 rgba(255,255,255,0.35)
                `
              : `
                  0 1px 1px rgba(0,0,0,0.65),
                  0 0 1px rgba(255,255,255,0.04)
                `,
          }}
        >
          {item.name}
        </span>
      </div>
    </a>
  );
}

/* =========================
   🪵 SIDEBAR
========================= */

export default function Sidebar() {
  const pathname = usePathname();

  const shelfData = useMemo(() => CATEGORY_TREE, []);

  return (
    <aside
      style={{
        width: "340px",

        height: "100vh",

        overflowY: "auto",

        padding: "32px 18px",

        background: `
          linear-gradient(
            to right,
            #161311 0%,
            #1B1715 28%,
            #120F0E 100%
          )
        `,

        boxShadow: `
          inset -18px 0 34px rgba(0,0,0,0.52),
          inset 0 0 120px rgba(0,0,0,0.22)
        `,
      }}
    >
      {shelfData.map((section, sectionIdx) => (
        <div
          key={section.slug}
          style={{
            marginBottom: "52px",
          }}
        >
          {/* section title */}
          <div
            className={cormorant700.className}
            style={{
              marginBottom: "18px",

              paddingLeft: "4px",

              color: "rgba(219,205,180,0.88)",

              fontSize: "24px",

              letterSpacing: "1.2px",

              textShadow: `
                0 1px 2px rgba(0,0,0,0.72)
              `,
            }}
          >
            {section.name}
          </div>

          {/* shelf */}
          <div
            style={{
              position: "relative",

              padding: "14px",

              borderRadius: "10px",

              background: `
                linear-gradient(
                  180deg,
                  rgba(255,255,255,0.015),
                  rgba(255,255,255,0.005)
                )
              `,

              border: "1px solid rgba(255,255,255,0.03)",

              boxShadow: `
                inset 0 1px 0 rgba(255,255,255,0.02),
                0 10px 30px rgba(0,0,0,0.22)
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

            {/* wooden base */}
            <div
              style={{
                marginTop: "14px",

                height: "10px",

                width: "100%",

                borderRadius: "2px",

                background: `
                  linear-gradient(
                    to bottom,
                    #3A2C25,
                    #241B17
                  )
                `,

                boxShadow: `
                  0 5px 14px rgba(0,0,0,0.42),
                  inset 0 1px 0 rgba(255,255,255,0.04)
                `,
              }}
            />
          </div>
        </div>
      ))}
    </aside>
  );
}