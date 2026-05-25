"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getMenu } from "@/app/components/SidebarCategory/sidebarData";
import { Item } from "@/app/components/types";
import MarkdownImageManager from "@/app/components/Markdown/processors/MarkdownPipeline/MarkdownManager";

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

  useEffect(() => {
    const loadMenu = async () => {
      const data = await getMenu();
      setMenu(data);
    };

    loadMenu();
  }, []);

  useEffect(() => {
    if (!menu.length) return;

    if (mode === "create") {
      if (defaultCategory) {
        setCategory(defaultCategory);
        return;
      }

      const fallback = menu[0]?.children?.[0]?.slug || "";
      setCategory(fallback);
    }
  }, [menu, defaultCategory, mode]);

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
        setCategory(data.category);
      }
    };

    fetchPost();
  }, [mode, postId]);

  useEffect(() => {
    if (typeof chrome === "undefined") return;
    if (!chrome.storage?.local) return;

    chrome.storage.local.get(["latest_post"], (result) => {
      if (!result.latest_post) return;

      console.log("LOADED FROM EXTENSION:");
      console.log(result.latest_post);

      setContent(result.latest_post);
    });
  }, []);

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

      if (error) {
        console.error(error);
        return alert("글 저장 실패");
      }

      router.push(`/category/${category}`);
      return;
    }

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
        alert("업데이트 실패");
        return;
      }

      router.push(`/post/${postId}`);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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

      <div style={{ marginBottom: 16 }}>
        <label>Title</label>
        <br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <MarkdownImageManager
        content={content}
        setContent={setContent}
      />

      <button
        type="submit"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          padding: "12px 22px",
          background: "#1e40af",
          color: "#fff",
          borderRadius: 8,
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        {mode === "create" ? "Submit" : "Update"}
      </button>
    </form>
  );
}