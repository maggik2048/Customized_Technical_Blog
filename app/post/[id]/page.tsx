"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import StackedPostViewer from "@/app/components/papers/StackedPostViewer";
import PostEnvironment from "@/app/components/papers/PostEnvironment";

const WINDOW_SIZE = 2;

export default function PostPage() {
  const { id } = useParams() as { id: string };

  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [cache, setCache] = useState<Record<string, any>>({});

  // 1. 전체 id list (lightweight)
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

  // 2. window slice
  const windowPosts = allPosts.slice(
    Math.max(0, index - WINDOW_SIZE),
    index + WINDOW_SIZE + 1
  );

  // 3. fetch cache only visible
  useEffect(() => {
    const loadVisible = async () => {
      const ids = windowPosts.map((p) => p.id);
      if (!ids.length) return;

      const { data } = await supabase
        .from("posts")
        .select("*")
        .in("id", ids);

      if (!data) return;

      setCache((prev) => {
        const next = { ...prev };
        data.forEach((p) => (next[p.id] = p));
        return next;
      });
    };

    loadVisible();
  }, [index, allPosts]);

  const posts = windowPosts.map((p) => cache[p.id]).filter(Boolean);

  if (!posts.length) return <div>Loading...</div>;

  return (
    <PostEnvironment>
      <StackedPostViewer
        posts={posts}
        index={Math.min(
          index - Math.max(0, index - WINDOW_SIZE),
          posts.length - 1
        )}
        onChangeIndex={(i: number) => {
          const realIndex = index - WINDOW_SIZE + i;
          setIndex(realIndex);
        }}
      />
    </PostEnvironment>
  );
}