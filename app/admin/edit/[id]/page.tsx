"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  // 🔥 기존 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
      }
    };

    if (id) fetchPost();
  }, [id]);

  // 🔥 수정 저장
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        content,
        category,
      })
      .eq("id", id);

    if (error) {
      alert("수정 실패");
      return;
    }

    alert("수정 완료");
    router.push(`/post/${id}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>글 수정</h1>

      <form onSubmit={handleUpdate}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          style={{ width: "100%", marginBottom: 10 }}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", height: 300 }}
        />

        <button type="submit" style={{ marginTop: 10 }}>
          저장
        </button>
      </form>
    </div>
  );
}