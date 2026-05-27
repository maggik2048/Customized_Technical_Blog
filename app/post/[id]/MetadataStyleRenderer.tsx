"use client";

import React from "react";

type MetadataItem = {
  name: string;
  slug: string;
};

type Props = {
  projects?: MetadataItem[];
  categories?: MetadataItem[];
  tags?: MetadataItem[];

  isDark: boolean;
};

function Pill({
  children,
  isDark,
  background,
}: {
  children: React.ReactNode;

  isDark: boolean;

  background?: string;
}) {
  return (
    <div
      style={{
        padding: "6px 12px",

        borderRadius: 999,

        fontSize: 13,

        fontWeight: 600,

        border: isDark
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(0,0,0,0.1)",

        background:
          background ||
          (isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.04)"),

        color: isDark
          ? "#f3f3f3"
          : "#111",

        backdropFilter:
          "blur(8px)",

        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

export default function MetadataStyleRenderer({
  projects = [],
  categories = [],
  tags = [],
  isDark,
}: Props) {
  /*
    empty guard
  */

  if (
    !projects.length &&
    !categories.length &&
    !tags.length
  ) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: 26,

        marginBottom: 40,

        padding: "24px 28px",

        borderRadius: 18,

        background: isDark
          ? "rgba(255,255,255,0.04)"
          : "rgba(0,0,0,0.03)",

        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(0,0,0,0.08)",

        backdropFilter:
          "blur(12px)",
      }}
    >
      {/* =========================
          PROJECTS
      ========================= */}

      {!!projects.length && (
        <div
          style={{
            marginBottom: 18,
          }}
        >
          <div
            style={{
              fontSize: 12,

              opacity: 0.6,

              fontWeight: 700,

              letterSpacing: 1.4,

              marginBottom: 10,

              textTransform:
                "uppercase",
            }}
          >
            Project
          </div>

          <div
            style={{
              display: "flex",

              flexWrap: "wrap",

              gap: 12,
            }}
          >
            {projects.map(
              (project) => (
                <div
                  key={
                    project.slug
                  }
                  style={{
                    fontSize: 24,

                    fontWeight: 800,

                    lineHeight: 1.1,

                    color: isDark
                      ? "#ffffff"
                      : "#111111",

                    letterSpacing:
                      -0.4,
                  }}
                >
                  {
                    project.name
                  }
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* =========================
          CATEGORIES
      ========================= */}

      {!!categories.length && (
        <div
          style={{
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontSize: 11,

              opacity: 0.55,

              fontWeight: 700,

              letterSpacing: 1.3,

              marginBottom: 8,

              textTransform:
                "uppercase",
            }}
          >
            Categories
          </div>

          <div
            style={{
              display: "flex",

              flexWrap: "wrap",

              gap: 8,
            }}
          >
            {categories.map(
              (category) => (
                <div
                  key={
                    category.slug
                  }
                  style={{
                    fontSize: 14,

                    fontWeight: 600,

                    opacity: 0.88,

                    color: isDark
                      ? "#d9d9d9"
                      : "#222",
                  }}
                >
                  {
                    category.name
                  }
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* =========================
          TAGS
      ========================= */}

      {!!tags.length && (
        <div>
          <div
            style={{
              fontSize: 11,

              opacity: 0.55,

              fontWeight: 700,

              letterSpacing: 1.3,

              marginBottom: 10,

              textTransform:
                "uppercase",
            }}
          >
            Tags
          </div>

          <div
            style={{
              display: "flex",

              flexWrap: "wrap",

              gap: 10,
            }}
          >
            {tags.map((tag) => (
              <Pill
                key={tag.slug}
                isDark={isDark}
                background={
                  isDark
                    ? "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(168,85,247,0.18))"
                    : "linear-gradient(135deg, rgba(99,102,241,0.14), rgba(168,85,247,0.10))"
                }
              >
                #{tag.name}
              </Pill>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}