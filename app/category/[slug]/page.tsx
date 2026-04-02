import { supabase } from "@/lib/supabase";
import Link from "next/link";
import React from "react";

export default async function CategoryPage(props: any) {
  const params = await props.params;

  // Supabase에서 해당 카테고리 포스트 가져오기
  const { data, error } = await supabase
    .from("posts")
    .select("id, title") // content는 안 가져옴
    .eq("category", params.slug)
    .order("created_at", { ascending: false });

  if (error) {
    return <div>에러: {error.message}</div>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        Category: {params.slug}
      </h1>

      {data?.map((post) => (
        <div key={post.id} style={{ marginBottom: 20 }}>
          {/* 제목만 링크 적용 */}
          <Link href={`/post/${post.id}`}>
            <h2 style={{ cursor: "pointer", color: "skyblue" }}>
              {post.title}
            </h2>
          </Link>
        </div>
      ))}
    </div>
  );
}