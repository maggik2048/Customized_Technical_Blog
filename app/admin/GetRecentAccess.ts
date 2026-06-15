import { supabase } from "@/lib/supabase";

import { CATEGORY_TREE } from "@/app/-Data/CategoryTree";

import { PROJECT_TREE } from "@/app/-Data/ProjectTree";

import { TAG_TREE } from "@/app/-Data/TagTree";

type MetadataResult<T> = {
  items: T[];

  recentSlugs: string[];
};

export async function getRecentAccessMetadata() {
  const { data, error } =
    await supabase
      .from("posts")
      .select(`
        category_slugs,
        project_slugs,
        tag_slugs,
        updated_at
      `)
      .order("updated_at", {
        ascending: false,
      });

  /*
    fallback
  */

  if (error || !data) {
    console.error(error);

    return {
      categories:
        CATEGORY_TREE.flatMap(
          (parent) =>
            parent.children || []
        ),

      projects: PROJECT_TREE,

      tags: TAG_TREE,
    };
  }

  /*
    flatten metadata
  */

  const recentCategoryOrder =
    Array.from(
      new Set(
        data.flatMap(
          (post) =>
            post.category_slugs ||
            []
        )
      )
    );

  const recentProjectOrder =
    Array.from(
      new Set(
        data.flatMap(
          (post) =>
            post.project_slugs ||
            []
        )
      )
    );

  const recentTagOrder = Array.from(
    new Set(
      data.flatMap(
        (post) =>
          post.tag_slugs || []
      )
    )
  );

  /*
    priority map helper
  */

  const createPriorityMap = (
    slugs: string[]
  ) => {
    const map = new Map<
      string,
      number
    >();

    slugs.forEach(
      (slug, index) => {
        map.set(slug, index);
      }
    );

    return map;
  };

  const categoryPriorityMap =
    createPriorityMap(
      recentCategoryOrder
    );

  const projectPriorityMap =
    createPriorityMap(
      recentProjectOrder
    );

  const tagPriorityMap =
    createPriorityMap(
      recentTagOrder
    );

  /*
    flatten categories
  */

  const allCategories =
    CATEGORY_TREE.flatMap(
      (parent) =>
        parent.children || []
    );

  /*
    priority sorting helper
  */

  const prioritySort = <
    T extends {
      slug: string;
    },
  >(
    items: T[],
    priorityMap: Map<
      string,
      number
    >
  ) => {
    return [...items].sort(
      (a, b) => {
        const aPriority =
          priorityMap.get(
            a.slug
          ) ??
          Number.MAX_SAFE_INTEGER;

        const bPriority =
          priorityMap.get(
            b.slug
          ) ??
          Number.MAX_SAFE_INTEGER;

        return (
          aPriority -
          bPriority
        );
      }
    );
  };

  return {
    categories: prioritySort(
      allCategories,
      categoryPriorityMap
    ),

    projects: prioritySort(
      PROJECT_TREE,
      projectPriorityMap
    ),

    tags: prioritySort(
      TAG_TREE,
      tagPriorityMap
    ),
  };
}