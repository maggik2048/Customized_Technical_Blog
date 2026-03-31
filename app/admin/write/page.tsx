"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("discrete"); // 기본값

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("posts")
      .insert([{ title, content, category }]);

    if (error) {
      alert("저장 실패: " + error.message);
      return;
    }

    // 저장 후 카테고리 페이지로 이동
    router.push(`/category/${category}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>새 글 작성</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 600 }}>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: 8, fontSize: 16 }}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="discrete">Discrete</option>
          <option value="network">Network</option>
          <option value="ai">AI</option>
          <option value="dsa">DSA</option>
        </select>

        <textarea
          placeholder="내용 (Markdown 지원)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          style={{ padding: 8, fontSize: 16, fontFamily: "monospace" }}
          required
        />

        <button type="submit" style={{ padding: 12, backgroundColor: "#1e40af", color: "#fff", fontWeight: "bold" }}>
          저장
        </button>
      </form>
    </div>
  );
}