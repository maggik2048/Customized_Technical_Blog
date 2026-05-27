"use client";

import React from "react";

import { PROJECT_TREE } from "@/app/components/SidebarCategory/Data/ProjectTree";

import { TAG_TREE } from "@/app/components/SidebarCategory/Data/TagTree";

import { CATEGORY_TREE } from "@/app/components/SidebarCategory/Data/CategoryTree";

type MetadataItem = {
  name: string;

  slug: string;
};

type Props = {
  title: string;

  items?: MetadataItem[];

  isDark: boolean;
};

function MetadataSection({
  title,
  items = [],
  isDark,
}: Props) {
  if (!items.length) return null;

  return (
    <div
      style={{
        marginBottom: 18,
      }}
    >
      <div
        style={{
          fontSize: 12,

          fontWeight: 700,

          letterSpacing: 1.2,

          opacity: 0.72,

          marginBottom: 8,

          textTransform:
            "uppercase",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",

          flexWrap: "wrap",

          gap: 8,
        }}
      >
        {items.map((item) => (
          <div
            key={item.slug}
            style={{
              padding:
                "6px 12px",

              borderRadius: 999,

              fontSize: 13,

              fontWeight: 600,

              border: isDark
                ? "1px solid rgba(255,255,255,0.14)"
                : "1px solid rgba(0,0,0,0.12)",

              background: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)",

              color: isDark
                ? "#f1f1f1"
                : "#111",

              backdropFilter:
                "blur(8px)",
            }}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

type MetadataRendererProps = {
  data: any;

  isDark: boolean;
};

export default function MetadataRenderer({
  data,
  isDark,
}: MetadataRendererProps) {
  /*
    flatten categories
  */

  const ALL_CATEGORIES =
    CATEGORY_TREE.flatMap(
      (parent) =>
        parent.children || []
    );

  /*
    helper
  */

  const resolveItems = (
    slugs: string[] = [],
    source: MetadataItem[]
  ) => {
    return slugs
      .map((slug) =>
        source.find(
          (item) =>
            item.slug === slug
        )
      )
      .filter(Boolean) as MetadataItem[];
  };

  /*
    resolve metadata
  */

  const projects =
    resolveItems(
      data?.project_slugs || [],
      PROJECT_TREE
    );

  const categories =
    resolveItems(
      data?.category_slugs || [],
      ALL_CATEGORIES
    );

  const tags = resolveItems(
    data?.tag_slugs || [],
    TAG_TREE
  );

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
        marginTop: 22,

        marginBottom: 36,

        padding:
          "20px 24px",

        borderRadius: 14,

        background: isDark
          ? "rgba(255,255,255,0.04)"
          : "rgba(0,0,0,0.03)",

        border: isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <MetadataSection
        title="Projects"
        items={projects}
        isDark={isDark}
      />

      <MetadataSection
        title="Categories"
        items={categories}
        isDark={isDark}
      />

      <MetadataSection
        title="Tags"
        items={tags}
        isDark={isDark}
      />
    </div>
  );
}