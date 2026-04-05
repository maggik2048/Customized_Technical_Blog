"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getMenu } from "@/app/components/sidebarData";
import { Item } from "@/app/components/types";
import MarkdownImageManager from "@/app/components/MarkdownImageManager";

type Props = {
  mode: "create" | "edit";
  postId?: string;
};

export default function PostForm({ mode, postId }: Props) {
  const router = useRouter();

  const [menu, setMenu] = useState<Item[]>([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 메뉴 로드
  useEffect(() => {
    const loadMenu = async () => {
      const data = await getMenu();
      setMenu(data);

      const first = data[0]?.children?.[0]?.href?.split("/").pop() || "";
      setCategory(first);
    };

    loadMenu();
  }, []);

  // edit일 때 기존 글 불러오기
  useEffect(() => {
    if (mode === "edit" && postId) {
      const fetchPost = async () => {
        const { data } = await supabase
          .from("posts")
          .select("*")
          .eq("id", postId)
          .single();

        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.category);
        }
      };

      fetchPost();
    }
  }, [mode, postId]);

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !category) {
      alert("모든 필드를 입력하세요");
      return;
    }

    if (mode === "create") {
      const { error } = await supabase.from("posts").insert([
        { title, content, category },
      ]);

      if (error) return alert("글 저장 실패");

      router.push(`/category/${category}`);
    }

    if (mode === "edit" && postId) {
      const { error } = await supabase
        .from("posts")
        .update({ title, content, category })
        .eq("id", postId);

      if (error) return alert("수정 실패");

      router.push(`/post/${postId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 카테고리 */}
      <div style={{ marginBottom: 16 }}>
        <label>Category</label>
        <br />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        >
          {menu.map((cat) =>
            cat.children?.map((child) => (
              <option key={child.slug} value={child.slug}>
                {child.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* 제목 */}
      <div style={{ marginBottom: 16 }}>
        <label>Title</label>
        <br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      {/* Markdown + Insert Image */}
      <MarkdownImageManager content={content} setContent={setContent} />

      <button
        type="submit"
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#1e40af",
          color: "#fff",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        {mode === "create" ? "Submit" : "Update"}
      </button>
    </form>
  );
}