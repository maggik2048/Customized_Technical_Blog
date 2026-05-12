"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Cormorant_SC } from "next/font/google";

import {
  onBookEnter,
  onBookLeave,
  getDefaultTransform,
  getDefaultShadow,
} from "./SidebarBookMotion";

import {
  BOOK_COLORS,
  BOOK_MARKS,
  BOOK_HEIGHTS,
  BOOK_WIDTHS,
  AUTHOR_POOL,
  BOOK_IMAGES,
} from "./sidebarTheme";

/* =========================
   FONT
========================= */

const c400 = Cormorant_SC({ subsets: ["latin"], weight: ["400"] });
const c500 = Cormorant_SC({ subsets: ["latin"], weight: ["500"] });
const c600 = Cormorant_SC({ subsets: ["latin"], weight: ["600"] });
const c700 = Cormorant_SC({ subsets: ["latin"], weight: ["700"] });

type BookItem = {
  name: string;
  slug: string;
};

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

function getAuthor(i: number) {
  return AUTHOR_POOL[i % AUTHOR_POOL.length];
}

export default function Book({
  item,
  index,
  pathname,
}: {
  item: BookItem;
  index: number;
  pathname: string;
}) {
  const color = pick(BOOK_COLORS, index + 2);
  const mark = pick(BOOK_MARKS, index + 7);
  const height = pick(BOOK_HEIGHTS, index + 3);
  const width = pick(BOOK_WIDTHS, index + 5);

  const font = pick([c400, c500, c600, c700], index);

  const author = getAuthor(index);
  const imageSrc = BOOK_IMAGES[item.slug];

  const active = pathname.includes(item.slug);
  const isLight = color === "#F1ECE4" || color === "#DDD6CC";

  return (
    <a href={`/category/${item.slug}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          width,
          height,
          position: "relative",
          overflow: "hidden",
          borderRadius: 6,
          marginBottom: 14,
          padding: "10px 34px",
          cursor: "pointer",

          background: color,
          boxShadow: getDefaultShadow(active),
          transform: getDefaultTransform(index),
          transition: "all 0.28s ease",
        }}
        onMouseEnter={onBookEnter}
        onMouseLeave={(e) => onBookLeave(e, index, active)}
      >
        {/* IMAGE */}
        {imageSrc && (
          <>
            <Image
              src={imageSrc}
              alt={item.name}
              fill
              style={{
                objectFit: "cover",
                opacity: 0.38,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.45))",
                mixBlendMode: "multiply",
              }}
            />
          </>
        )}

        {/* GOLD LINE */}
        <div
          style={{
            position: "absolute",
            left: 15,
            top: 9,
            bottom: 9,
            width: 1,
            background: "rgba(201,168,97,0.65)",
          }}
        />

        {/* MARK */}
        <div
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 11,
            color: "rgba(220,190,120,0.8)",
          }}
        >
          {mark}
        </div>

        {/* AUTHOR */}
        <div
          className={c500.className}
          style={{
            position: "absolute",
            right: 8,
            top: 8,
            bottom: 8,
            writingMode: "vertical-rl",
            fontSize: 10,
            letterSpacing: 1.2,
            color: isLight
              ? "rgba(60,52,42,0.55)"
              : "rgba(245,239,228,0.32)",
            textTransform: "uppercase",
          }}
        >
          {author}
        </div>

        {/* TITLE */}
        <span
          className={font.className}
          style={{
            position: "relative",
            zIndex: 3,
            color: isLight ? "#2B2622" : "#F5EFE4",
            fontSize: 24,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </span>

        {/* SUB */}
        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            color: isLight
              ? "rgba(45,38,34,0.62)"
              : "rgba(245,239,228,0.52)",
          }}
        >
          {author}
        </div>
      </div>
    </a>
  );
}