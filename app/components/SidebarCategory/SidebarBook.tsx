// SidebarBook.tsx

"use client";

import Image from "next/image";



import {
  onBookEnter,
  onBookLeave,
  getDefaultTransform,
  getDefaultShadow,
} from "./SidebarBookMotion";

import { SIDEBAR_BOOK_THEME_MAP } from "./sidebarTheme";

import {
  SIDEBAR_IMAGE_FILTER,
  SIDEBAR_EDITORIAL_OVERLAY,
} from "./sidebarFilters";

/* =========================
   FONT MAP - Now using CSS classes
========================= */

// ❌ REMOVED all font configurations:
// const cinzel = Cinzel({...});
// const cormorant = Cormorant_Garamond({...});
// const playfair = Playfair_Display({...});
// etc.

// ✅ CHANGED: FONT_MAP now maps to CSS class names
const FONT_MAP: Record<string, string> = {
  cinzel: "font-cinzel",
  cormorant: "font-cormorant-garamond",
  playfair: "font-playfair",
  baskervville: "font-baskervville",
  ebgaramond: "font-eb-garamond",
  dmserif: "font-dm-serif",
  alegreya: "font-alegreya",
  marcellus: "font-marcellus",
  prata: "font-prata",
  librebaskerville: "font-libre-baskerville",
  unbounded: "font-unbounded",
  orbitron: "font-orbitron",
};

/* =========================
   TYPES
========================= */

type BookItem = {
  name: string;
  slug: string;
};

/* =========================
   COMPONENT
========================= */

export default function Book({
  item,
  index,
  pathname,
}: {
  item: BookItem;
  index: number;
  pathname: string;
}) {
  const theme =
    SIDEBAR_BOOK_THEME_MAP[item.slug] ??
    SIDEBAR_BOOK_THEME_MAP["physics_revisited"];

  const {
    color,
    mark,
    height,
    width,
    fontWeight,
    font,
    image,
    authorOverride,

    onlyShowImage,
    imageOpacity,
    vignetteOpacity,
  } = theme;

  const active = pathname.includes(item.slug);

  const isLight =
    color === "#F1ECE4" ||
    color === "#DDD6CC";

  // ✅ CHANGED: Now gets CSS class name instead of font object
  const fontClass = FONT_MAP[font ?? "cormorant"];

  /**
   * 이미지 존재 여부
   */
  const hasImage =
    typeof image === "string" &&
    image.trim().length > 0;

  return (
    <a
      href={`/category/${item.slug}`}
      style={{
        textDecoration: "none",
      }}
    >
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

          transform:
            getDefaultTransform(index),

          transition: "all 0.28s ease",
        }}
        onMouseEnter={onBookEnter}
        onMouseLeave={(e) =>
          onBookLeave(
            e,
            index,
            active
          )
        }
      >
        {/* IMAGE */}
        {hasImage && (
          <>
            <Image
              src={image}
              alt={item.name}
              fill
              style={{
                objectFit: "cover",

                opacity:
                  imageOpacity ?? 0.6,

                /**
                 * luxury editorial grading
                 */
                filter:
                  SIDEBAR_IMAGE_FILTER,
              }}
            />

            {/* EDITORIAL OVERLAY */}
            <div
              style={{
                position: "absolute",
                inset: 0,

                background: `
                  linear-gradient(
                    180deg,
                    rgba(
                      0,
                      0,
                      0,
                      ${
                        (vignetteOpacity ??
                          0.08) * 0.4
                      }
                    ),
                    rgba(
                      0,
                      0,
                      0,
                      ${
                        vignetteOpacity ??
                        0.08
                      }
                    )
                  ),
                  ${SIDEBAR_EDITORIAL_OVERLAY}
                `,

                mixBlendMode:
                  "multiply",
              }}
            />
          </>
        )}

        {/* GOLD LINE */}
        {!onlyShowImage && (
          <div
            style={{
              position: "absolute",

              left: 15,
              top: 9,
              bottom: 9,

              width: 1,

              background:
                "rgba(201,168,97,0.65)",
            }}
          />
        )}

        {/* MARK */}
        {!onlyShowImage && (
          <div
            style={{
              position: "absolute",

              left: 20,
              top: "50%",

              transform:
                "translateY(-50%)",

              fontSize: 11,

              color:
                "rgba(220,190,120,0.8)",
            }}
          >
            {mark}
          </div>
        )}

        {/* AUTHOR */}
        {!onlyShowImage && (
          <div
            // ✅ CHANGED: from className={cormorant.className} to className="font-cormorant-garamond"
            className="font-cormorant-garamond"
            style={{
              position: "absolute",

              right: 8,
              top: 8,
              bottom: 8,

              writingMode:
                "vertical-rl",

              fontSize: 10,
              letterSpacing: 1.2,

              color: isLight
                ? "rgba(60,52,42,0.55)"
                : "rgba(245,239,228,0.32)",

              textTransform:
                "uppercase",
            }}
          >
            {authorOverride}
          </div>
        )}

        {/* TITLE */}
        {!onlyShowImage && (
          <span
            // ✅ CHANGED: from className={fontObject.className} to className={fontClass}
            className={fontClass}
            style={{
              position: "relative",
              zIndex: 3,

              color: isLight
                ? "#2B2622"
                : "#F5EFE4",

              fontSize: 24,

              fontWeight,

              letterSpacing:
                font ===
                  "orbitron" ||
                font ===
                  "unbounded"
                  ? "0.04em"
                  : "0.01em",

              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow:
                "ellipsis",

              textShadow: active
                ? "0 0 12px rgba(255,255,255,0.08)"
                : "none",
            }}
          >
            {item.name}
          </span>
        )}

        {/* SUB */}
        {!onlyShowImage && (
          <div
            style={{
              marginTop: 6,

              fontSize: 13,

              letterSpacing:
                "0.04em",

              color: isLight
                ? "rgba(45,38,34,0.62)"
                : "rgba(245,239,228,0.52)",
            }}
          >
            {authorOverride}
          </div>
        )}

        {/* EDGE LIGHT */}
        <div
          style={{
            position: "absolute",
            inset: 0,

            borderRadius: 6,

            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)",

            pointerEvents: "none",
          }}
        />
      </div>
    </a>
  );
}