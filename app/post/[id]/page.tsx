"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import StackedPostViewer from "@/app/components/papers/StackedPostViewer";
import PostEnvironment from "@/app/components/papers/PostEnvironment";
import PaperWobble3D from "@/app/components/papers/PageFlippingAnimation/PaperWobble3D";
import { windConfigs } from "@/app/data/windConfigs";

const WINDOW_SIZE = 2;

export default function PostPage() {
  const { id } = useParams() as { id: string };

  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [cache, setCache] = useState<Record<string, any>>({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 🆕 3D 종이 상태
  const [show3D, setShow3D] = useState(false);
  const [is3DActive, setIs3DActive] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward' | null>(null);
  const [current3DImage, setCurrent3DImage] = useState<string>('');

  // =========================
  // LOAD ALL POSTS
  // =========================
  useEffect(() => {
    const load = async () => {
      console.log("[LOAD_ALL_POSTS] START");
      setIsInitialLoading(true);

      const { data, error } = await supabase
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
        .order("created_at", { ascending: true });

      if (error) {
        console.error("[LOAD_ALL_POSTS] ERROR:", error);
        setIsInitialLoading(false);
        return;
      }

      if (!data) {
        console.warn("[LOAD_ALL_POSTS] NO DATA");
        setIsInitialLoading(false);
        return;
      }

      const initialCache: Record<string, any> = {};
      data.forEach((post) => {
        initialCache[post.id] = post;
      });

      setCache(initialCache);
      setAllPosts(data);

      const idx = data.findIndex((p) => p.id === id);
      setIndex(idx >= 0 ? idx : 0);

      setIsInitialLoading(false);
    };

    load();
  }, [id]);

  // =========================
  // CURRENT POST
  // =========================
  const currentPost = allPosts[index];
  const currentCategory = currentPost?.category;

  // =========================
  // CATEGORY POSTS
  // =========================
  const categoryPosts = useMemo(() => {
    if (!currentCategory) return [];
    return allPosts.filter((p) => p.category === currentCategory);
  }, [allPosts, currentCategory]);

  // =========================
  // WINDOW POSTS
  // =========================
  const windowStart = Math.max(0, index - WINDOW_SIZE);
  const windowPosts = useMemo(() => {
    return allPosts.slice(windowStart, index + WINDOW_SIZE + 1);
  }, [allPosts, index, windowStart]);

  // =========================
  // OPTIONAL WINDOW PREFETCH
  // =========================
  useEffect(() => {
    const loadVisible = async () => {
      const missingIds = windowPosts
        .map((p) => p.id)
        .filter((id) => !cache[id]);

      if (!missingIds.length) {
        console.log("[LOAD_VISIBLE] CACHE HIT");
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .in("id", missingIds);

      if (error) {
        console.error("[LOAD_VISIBLE] ERROR:", error);
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
  }, [windowPosts, cache]);

  // =========================
  // BUILD POSTS
  // =========================
  const posts = useMemo(() => {
    return windowPosts
      .map((p) => {
        const full = cache[p.id];
        if (!full) {
          console.warn("[POST BUILD] CACHE MISS:", p.id);
          return null;
        }

        const sameCategoryPosts = allPosts.filter(
          (x) => x.category === full.category
        );

        const localIndex = sameCategoryPosts.findIndex((x) => x.id === full.id) + 1;
        const localTotal = sameCategoryPosts.length;
        const globalIndex = allPosts.findIndex((x) => x.id === full.id) + 1;

        return {
          ...full,
          __globalIndex: globalIndex,
          __localIndex: localIndex,
          __localTotal: localTotal,
        };
      })
      .filter(Boolean);
  }, [windowPosts, cache, allPosts]);

  // =========================
  // 🆕 3D 종이 토글 핸들러
  // =========================
  const toggle3D = useCallback((imagePath?: string) => {
    if (imagePath) {
      setCurrent3DImage(imagePath);
    }
    
    setShow3D(prev => !prev);
    if (!show3D) {
      // 3D 시작
      setIs3DActive(true);
      setFlipProgress(0);
      setFlipDirection('forward');
    } else {
      // 3D 종료
      setIs3DActive(false);
    }
  }, [show3D]);

  // =========================
  // 🆕 3D 플립 완료 핸들러
  // =========================
  const handleFlipComplete = useCallback(() => {
    setIs3DActive(false);
    setFlipProgress(0);
    setFlipDirection(null);
  }, []);

  // =========================
  // DEBUG
  // =========================
  useEffect(() => {
    if (!posts.length) return;
    console.log("[FINAL POSTS]", posts.map((p) => ({
      title: p.title,
      category: p.category,
      global: p.__globalIndex,
      local: p.__localIndex,
      total: p.__localTotal,
    })));
  }, [posts]);

  // =========================
  // LOADING
  // =========================
  if (isInitialLoading) {
    return <div>Loading all posts...</div>;
  }

  if (!posts.length) {
    return <div>Loading visible posts...</div>;
  }

  // =========================
  // RENDER
  // =========================
  return (
    <PostEnvironment>
      {/* 🆕 3D 종이 - ViewportGuard 완전히 밖에서 렌더링 */}
      {show3D && current3DImage && (
        <PaperWobble3D
          imagePath={current3DImage}
          isActive={is3DActive}
          progress={flipProgress}
          direction={flipDirection}
          onFlipComplete={handleFlipComplete}
          windConfig={windConfigs.gentleBreeze}
        />
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <StackedPostViewer
          posts={posts}
          index={Math.min(index - windowStart, posts.length - 1)}
          onChangeIndex={(i: number) => {
            const realIndex = windowStart + i;
            setIndex(realIndex);
          }}
          onToggle3D={toggle3D}  // 🆕 3D 토글 함수 전달
          currentImage={currentPost?.thumbnail || currentPost?.image} // 🆕 현재 이미지 전달
        />
      </div>
    </PostEnvironment>
  );
}