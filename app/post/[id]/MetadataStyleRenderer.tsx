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

function TagPill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "6px 12px",

        borderRadius: 10,

        background:
          "rgba(0,0,0,0.42)",

        border:
          "1px solid rgba(255,255,255,0.10)",

        backdropFilter:
          "blur(10px)",

        fontSize: 12,

        fontWeight: 700,

        color: "#ffffff",

        letterSpacing: 0.2,

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
        width: "100%",
      }}
    >
      {/* =========================
          PROJECTS
      ========================= */}

      {!!projects.length && (
        <div
          style={{
            marginBottom: 4,
          }}
        >
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

                    lineHeight: 1.05,

                    color: isDark
                      ? "rgba(255,255,255,0.82)"
                      : "rgba(81, 81, 81, 0.72)",

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
        <div
          style={{
            marginTop: 18,

            display: "flex",

            justifyContent:
              "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",

              flexWrap: "wrap",

              justifyContent:
                "flex-end",

              gap: 10,

              maxWidth: 520,
            }}
          >
            {tags.map((tag) => (
              <TagPill
                key={tag.slug}
              >
                #{tag.name}
              </TagPill>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}