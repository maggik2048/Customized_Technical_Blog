"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [projectDate, setProjectDate] = useState("");

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력하세요");
      return;
    }

    const payload: any = {
      title,
      content,
    };

    if (projectDate) {
      payload.project_date = new Date(projectDate).toISOString();
    }

    const { error } = await supabase.from("posts").insert([payload]);

    if (error) {
      alert("에러: " + error.message);
      return;
    }

    alert("작성 완료");

    setTitle("");
    setContent("");
    setProjectDate("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>글 작성</h1>

      {/* 제목 */}
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 20,
          fontSize: 16,
        }}
      />

      {/* 날짜 */}
      <input
        type="datetime-local"
        value={projectDate}
        onChange={(e) => setProjectDate(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {/* 에디터 + 프리뷰 */}
      <div style={{ display: "flex", gap: 20 }}>
        {/* 왼쪽: 입력 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Markdown + LaTeX 지원"
          style={{
            width: "50%",
            height: "70vh",
            padding: 10,
            fontSize: 14,
          }}
        />

        {/* 오른쪽: preview */}
        <div
          style={{
            width: "50%",
            height: "70vh",
            overflowY: "auto",
            padding: 20,
            background: "#111",
            color: "#eee",
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* 버튼 */}
      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: "10px 20px",
        }}
      >
        작성하기
      </button>
    </div>
  );
}