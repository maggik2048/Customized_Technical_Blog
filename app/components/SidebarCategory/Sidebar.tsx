"use client";

import { useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Cormorant_SC } from "next/font/google";

import { CATEGORY_TREE } from "./CategoryTree";

import {
  onBookEnter,
  onBookLeave,
  getDefaultTransform,
  getDefaultShadow,
} from "./SidebarBookMotion";

/* =========================
   FONT SYSTEM
========================= */

const cormorant400 = Cormorant_SC({ subsets: ["latin"], weight: ["400"] });
const cormorant500 = Cormorant_SC({ subsets: ["latin"], weight: ["500"] });
const cormorant600 = Cormorant_SC({ subsets: ["latin"], weight: ["600"] });
const cormorant700 = Cormorant_SC({ subsets: ["latin"], weight: ["700"] });

/* =========================
   TYPES
========================= */

type BookItem = {
  name: string;
  slug: string;
};

/* =========================
   AUTHOR (원래 유지)
========================= */

const AUTHOR_POOL = [
  "Harold Bloom",
  "Susan Sontag",
  "Michel Foucault",
  "Edward Said",
  "Donna Haraway",
  "Noam Chomsky",
  "Judith Butler",
  "Roland Barthes",
  "Slavoj Žižek",
  "Thomas Kuhn",
  "Virginia Woolf",
  "Jacques Derrida",
  "Joseph Campbell",
  "Toni Morrison",
  "Umberto Eco",
  "John Rawls",
  "Simone Weil",
  "Walter Benjamin",
  "Carl Jung",
  "Marshall McLuhan",
];

function getAuthor(index: number) {
  return AUTHOR_POOL[index % AUTHOR_POOL.length];
}

/* =========================
   BOOK COVERS
========================= */

const BOOK_IMAGES: Record<string, string> = {
  philosophy: "/covers/philosophy.jpg",
  literature: "/covers/literature.jpg",
  psychology: "/covers/psychology.jpg",
  history: "/covers/history.jpg",
};

/* =========================
   STYLE SYSTEM (복구 핵심)
========================= */

const BOOK_FONT_CLASSES = [
  cormorant400.className,
  cormorant500.className,
  cormorant600.className,
  cormorant700.className,
];

const BOOK_COLORS = [
  "#111111",
  "#191919",
  "#1E1A1A",
  "#20242B",
  "#1D2621",
  "#2A1F1F",
  "#2A2420",
  "#262626",
  "#F1ECE4",
  "#DDD6CC",
];

const BOOK_HEIGHTS = [72, 78, 84, 92];
const BOOK_WIDTHS = [230, 260, 290, 320];

const MARKS = ["✦", "✧", "❖", "✺", "✹", "✢"];

function randomFrom<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

/* =========================
   BOOK
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

  const author = getAuthor(index);
  const mark = randomFrom(MARKS, index + 8);

  const imageSrc = BOOK_IMAGES[item.slug];

  const isLightBook =
    color === "#F1ECE4" || color === "#DDD6CC";

  return (
    <a href={href} style={{ textDecoration: "none" }}>
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "relative",
          overflow: "hidden",
          borderRadius: "6px",
          marginBottom: "14px",

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",

          padding: "10px 34px",

          cursor: "pointer",

          background: imageSrc
            ? color
            : `
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
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `
                  linear-gradient(
                    180deg,
                    rgba(0,0,0,0.15),
                    rgba(0,0,0,0.45)
                  ),
                  ${color}
                `,
                mixBlendMode: "multiply",
                opacity: 0.92,
                zIndex: 1,
              }}
            />
          </>
        )}

        {/* TEXTURE */}
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
            zIndex: 2,
          }}
        />

        {/* GOLD LINE */}
        <div
          style={{
            position: "absolute",
            left: "15px",
            top: "9px",
            bottom: "9px",
            width: "1px",
            background: "rgba(201,168,97,0.65)",
            zIndex: 3,
          }}
        />

        {/* MARK (원래 골드톤 복구) */}
        <div
          style={{
            position: "absolute",
            left: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "11px",
            color: "rgba(220,190,120,0.8)",
            zIndex: 3,
          }}
        >
          {mark}
        </div>

        {/* AUTHOR (파랑 아님 → 원래 톤) */}
        <div
          className={cormorant500.className}
          style={{
            position: "absolute",
            right: "8px",
            top: "8px",
            bottom: "8px",
            writingMode: "vertical-rl",
            fontSize: "10px",
            letterSpacing: "1.2px",
            color: isLightBook
              ? "rgba(60,52,42,0.55)"
              : "rgba(245,239,228,0.32)",
            textTransform: "uppercase",
            zIndex: 3,
          }}
        >
          {author}
        </div>

        {/* TITLE */}
        <span
          className={fontClass}
          style={{
            position: "relative",
            zIndex: 4,
            color: isLightBook
              ? "#2B2622"
              : "rgba(245,239,228,0.94)",
            fontSize: "24px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </span>

        {/* SUB */}
        <span
          className={cormorant400.className}
          style={{
            marginTop: "6px",
            zIndex: 4,
            fontSize: "13px",
            color: isLightBook
              ? "rgba(45,38,34,0.62)"
              : "rgba(245,239,228,0.52)",
          }}
        >
          {author}
        </span>
      </div>
    </a>
  );
}

/* =========================
   SIDEBAR
========================= */

export default function Sidebar() {
  const pathname = usePathname();
  const shelfData = useMemo(() => CATEGORY_TREE, []);

  return (
    <aside
      style={{
        width: "390px",
        height: "100vh",
        overflowY: "auto",

        background: `
          linear-gradient(
            to right,
            #161311 0%,
            #1B1715 28%,
            #120F0E 100%
          )
        `,
      }}
    >
      {shelfData.map((section, sectionIdx) => (
        <div key={section.slug} style={{ marginBottom: "58px" }}>
          <div className={cormorant700.className}>
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
    </aside>
  );
}