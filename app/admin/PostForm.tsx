"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import MarkdownImageManager from "@/app/components/Markdown/processors/MarkdownPipeline/MarkdownManager";

import { getRecentAccessCategories } from "./GetRecentAccess";

import { PROJECT_TREE } from "@/app/components/SidebarCategory/Data/ProjectTree";

import { TAG_TREE } from "@/app/components/SidebarCategory/Data/TagTree";

type CategoryItem = {
  name: string;
  slug: string;
};

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

  /*
    category menu
  */

  const [menu, setMenu] = useState<
    CategoryItem[]
  >([]);

  /*
    metadata states
  */

  const [categorySlugs, setCategorySlugs] =
    useState<string[]>([]);

  const [projectSlugs, setProjectSlugs] =
    useState<string[]>([]);

  const [tagSlugs, setTagSlugs] =
    useState<string[]>([]);

  /*
    content states
  */

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  /*
    category menu load
  */

  useEffect(() => {
    const loadMenu = async () => {
      const data =
        await getRecentAccessCategories();

      setMenu(data);
    };

    loadMenu();
  }, []);

  /*
    default category initialize
  */

  useEffect(() => {
    if (!menu.length) return;

    if (mode !== "create") return;

    if (defaultCategory) {
      setCategorySlugs([
        defaultCategory,
      ]);

      return;
    }

    const fallback =
      menu[0]?.slug;

    if (!fallback) return;

    setCategorySlugs([
      fallback,
    ]);
  }, [
    menu,
    defaultCategory,
    mode,
  ]);

  /*
    edit mode fetch
  */

  useEffect(() => {
    if (mode !== "edit") return;

    if (!postId) return;

    const fetchPost = async () => {
      const { data, error } =
        await supabase
          .from("posts")
          .select("*")
          .eq("id", postId)
          .single();

      if (error) {
        console.error(error);

        return;
      }

      if (!data) return;

      setTitle(data.title || "");

      setContent(
        data.content || ""
      );

      setCategorySlugs(
        data.category_slugs || []
      );

      setProjectSlugs(
        data.project_slugs || []
      );

      setTagSlugs(
        data.tag_slugs || []
      );
    };

    fetchPost();
  }, [mode, postId]);

  /*
    chrome extension import
  */

  useEffect(() => {
    if (typeof chrome === "undefined")
      return;

    if (!chrome.storage?.local)
      return;

    chrome.storage.local.get(
      ["latest_post"],
      (result) => {
        if (!result.latest_post)
          return;

        setContent(
          result.latest_post
        );
      }
    );
  }, []);

  /*
    multi select helper
  */

  const getSelectedValues = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    return Array.from(
      e.target.selectedOptions
    ).map((option) => option.value);
  };

  /*
    submit
  */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 입력하세요");

      return;
    }

    const payload = {
      title,
      content,

      category_slugs:
        categorySlugs,

      project_slugs:
        projectSlugs,

      tag_slugs: tagSlugs,
    };

    /*
      create
    */

    if (mode === "create") {
      const { error } =
        await supabase
          .from("posts")
          .insert([payload]);

      if (error) {
        console.error(error);

        alert("글 저장 실패");

        return;
      }

      router.push("/");

      router.refresh();

      return;
    }

    /*
      edit
    */

    if (
      mode === "edit" &&
      postId
    ) {
      const { error } =
        await supabase
          .from("posts")
          .update(payload)
          .eq("id", postId);

      if (error) {
        console.error(error);

        alert("수정 실패");

        return;
      }

      router.push(
        `/post/${postId}`
      );

      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Categories */}

      <div
        style={{
          marginBottom: 24,
        }}
      >
        <label>
          Categories
        </label>

        <br />

        <select
          multiple
          value={categorySlugs}
          onChange={(e) =>
            setCategorySlugs(
              getSelectedValues(e)
            )
          }
          style={{
            width: "100%",
            minHeight: 120,
            padding: 8,
          }}
        >
          {menu.map((item) => (
            <option
              key={item.slug}
              value={item.slug}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Projects */}

      <div
        style={{
          marginBottom: 24,
        }}
      >
        <label>
          Projects
        </label>

        <br />

        <select
          multiple
          value={projectSlugs}
          onChange={(e) =>
            setProjectSlugs(
              getSelectedValues(e)
            )
          }
          style={{
            width: "100%",
            minHeight: 120,
            padding: 8,
          }}
        >
          {PROJECT_TREE.map(
            (project) => (
              <option
                key={project.slug}
                value={project.slug}
              >
                {project.name}
              </option>
            )
          )}
        </select>
      </div>

      {/* Tags */}

      <div
        style={{
          marginBottom: 24,
        }}
      >
        <label>
          Tags
        </label>

        <br />

        <select
          multiple
          value={tagSlugs}
          onChange={(e) =>
            setTagSlugs(
              getSelectedValues(e)
            )
          }
          style={{
            width: "100%",
            minHeight: 180,
            padding: 8,
          }}
        >
          {TAG_TREE.map((tag) => (
            <option
              key={tag.slug}
              value={tag.slug}
            >
              [{tag.group}]{" "}
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}

      <div
        style={{
          marginBottom: 16,
        }}
      >
        <label>
          Title
        </label>

        <br />

        <input
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: 8,
          }}
        />
      </div>

      {/* Markdown */}

      <MarkdownImageManager
        content={content}
        setContent={setContent}
      />

      {/* Submit */}

      <button
        type="submit"
        style={{
          position: "fixed",

          right: 24,

          bottom: 24,

          padding:
            "12px 22px",

          background:
            "#1e40af",

          color: "#fff",

          borderRadius: 8,

          cursor: "pointer",

          zIndex: 9999,
        }}
      >
        {mode === "create"
          ? "Submit"
          : "Update"}
      </button>
    </form>
  );
}