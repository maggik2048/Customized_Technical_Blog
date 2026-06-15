"use client";

import React from "react";

import { PROJECT_TREE } from "@/app/-Data/ProjectTree";

import { TAG_TREE } from "@/app/-Data/TagTree";

import { CATEGORY_TREE } from "@/app/-Data/CategoryTree";

import MetadataStyleRenderer from "./MetadataStyleRenderer";

type MetadataItem = {
  name: string;

  slug: string;
};

type MetadataFetcherProps = {
  data: any;

  isDark: boolean;
};

export default function MetadataFetcher({
  data,
  isDark,
}: MetadataFetcherProps) {
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
    debug
  */

  console.log(
    "[METADATA FETCHER]",
    {
      title: data?.title,

      raw: {
        project_slugs:
          data?.project_slugs,

        category_slugs:
          data?.category_slugs,

        tag_slugs:
          data?.tag_slugs,
      },

      resolved: {
        projects,
        categories,
        tags,
      },
    }
  );

  /*
    empty guard
  */

  if (
    !projects.length &&
    !categories.length &&
    !tags.length
  ) {
    console.warn(
      "[METADATA FETCHER] EMPTY"
    );

    return null;
  }

  /*
    style renderer
  */

  return (
    <MetadataStyleRenderer
      projects={projects}
      categories={categories}
      tags={tags}
      isDark={isDark}
    />
  );
}