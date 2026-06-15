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

  /*
    visible post cache
  */

  const [cache, setCache] = useState<
    Record<string, any>
  >({});

  /*
    initial loading
  */

  const [isInitialLoading, setIsInitialLoading] =
    useState(true);

  // =========================
  // LOAD ALL POSTS
  // =========================

  useEffect(() => {
    const load = async () => {
      console.log(
        "[LOAD_ALL_POSTS] START"
      );

      setIsInitialLoading(true);

      const { data, error } =
        await supabase
          .from("posts")
          .select(`
            id,
            title,
            content,
            created_at,
            
            commit_url,

            category,
            category_slugs,
            project_slugs,
            tag_slugs
          `)
          .order("created_at", {
            ascending: true,
          });

      if (error) {
        console.error(
          "[LOAD_ALL_POSTS] ERROR:",
          error
        );

        setIsInitialLoading(false);

        return;
      }

      if (!data) {
        console.warn(
          "[LOAD_ALL_POSTS] NO DATA"
        );

        setIsInitialLoading(false);

        return;
      }

      console.log(
        "[LOAD_ALL_POSTS] SUCCESS:",
        {
          count: data.length,
        }
      );

      /*
        build fast cache immediately
      */

      const initialCache:
        Record<string, any> = {};

      data.forEach((post) => {
        initialCache[post.id] = post;
      });

      setCache(initialCache);

      setAllPosts(data);

      /*
        target index
      */

      const idx = data.findIndex(
        (p) => p.id === id
      );

      console.log(
        "[LOAD_ALL_POSTS] TARGET INDEX:",
        idx
      );

      setIndex(idx >= 0 ? idx : 0);

      /*
        metadata debug
      */

      console.log(
        "[LOAD_ALL_POSTS] SAMPLE:",
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

      setIsInitialLoading(false);
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

  const categoryPosts =
    useMemo(() => {
      if (!currentCategory)
        return [];

      return allPosts.filter(
        (p) =>
          p.category ===
          currentCategory
      );
    }, [
      allPosts,
      currentCategory,
    ]);

  // =========================
  // WINDOW POSTS
  // =========================

  const windowStart = Math.max(
    0,
    index - WINDOW_SIZE
  );

  const windowPosts = useMemo(() => {
    return allPosts.slice(
      windowStart,
      index + WINDOW_SIZE + 1
    );
  }, [
    allPosts,
    index,
    windowStart,
  ]);

  // =========================
  // OPTIONAL WINDOW PREFETCH
  // =========================
  // now only fetches missing cache
  // =========================

  useEffect(() => {
    const loadVisible =
      async () => {
        const missingIds =
          windowPosts
            .map((p) => p.id)
            .filter(
              (id) => !cache[id]
            );

        if (!missingIds.length) {
          console.log(
            "[LOAD_VISIBLE] CACHE HIT"
          );

          return;
        }

        console.log(
          "[LOAD_VISIBLE] FETCH MISSING:",
          missingIds
        );

        const {
          data,
          error,
        } = await supabase
          .from("posts")
          .select("*")
          .in("id", missingIds);

        if (error) {
          console.error(
            "[LOAD_VISIBLE] ERROR:",
            error
          );

          return;
        }

        if (!data) return;

        setCache((prev) => {
          const next = {
            ...prev,
          };

          data.forEach((p) => {
            next[p.id] = p;
          });

          return next;
        });

        console.log(
          "[LOAD_VISIBLE] PREFETCH SUCCESS:",
          data.length
        );
      };

    loadVisible();
  }, [windowPosts, cache]);

  // =========================
  // BUILD POSTS
  // =========================

  const posts = useMemo(() => {
    return windowPosts
      .map((p) => {
        const full =
          cache[p.id];

        if (!full) {
          console.warn(
            "[POST BUILD] CACHE MISS:",
            p.id
          );

          return null;
        }

        /*
          same category posts
        */

        const sameCategoryPosts =
          allPosts.filter(
            (x) =>
              x.category ===
              full.category
          );

        /*
          local index
        */

        const localIndex =
          sameCategoryPosts.findIndex(
            (x) =>
              x.id === full.id
          ) + 1;

        /*
          category total
        */

        const localTotal =
          sameCategoryPosts.length;

        /*
          global index
        */

        const globalIndex =
          allPosts.findIndex(
            (x) =>
              x.id === full.id
          ) + 1;

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
  }, [
    windowPosts,
    cache,
    allPosts,
  ]);

  // =========================
  // DEBUG
  // =========================

  useEffect(() => {
    if (!posts.length) return;

    console.log(
      "[FINAL POSTS]",
      posts.map((p) => ({
        title: p.title,

        category:
          p.category,

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
  }, [posts]);

  // =========================
  // LOADING
  // =========================

  if (isInitialLoading) {
    return (
      <div>
        Loading all posts...
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div>
        Loading visible posts...
      </div>
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