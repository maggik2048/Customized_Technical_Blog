"use client";

import { useEffect, useRef, useState } from "react";
import PaperStack from "./PaperStack";
import PDFPage from "@/app/components/PDFPage";

export default function InfinitePosts({ initialPosts }: any) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);

          const res = await fetch(`/api/posts?page=${page + 1}`);
          const newPosts = await res.json();

          if (newPosts?.length) {
            setPosts((prev: any) => [...prev, ...newPosts]);
            setPage((p) => p + 1);
          }

          setLoading(false);
        }
      },
      { threshold: 0.8 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [page, loading]);

  return (
    <div>
      {posts.map((post: any) => (
        <PaperStack key={post.id}>
          <PDFPage data={post} />
        </PaperStack>
      ))}

      {/* 트리거 */}
      <div ref={loaderRef} style={{ height: 120 }} />

      {loading && (
        <p style={{ textAlign: "center", opacity: 0.6 }}>
          loading...
        </p>
      )}
    </div>
  );
}