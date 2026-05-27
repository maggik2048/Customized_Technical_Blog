"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

import StackedPostViewer from "@/app/components/papers/StackedPostViewer";
import PostEnvironment from "@/app/components/papers/PostEnvironment";

const WINDOW_SIZE = 2;

export default function PostPage() {
  const { id } = useParams() as {
    id: string;
  };

  const [allPosts, setAllPosts] =
    useState<any[]>([]);

  const [index, setIndex] =
    useState(0);

  const [cache, setCache] = useState<
    Record<string, any>
  >({});

  // =========================
  // LOAD ALL POSTS
  // =========================

  useEffect(() => {
    const load = async () => {
      console.log(
        "[LOAD_ALL_POSTS] START"
      );

      const { data, error } =
        await supabase
          .from("posts")
          .select("*")
          .order("created_at", {
            ascending: true,
          });

      /*
        DEBUG
      */

      console.log(
        "[LOAD_ALL_POSTS] RAW RESPONSE:",
        {
          data,
          error,
        }
      );

      if (error) {
        console.error(
          "[LOAD_ALL_POSTS] ERROR:",
          error
        );

        return;
      }

      if (!data) {
        console.warn(
          "[LOAD_ALL_POSTS] NO DATA"
        );

        return;
      }

      console.log(
        "[LOAD_ALL_POSTS] SUCCESS COUNT:",
        data.length
      );

      setAllPosts(data);

      /*
        CATEGORY TYPES
      */

      console.log(
        "[LOAD_ALL_POSTS] CATEGORY TYPES:",
        [
          ...new Set(
            data.map(
              (p) => p.category
            )
          ),
        ]
      );

      /*
        NEW METADATA DEBUG
      */

      console.log(
        "[LOAD_ALL_POSTS] METADATA SAMPLE:",
        data.slice(0, 3).map(
          (p) => ({
            title: p.title,

            category:
              p.category,

            category_slugs:
              p.category_slugs,

            project_slugs:
              p.project_slugs,

            tag_slugs:
              p.tag_slugs,
          })
        )
      );

      const idx = data.findIndex(
        (p) => p.id === id
      );

      console.log(
        "[LOAD_ALL_POSTS] TARGET INDEX:",
        idx
      );

      setIndex(idx >= 0 ? idx : 0);
    };

    load();
  }, [id]);

  // =========================
  // CURRENT POST
  // =========================

  const currentPost =
    allPosts[index];

  const currentCategory =
    currentPost?.category;

  console.log(
    "[CURRENT_POST]",
    currentPost
  );

  // =========================
  // CATEGORY POSTS
  // =========================

  const categoryPosts = useMemo(() => {
    if (!currentCategory) {
      console.warn(
        "[CATEGORY_POSTS] NO CURRENT CATEGORY"
      );

      return [];
    }

    const filtered =
      allPosts.filter(
        (p) =>
          p.category ===
          currentCategory
      );

    console.log(
      "[CATEGORY_POSTS] FILTERED:",
      {
        currentCategory,
        count: filtered.length,
      }
    );

    return filtered;
  }, [allPosts, currentCategory]);

  // =========================
  // LOCAL INDEX
  // =========================

  const categoryIndex =
    useMemo(() => {
      if (!currentPost)
        return 0;

      const idx =
        categoryPosts.findIndex(
          (p) =>
            p.id === currentPost.id
        );

      return idx >= 0 ? idx + 1 : 0;
    }, [categoryPosts, currentPost]);

  // =========================
  // GLOBAL INDEX
  // =========================

  const globalIndex = index + 1;

  // =========================
  // WINDOW POSTS
  // =========================

  const windowStart = Math.max(
    0,
    index - WINDOW_SIZE
  );

  const windowPosts = allPosts.slice(
    windowStart,
    index + WINDOW_SIZE + 1
  );

  console.log(
    "[WINDOW_POSTS]",
    windowPosts.map((p) => ({
      id: p.id,
      title: p.title,
    }))
  );

  // =========================
  // FETCH VISIBLE POSTS
  // =========================

  useEffect(() => {
    const loadVisible = async () => {
      const ids = windowPosts.map(
        (p) => p.id
      );

      console.log(
        "[LOAD_VISIBLE] IDS:",
        ids
      );

      if (!ids.length) {
        console.warn(
          "[LOAD_VISIBLE] EMPTY IDS"
        );

        return;
      }

      const { data, error } =
        await supabase
          .from("posts")
          .select("*")
          .in("id", ids);

      /*
        DEBUG
      */

      console.log(
        "[LOAD_VISIBLE] RESPONSE:",
        {
          data,
          error,
        }
      );

      if (error) {
        console.error(
          "[LOAD_VISIBLE] ERROR:",
          error
        );

        return;
      }

      if (!data) {
        console.warn(
          "[LOAD_VISIBLE] NO DATA"
        );

        return;
      }

      console.log(
        "[LOAD_VISIBLE] SUCCESS:",
        data.map((p) => ({
          id: p.id,
          title: p.title,
        }))
      );

      setCache((prev) => {
        const next = { ...prev };

        data.forEach((p) => {
          next[p.id] = p;
        });

        console.log(
          "[CACHE UPDATED]",
          Object.keys(next)
        );

        return next;
      });
    };

    loadVisible();
  }, [windowPosts]);

  // =========================
  // BUILD POSTS WITH INDEXES
  // =========================

  const posts = windowPosts
    .map((p) => {
      const full = cache[p.id];

      if (!full) {
        console.warn(
          "[POST BUILD] CACHE MISS:",
          p.id
        );

        return null;
      }

      /*
        SAME CATEGORY POSTS
      */

      const sameCategoryPosts =
        allPosts.filter(
          (x) =>
            x.category ===
            full.category
        );

      /*
        LOCAL INDEX
      */

      const localIndex =
        sameCategoryPosts.findIndex(
          (x) => x.id === full.id
        ) + 1;

      /*
        CATEGORY TOTAL
      */

      const localTotal =
        sameCategoryPosts.length;

      /*
        GLOBAL INDEX
      */

      const globalIndex =
        allPosts.findIndex(
          (x) => x.id === full.id
        ) + 1;

      console.log(
        "[POST BUILD SUCCESS]",
        {
          title: full.title,

          category:
            full.category,

          category_slugs:
            full.category_slugs,

          project_slugs:
            full.project_slugs,

          tag_slugs:
            full.tag_slugs,

          globalIndex,

          localIndex,

          localTotal,
        }
      );

      return {
        ...full,

        __globalIndex:
          globalIndex,

        __localIndex:
          localIndex,

        __localTotal:
          localTotal,
      };
    })
    .filter(Boolean);

  // =========================
  // FINAL DEBUG
  // =========================

  console.log(
    "[FINAL POSTS]",
    posts.map((p) => ({
      title: p.title,

      category: p.category,

      category_slugs:
        p.category_slugs,

      project_slugs:
        p.project_slugs,

      tag_slugs:
        p.tag_slugs,

      global:
        p.__globalIndex,

      local:
        p.__localIndex,

      total:
        p.__localTotal,
    }))
  );

  // =========================
  // LOADING
  // =========================

  if (!allPosts.length) {
    console.warn(
      "[RENDER] allPosts EMPTY"
    );

    return (
      <div>
        Loading all posts...
      </div>
    );
  }

  if (!posts.length) {
    console.warn(
      "[RENDER] posts EMPTY"
    );

    return (
      <div>Loading posts...</div>
    );
  }

  // =========================
  // RENDER
  // =========================

  console.log(
    "[RENDER] SUCCESS"
  );

  return (
    <PostEnvironment>
      <div
        style={{
          position: "relative",

          width: "100%",

          height: "100%",
        }}
      >
        {/* POSTS */}

        <StackedPostViewer
          posts={posts}
          index={Math.min(
            index - windowStart,
            posts.length - 1
          )}
          onChangeIndex={(
            i: number
          ) => {
            const realIndex =
              windowStart + i;

            console.log(
              "[INDEX CHANGE]",
              {
                local: i,
                real: realIndex,
              }
            );

            setIndex(realIndex);
          }}
        />
      </div>
    </PostEnvironment>
  );
}