"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("discrete");

  const router = useRouter();

  const handleSubmit = async () => {
    const { error } = await supabase.from("posts").insert({
      title,
      content,
      category,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("글 저장 완료");

    // 저장 후 카테고리 페이지로 이동
    router.push(`/category/${category}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>글쓰기</h1>

      <input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", marginBottom: 10, width: "100%" }}
      />

      <textarea
        placeholder="내용 (markdown + 수식 가능)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          display: "block",
          marginBottom: 10,
          width: "100%",
          height: 200,
        }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ marginBottom: 20 }}
      >
        <option value="discrete">discrete</option>
        <option value="graphics">graphics</option>
        <option value="math">math</option>
      </select>

      <button onClick={handleSubmit}>저장</button>
    </div>
  );
}