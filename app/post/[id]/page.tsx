"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import StackedPostViewer from "@/app/components/papers/StackedPostViewer";
import PostEnvironment from "@/app/components/papers/PostEnvironment";

import CategoryPostBoxIndex from "@/app/category/[slug]/CategoryPostBoxIndex";

const WINDOW_SIZE = 2;

export default function PostPage() {
  const { id } = useParams() as { id: string };

  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  const [cache, setCache] = useState<Record<string, any>>({});

  // 전체 posts 로드
  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("posts")
        // 🔥 category_slug 대신 실제 컬럼명 사용
        .select("id, created_at, category")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        return;
      }

      if (!data) return;

      setAllPosts(data);

      const idx = data.findIndex((p) => p.id === id);

      setIndex(idx >= 0 ? idx : 0);
    };

    load();
  }, [id]);

  // 현재 post
  const currentPost = allPosts[index];

  // 현재 category
  const currentCategory = currentPost?.category;

  // 같은 category posts
  const categoryPosts = useMemo(() => {
    if (!currentCategory) return [];

    return allPosts.filter(
      (p) => p.category === currentCategory
    );
  }, [allPosts, currentCategory]);

  // category 내부 순번
  const categoryIndex = useMemo(() => {
    if (!currentPost) return 0;

    const idx = categoryPosts.findIndex(
      (p) => p.id === currentPost.id
    );

    return idx >= 0 ? idx + 1 : 0;
  }, [categoryPosts, currentPost]);

  // 전체 기준 순번
  const globalIndex = index + 1;

  // 현재 보여줄 window
  const windowStart = Math.max(0, index - WINDOW_SIZE);

  const windowPosts = allPosts.slice(
    windowStart,
    index + WINDOW_SIZE + 1
  );

  // visible posts만 fetch
  useEffect(() => {
    const loadVisible = async () => {
      const ids = windowPosts.map((p) => p.id);

      if (!ids.length) return;

      const { data, error } = await supabase
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

  // cache 기반 posts
  const posts = windowPosts
    .map((p) => cache[p.id])
    .filter(Boolean);

  // loading guard
  if (!allPosts.length) {
    return <div>Loading all posts...</div>;
  }

  if (!posts.length) {
    return <div>Loading posts...</div>;
  }

  return (
    <PostEnvironment>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <CategoryPostBoxIndex
          categoryIndex={categoryIndex}
          globalIndex={globalIndex}
          isSimple={false}
        />

        <StackedPostViewer
          posts={posts}
          index={Math.min(
            index - windowStart,
            posts.length - 1
          )}
          onChangeIndex={(i: number) => {
            const realIndex = windowStart + i;

            setIndex(realIndex);
          }}
        />
      </div>
    </PostEnvironment>
  );
}