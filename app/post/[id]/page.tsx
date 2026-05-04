"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import StackedPostViewer from "@/app/components/papers/StackedPostViewer";

const WINDOW_SIZE = 2; // prev2 + current + next2

export default function PostPage() {
  const { id } = useParams() as { id: string };

  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [cache, setCache] = useState<Record<string, any>>({});

  // 1. 전체 id 리스트 (가벼운 메타만)
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("posts")
        .select("id, created_at")
        .order("created_at", { ascending: true });

      if (!data) return;

      setAllPosts(data);

      const idx = data.findIndex((p) => p.id === id);
      setIndex(idx >= 0 ? idx : 0);
    };

    load();
  }, [id]);

  // 2. window 계산
  const windowPosts = allPosts.slice(
    Math.max(0, index - WINDOW_SIZE),
    index + WINDOW_SIZE + 1
  );

  // 3. 필요한 것만 fetch (cache)
  useEffect(() => {
    const loadVisible = async () => {
      const ids = windowPosts.map((p) => p.id);
      if (ids.length === 0) return;

      const { data } = await supabase
        .from("posts")
        .select("*")
        .in("id", ids);

      if (!data) return;

      setCache((prev) => {
        const next = { ...prev };
        data.forEach((post) => {
          next[post.id] = post;
        });
        return next;
      });
    };

    loadVisible();
  }, [index, allPosts]);

  // 4. 실제 렌더용 posts
  const posts = windowPosts
    .map((p) => cache[p.id])
    .filter(Boolean);

  if (!posts.length) return <div>Loading...</div>;

  return (
    <StackedPostViewer
      posts={posts}
      index={Math.min(index - Math.max(0, index - WINDOW_SIZE), posts.length - 1)}
      onChangeIndex={(i) => {
        const realIndex = index - WINDOW_SIZE + i;
        setIndex(realIndex);
      }}
    />
  );
}