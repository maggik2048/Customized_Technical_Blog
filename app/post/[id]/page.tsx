"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import StackedPostViewer from "@/app/components/papers/StackedPostViewer";
import PostEnvironment from "@/app/components/papers/PostEnvironment";
import PaperWobble3D from "@/app/components/papers/PageFlippingAnimation/PaperWobble3D";
import { windConfigs } from "@/app/data/windConfigs";

export default function PostPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3D 종이 상태
  const [show3D, setShow3D] = useState(false);
  const [is3DActive, setIs3DActive] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward' | null>(null);
  const [current3DImage, setCurrent3DImage] = useState<string>('');

  // =========================
  // FETCH POST + ALL POSTS
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      console.log("========================================");
      console.log("🔍 [PostPage] Starting...");
      console.log("🔍 [PostPage] URL id:", id);
      console.log("========================================");
      
      if (!id) {
        console.error("❌ [PostPage] ID is missing from URL");
        setError("ID is missing from URL");
        setLoading(false);
        return;
      }

      try {
        // ✅ 1. 먼저 현재 포스트 찾기
        console.log("📡 [Fetch] Finding post with id:", id);
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (postError) {
          console.error("❌ [Fetch] Post error:", postError);
          console.error("❌ [Fetch] Post error details:", {
            code: postError.code,
            message: postError.message,
            details: postError.details,
            hint: postError.hint
          });
          setError(`Post not found: ${postError.message}`);
          setLoading(false);
          return;
        }

        if (!postData) {
          console.warn("⚠️ [Fetch] No data found for id:", id);
          setError("Post not found");
          setLoading(false);
          return;
        }

        console.log("✅ [Fetch] Post found:", {
          id: postData.id,
          title: postData.title,
          category: postData.category,
          project_slugs: postData.project_slugs,
          created_at: postData.created_at
        });
        setPost(postData);

        // ✅ 2. 모든 포스트 로드
        console.log("📡 [Fetch] Loading all posts...");
        const { data: allData, error: allError } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: true });

        if (allError) {
          console.error("❌ [Fetch] All posts error:", allError);
          console.error("❌ [Fetch] All posts error details:", {
            code: allError.code,
            message: allError.message,
            details: allError.details,
            hint: allError.hint
          });
          console.warn("⚠️ [Fetch] Falling back to single post mode");
          setAllPosts([postData]);
          setLoading(false);
          return;
        }

        console.log("📡 [Fetch] All posts loaded:", allData?.length || 0);
        
        // allData가 없거나 빈 배열이면 현재 포스트만 사용
        if (!allData || allData.length === 0) {
          console.warn("⚠️ [Fetch] No all posts data, using current post only");
          setAllPosts([postData]);
          setLoading(false);
          return;
        }

        // 현재 포스트의 인덱스 찾기
        const currentIndex = allData.findIndex((p) => p.id === postData.id);
        console.log("📡 [Fetch] Current post index in all posts:", currentIndex);
        
        // 이전/다음 포스트 정보 로깅
        if (currentIndex > 0) {
          console.log("📡 [Fetch] Previous post:", {
            id: allData[currentIndex - 1].id,
            title: allData[currentIndex - 1].title
          });
        } else {
          console.log("📡 [Fetch] No previous post (first post)");
        }

        if (currentIndex < allData.length - 1) {
          console.log("📡 [Fetch] Next post:", {
            id: allData[currentIndex + 1].id,
            title: allData[currentIndex + 1].title
          });
        } else {
          console.log("📡 [Fetch] No next post (last post)");
        }

        // 전체 포스트 제목 목록 로깅
        console.log("📡 [Fetch] All post titles:", allData.map((p, i) => ({
          index: i,
          id: p.id,
          title: p.title,
          isCurrent: p.id === postData.id ? "⭐ CURRENT" : ""
        })));

        setAllPosts(allData);
        setLoading(false);
        
      } catch (err) {
        console.error("❌ [Fetch] Unexpected error:", err);
        console.error("❌ [Fetch] Error stack:", err instanceof Error ? err.stack : "No stack available");
        setError(`Unexpected error: ${err}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // =========================
  // BUILD POSTS FOR STACKED VIEWER
  // =========================
  const buildStackedPosts = () => {
    console.log("========================================");
    console.log("📊 [Stacked] Building stacked posts...");
    console.log("📊 [Stacked] Current post:", post?.id, post?.title);
    console.log("📊 [Stacked] All posts count:", allPosts.length);
    console.log("========================================");

    if (!post) {
      console.warn("⚠️ [Stacked] No post found, returning empty array");
      return [];
    }

    // allPosts가 비어있으면 현재 포스트만 반환
    if (!allPosts.length) {
      console.warn("⚠️ [Stacked] allPosts is empty, returning single post");
      return [{
        ...post,
        __globalIndex: 1,
        __localIndex: 1,
        __localTotal: 1,
      }];
    }

    const currentIdx = allPosts.findIndex((p) => p.id === post.id);
    console.log("📊 [Stacked] Current index in allPosts:", currentIdx);
    
    if (currentIdx === -1) {
      console.warn("⚠️ [Stacked] Current post not found in allPosts, returning single post");
      return [{
        ...post,
        __globalIndex: 1,
        __localIndex: 1,
        __localTotal: 1,
      }];
    }

    const prevIdx = currentIdx - 1;
    const nextIdx = currentIdx + 1;
    console.log("📊 [Stacked] Previous index:", prevIdx, "Next index:", nextIdx);
    
    const indices = [prevIdx, currentIdx, nextIdx].filter(
      (i) => i >= 0 && i < allPosts.length
    );
    console.log("📊 [Stacked] Final indices to display:", indices);

    const result = indices.map((i) => {
      const p = allPosts[i];
      
      // category가 없거나 null인 경우 처리
      const sameCategoryPosts = allPosts.filter((x) => {
        if (!x.category && !p.category) return true;
        if (!x.category || !p.category) return false;
        return x.category === p.category;
      });

      const localIndex = sameCategoryPosts.findIndex((x) => x.id === p.id) + 1;
      const localTotal = sameCategoryPosts.length;
      const globalIndex = allPosts.findIndex((x) => x.id === p.id) + 1;

      const postWithMeta = {
        ...p,
        __globalIndex: globalIndex,
        __localIndex: localIndex,
        __localTotal: localTotal,
      };

      console.log(`📊 [Stacked] Post at index ${i}:`, {
        title: p.title,
        id: p.id,
        globalIndex,
        localIndex,
        localTotal,
        isCurrent: p.id === post.id ? "⭐ CURRENT" : ""
      });

      return postWithMeta;
    });

    console.log("📊 [Stacked] Final stacked posts:", result.map(p => p.title));
    console.log("========================================");
    
    return result;
  };

  const stackedPosts = buildStackedPosts();
  const viewerIndex = stackedPosts.findIndex((p) => p.id === post?.id);
  
  console.log("📊 [Stacked] Viewer index:", viewerIndex);
  console.log("📊 [Stacked] Total stacked posts:", stackedPosts.length);
  if (viewerIndex >= 0) {
    console.log("📊 [Stacked] Current post in stack:", stackedPosts[viewerIndex]?.title);
  }

  // =========================
  // 3D 종이 토글 핸들러
  // =========================
  const toggle3D = useCallback((imagePath?: string) => {
    console.log("🔄 [3D] Toggling 3D view:", { imagePath, show3D: !show3D });
    if (imagePath) {
      setCurrent3DImage(imagePath);
    }
    
    setShow3D(prev => !prev);
    if (!show3D) {
      setIs3DActive(true);
      setFlipProgress(0);
      setFlipDirection('forward');
    } else {
      setIs3DActive(false);
    }
  }, [show3D]);

  // =========================
  // 3D 플립 완료 핸들러
  // =========================
  const handleFlipComplete = useCallback(() => {
    console.log("🔄 [3D] Flip complete");
    setIs3DActive(false);
    setFlipProgress(0);
    setFlipDirection(null);
  }, []);

  // =========================
  // RENDER
  // =========================
  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div>Loading post...</div>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
          ID: {id || "undefined"}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ color: "red", fontSize: "20px", marginBottom: "10px" }}>
          ❌ Error
        </div>
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
          {error}
        </div>
        <div style={{ fontSize: "12px", color: "#999", marginBottom: "20px" }}>
          ID: {id}
        </div>
        <button 
          onClick={() => router.push("/")}
          style={{
            padding: "10px 24px",
            borderRadius: "8px",
            background: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          ← Go Home
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div>No post found</div>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
          ID: {id}
        </div>
      </div>
    );
  }

  if (!stackedPosts.length) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>{post.title}</h1>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
          ID: {post.id}
        </div>
        <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
          Category: {post.category || "(no category)"}
        </div>
        <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
          {post.content?.slice(0, 500)}...
        </div>
        <button 
          onClick={() => router.push("/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "8px",
            background: "#0070f3",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          ← Go Home
        </button>
      </div>
    );
  }

  // =========================
  // MAIN RENDER WITH STACKED VIEWER
  // =========================
  return (
    <PostEnvironment key={id}>
      {/* 3D 종이 */}
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
          key={id}
          posts={stackedPosts}
          index={viewerIndex >= 0 ? viewerIndex : 0}
          onChangeIndex={(i: number) => {
            const targetPost = stackedPosts[i];
            if (targetPost) {
              console.log("🔄 [onChangeIndex] Navigating to:", {
                id: targetPost.id,
                title: targetPost.title,
                index: i
              });
              router.push(`/post/${targetPost.id}`);
            } else {
              console.warn("⚠️ [onChangeIndex] No target post at index:", i);
            }
          }}
          onToggle3D={toggle3D}
          currentImage={post?.thumbnail || post?.image}
        />
      </div>
    </PostEnvironment>
  );
}