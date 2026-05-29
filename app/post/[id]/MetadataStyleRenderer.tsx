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
              gap: 12,
            }}
          >
            {tags.map((tag) => (
              <div
                key={tag.slug}
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isDark
                    ? "#cfcfcf"
                    : "#333",
                  opacity: 0.9,
                }}
              >
                #{tag.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}