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
      const { data, error } =
        await supabase
          .from("posts")
          .select(
            "id, created_at, category"
          )
          .order("created_at", {
            ascending: true,
          });

      if (error) {
        console.error(error);
        return;
      }

      if (!data) return;

      setAllPosts(data);

      // CATEGORY 종류 확인
      console.log(
        "CATEGORY TYPES:",
        [
          ...new Set(
            data.map(
              (p) => p.category
            )
          ),
        ]
      );

      const idx = data.findIndex(
        (p) => p.id === id
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

  // =========================
  // CATEGORY POSTS
  // =========================

  const categoryPosts = useMemo(() => {
    if (!currentCategory) return [];

    return allPosts.filter(
      (p) =>
        p.category === currentCategory
    );
  }, [allPosts, currentCategory]);

  // =========================
  // LOCAL INDEX
  // =========================

  const categoryIndex =
    useMemo(() => {
      if (!currentPost) return 0;

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

  // =========================
  // FETCH VISIBLE POSTS
  // =========================

  useEffect(() => {
    const loadVisible = async () => {
      const ids = windowPosts.map(
        (p) => p.id
      );

      if (!ids.length) return;

      const { data, error } =
        await supabase
          .from("posts")
          .select("*")
          .in("id", ids);

      if (error) {
        console.error(error);
        return;
      }

      if (!data) return;

      setCache((prev) => {
        const next = { ...prev };

        data.forEach((p) => {
          next[p.id] = p;
        });

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

      if (!full) return null;

      // 같은 category posts
      const sameCategoryPosts =
        allPosts.filter(
          (x) =>
            x.category ===
            full.category
        );

      // local index
      const localIndex =
        sameCategoryPosts.findIndex(
          (x) => x.id === full.id
        ) + 1;

      // category total
      const localTotal =
        sameCategoryPosts.length;

      // global index
      const globalIndex =
        allPosts.findIndex(
          (x) => x.id === full.id
        ) + 1;

      return {
        ...full,

        __globalIndex: globalIndex,

        __localIndex: localIndex,

        __localTotal: localTotal,
      };
    })
    .filter(Boolean);

  // =========================
  // DEBUG
  // =========================

  console.log(
    posts.map((p) => ({
      title: p.title,
      category: p.category,

      global: p.__globalIndex,

      local: p.__localIndex,

      total: p.__localTotal,
    }))
  );

  // =========================
  // LOADING
  // =========================

  if (!allPosts.length) {
    return (
      <div>
        Loading all posts...
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div>Loading posts...</div>
    );
  }

  // =========================
  // RENDER
  // =========================

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

            setIndex(realIndex);
          }}
        />
      </div>
    </PostEnvironment>
  );
}