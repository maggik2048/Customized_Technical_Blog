"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getMenu } from "@/app/components/SidebarCategory/sidebarData";
import { Item } from "@/app/components/types";
import MarkdownImageManager from "@/app/components/Markdown/MarkdownImageManager";

type Props = {
  mode: "create" | "edit";
  postId?: string; //  UUID
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

  // 🔥 기존 글 불러오기 (UUID)
  useEffect(() => {
    if (mode !== "edit" || !postId) return;

    const fetchPost = async () => {
      console.log("fetch UUID:", postId);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId) // ✅ 핵심
        .single();

      if (error) {
        console.error("fetch error:", error);
        return;
      }

      if (data) {
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
      }
    };

    fetchPost();
  }, [mode, postId]);

  //  submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 DB에 실제 어떤 id들이 있는지 확인
  const { data } = await supabase
    .from("posts")
    .select("id");

  console.log("🔥 ALL IDS:", data);

    console.log("SUBMIT UUID:", postId);

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
        .eq("id", postId) // ✅ UUID 그대로
        .select();

      console.log("updated:", data);

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

      {/* 내용 */}
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