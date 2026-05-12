"use client";

import { useMemo } from "react";
import Image from "next/image";
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
   ✍️ AUTHOR POOL
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
   🖼 OPTIONAL BOOK COVERS
========================= */

/*
  slug 기준으로 원하는 이미지 연결

  예시:
  philosophy: "/covers/philosophy.jpg"
*/

const BOOK_IMAGES: Record<string, string> = {
  philosophy: "/covers/philosophy.jpg",
  literature: "/covers/literature.jpg",
  psychology: "/covers/psychology.jpg",
  history: "/covers/history.jpg",
};

/* =========================
   🎨 PALETTE
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

function randomFrom<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

/* =========================
   ✨ MARKS
========================= */

const MARKS = ["✦", "✧", "❖", "✺", "✹", "✢"];

/* =========================
   📕 BOOK
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

          borderRadius: "6px",

          marginBottom: "14px",

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",

          paddingLeft: "34px",
          paddingRight: "34px",
          paddingTop: "10px",
          paddingBottom: "10px",

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
        {/* =========================
            COVER IMAGE
        ========================= */}

        {imageSrc && (
          <>
            <Image
              src={imageSrc}
              alt={item.name}
              fill
              sizes="320px"
              style={{
                objectFit: "cover",
                opacity: 0.38,
                zIndex: 0,
              }}
            />

            {/* color blend */}
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

        {/* texture */}
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

            zIndex: 2,
          }}
        />

        {/* emboss line */}
        <div
          style={{
            position: "absolute",

            left: "11px",
            top: "8px",
            bottom: "8px",

            width: "1px",

            background: isLightBook
              ? "rgba(70,60,40,0.22)"
              : "rgba(255,255,255,0.08)",

            boxShadow: isLightBook
              ? "1px 0 1px rgba(255,255,255,0.25)"
              : "1px 0 1px rgba(0,0,0,0.45)",

            zIndex: 3,
          }}
        />

        {/* gold line */}
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

            zIndex: 3,
          }}
        />

        {/* elegant mark */}
        <div
          style={{
            position: "absolute",

            left: "20px",
            top: "50%",

            transform: "translateY(-50%)",

            fontSize: "11px",

            color: active
              ? "rgba(220,190,120,0.9)"
              : "rgba(220,190,120,0.38)",

            textShadow: `
              0 0 4px rgba(201,168,97,0.2)
            `,

            zIndex: 3,
          }}
        >
          {mark}
        </div>

        {/* vertical author */}
        <div
          className={cormorant500.className}
          style={{
            position: "absolute",

            right: "8px",
            top: "8px",
            bottom: "8px",

            writingMode: "vertical-rl",

            textOrientation: "mixed",

            fontSize: "10px",

            letterSpacing: "1.2px",

            color: isLightBook
              ? "rgba(60,52,42,0.55)"
              : "rgba(245,239,228,0.32)",

            userSelect: "none",

            textTransform: "uppercase",

            zIndex: 3,
          }}
        >
          {author}
        </div>

        {/* title */}
        <span
          className={fontClass}
          style={{
            position: "relative",
            zIndex: 4,

            color: isLightBook
              ? "#2B2622"
              : "rgba(245,239,228,0.94)",

            fontSize: "24px",

            letterSpacing: "0.9px",

            lineHeight: 1,

            userSelect: "none",

            whiteSpace: "nowrap",

            overflow: "hidden",

            textOverflow: "ellipsis",

            textShadow: `
              0 2px 8px rgba(0,0,0,0.72)
            `,
          }}
        >
          {item.name}
        </span>

        {/* subtitle */}
        <span
          className={cormorant400.className}
          style={{
            marginTop: "6px",

            position: "relative",
            zIndex: 4,

            color: isLightBook
              ? "rgba(45,38,34,0.62)"
              : "rgba(245,239,228,0.52)",

            fontSize: "13px",

            letterSpacing: "1.3px",

            textTransform: "uppercase",

            whiteSpace: "nowrap",

            overflow: "hidden",

            textOverflow: "ellipsis",

            textShadow: `
              0 1px 6px rgba(0,0,0,0.55)
            `,
          }}
        >
          {author}
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
        width: "390px",

        height: "100vh",

        overflowY: "auto",

        padding: "40px 22px",

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
            marginBottom: "58px",
          }}
        >
          {/* section title */}
          <div
            className={cormorant700.className}
            style={{
              marginBottom: "20px",

              paddingLeft: "4px",

              color: "rgba(219,205,180,0.88)",

              fontSize: "28px",

              letterSpacing: "1.4px",

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

              padding: "16px",

              borderRadius: "12px",

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
                marginTop: "18px",

                height: "12px",

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