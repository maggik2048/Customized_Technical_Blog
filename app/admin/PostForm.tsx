"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getMenu } from "@/app/components/SidebarCategory/sidebarData";
import { Item } from "@/app/components/types";
import MarkdownImageManager from "@/app/components/Markdown/MarkdownManager";

type Props = {
  mode: "create" | "edit";
  postId?: string;
  defaultCategory?: string;
};

export default function PostForm({
  mode,
  postId,
  defaultCategory,
}: Props) {
  const router = useRouter();

  const [menu, setMenu] = useState<Item[]>([]);
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 1. 메뉴만 로드 (절대 category 세팅하지 않음)
  useEffect(() => {
    const loadMenu = async () => {
      const data = await getMenu();
      setMenu(data);
    };

    loadMenu();
  }, []);

  // 2. category 초기화 로직 (단일 책임)
  useEffect(() => {
    if (!menu.length) return;

    // EDIT 모드 → DB 값이 우선 (아래 fetchPost에서 처리됨)
    if (mode === "create") {
      if (defaultCategory) {
        setCategory(defaultCategory);
        return;
      }

      const fallback =
        menu[0]?.children?.[0]?.slug || "";

      setCategory(fallback);
    }
  }, [menu, defaultCategory, mode]);

  // 3. edit 데이터 로드
  useEffect(() => {
    if (mode !== "edit" || !postId) return;

    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setTitle(data.title);
        setContent(data.content);

        // edit에서는 DB 값이 최종 override
        setCategory(data.category);
      }
    };

    fetchPost();
  }, [mode, postId]);

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !category) {
      alert("모든 필드를 입력하세요");
      return;
    }

    // CREATE
    if (mode === "create") {
      const { error } = await supabase
        .from("posts")
        .insert([{ title, content, category }]);

      if (error) {
        console.error(error);
        return alert("글 저장 실패");
      }

      router.push(`/category/${category}`);
      return;
    }

    // EDIT
    if (mode === "edit" && postId) {
      const { data, error } = await supabase
        .from("posts")
        .update({ title, content, category })
        .eq("id", postId)
        .select();

      if (error) {
        console.error(error);
        return alert("수정 실패");
      }

      if (!data || data.length === 0) {
        alert("업데이트 실패: id mismatch");
        return;
      }

      router.push(`/post/${postId}`);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* CATEGORY */}
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
              <option
                key={child.slug}
                value={child.slug}
              >
                {child.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* TITLE */}
      <div style={{ marginBottom: 16 }}>
        <label>Title</label>
        <br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      {/* CONTENT */}
      <MarkdownImageManager
        content={content}
        setContent={setContent}
      />

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