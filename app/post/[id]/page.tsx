"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import StackedPostViewer from "@/app/components/papers/StackedPostViewer";
import PostEnvironment from "@/app/post/[id]/PostEnvironment";
import PaperWobble3D from "@/app/components/papers/PageFlippingAnimation/PaperWobble3D";
import { windConfigs } from "@/app/data/windConfigs";

export default function PostPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        console.log("📡 [Fetch] Finding post with id:", id);
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (postError) {
          console.error("❌ [Fetch] Post error:", postError);
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
          created_at: postData.created_at
        });
        setPost(postData);

        console.log("📡 [Fetch] Loading all posts...");
        const { data: allData, error: allError } = await supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: true });

        if (allError) {
          console.error("❌ [Fetch] All posts error:", allError);
          setAllPosts([postData]);
          setLoading(false);
          return;
        }

        console.log("📡 [Fetch] All posts loaded:", allData?.length || 0);

        let finalAllData = allData || [];
        const currentExists = finalAllData.some((p) => String(p.id) === String(postData.id));
        console.log("📡 [Fetch] Current post exists in allData:", currentExists);

        if (!currentExists) {
          console.warn("⚠️ [Fetch] Current post missing from allData, adding it...");
          finalAllData = [postData, ...finalAllData];
          
          finalAllData.sort((a, b) => {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          });
          
          console.log("📡 [Fetch] Updated all posts count:", finalAllData.length);
        }

        const currentIndex = finalAllData.findIndex((p) => String(p.id) === String(postData.id));
        console.log("📡 [Fetch] Current post index in all posts:", currentIndex);
        
        if (currentIndex > 0) {
          console.log("📡 [Fetch] Previous post:", {
            id: finalAllData[currentIndex - 1].id,
            title: finalAllData[currentIndex - 1].title
          });
        } else {
          console.log("📡 [Fetch] No previous post (first post)");
        }

        if (currentIndex < finalAllData.length - 1) {
          console.log("📡 [Fetch] Next post:", {
            id: finalAllData[currentIndex + 1].id,
            title: finalAllData[currentIndex + 1].title
          });
        } else {
          console.log("📡 [Fetch] No next post (last post)");
        }

        setAllPosts(finalAllData);
        setLoading(false);
        
      } catch (err) {
        console.error("❌ [Fetch] Unexpected error:", err);
        setError(`Unexpected error: ${err}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // =========================
  // 🔥 FIX: 클라이언트 사이드 포스트 변경 핸들러
  // =========================
  const handlePostChange = useCallback((targetPost: any) => {
    if (!targetPost) return;
    
    console.log("🔄 [PostPage] Changing to post:", targetPost.id, targetPost.title);
    
    // 1. 현재 포스트 업데이트
    setPost(targetPost);
    
    // 2. URL 업데이트 (히스토리만 변경, 페이지 새로고침 없음)
    window.history.pushState(null, '', `/post/${targetPost.id}`);
    
    // 3. allPosts에서 현재 포스트 인덱스 업데이트를 위해 다시 빌드하지 않음
    // StackedPostViewer가 내부적으로 인덱스만 변경하면 됨
  }, []);

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

    if (!allPosts.length) {
      console.warn("⚠️ [Stacked] allPosts is empty, returning single post");
      return [{
        ...post,
        __globalIndex: 1,
        __localIndex: 1,
        __localTotal: 1,
      }];
    }

    const currentIdx = allPosts.findIndex((p) => String(p.id) === String(post.id));
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

  const toggle3D = useCallback((imagePath?: string) => {
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

  const handleFlipComplete = useCallback(() => {
    setIs3DActive(false);
    setFlipProgress(0);
    setFlipDirection(null);
  }, []);

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

  return (
    <PostEnvironment key={id}>
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
            if (targetPost && targetPost.id !== post?.id) {
              console.log("🔄 [onChangeIndex] Navigating to:", targetPost.id);
              // 🔥 FIX: router.push 대신 handlePostChange 사용
              handlePostChange(targetPost);
            }
          }}
          onToggle3D={toggle3D}
          currentImage={post?.thumbnail || post?.image}
        />
      </div>
    </PostEnvironment>
  );
}