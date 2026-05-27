"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import MarkdownImageManager from "@/app/components/Markdown/processors/MarkdownPipeline/MarkdownManager";

import { getRecentAccessMetadata } from "./GetRecentAccess";

type MetadataItem = {
  name: string;
  slug: string;

  group?: string;
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
    metadata menu states
  */

  const [
    categories,
    setCategories,
  ] = useState<
    MetadataItem[]
  >([]);

  const [
    projects,
    setProjects,
  ] = useState<
    MetadataItem[]
  >([]);

  const [tags, setTags] =
    useState<MetadataItem[]>(
      []
    );

  /*
    selected metadata states
  */

  const [
    categorySlugs,
    setCategorySlugs,
  ] = useState<string[]>([]);

  const [
    projectSlugs,
    setProjectSlugs,
  ] = useState<string[]>([]);

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
    metadata load
  */

  useEffect(() => {
    const loadMetadata =
      async () => {
        const data =
          await getRecentAccessMetadata();

        setCategories(
          data.categories
        );

        setProjects(
          data.projects
        );

        setTags(data.tags);
      };

    loadMetadata();
  }, []);

  /*
    default category initialize
  */

  useEffect(() => {
    if (!categories.length)
      return;

    if (mode !== "create")
      return;

    if (defaultCategory) {
      setCategorySlugs([
        defaultCategory,
      ]);

      return;
    }

    const fallback =
      categories[0]?.slug;

    if (!fallback) return;

    setCategorySlugs([
      fallback,
    ]);
  }, [
    categories,
    defaultCategory,
    mode,
  ]);

  /*
    edit mode fetch
  */

  useEffect(() => {
    if (mode !== "edit")
      return;

    if (!postId) return;

    const fetchPost =
      async () => {
        const {
          data,
          error,
        } = await supabase
          .from("posts")
          .select("*")
          .eq("id", postId)
          .single();

        if (error) {
          console.error(error);

          return;
        }

        if (!data) return;

        setTitle(
          data.title || ""
        );

        setContent(
          data.content || ""
        );

        setCategorySlugs(
          data.category_slugs ||
            []
        );

        setProjectSlugs(
          data.project_slugs ||
            []
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
    if (
      typeof chrome ===
      "undefined"
    )
      return;

    if (!chrome.storage?.local)
      return;

    chrome.storage.local.get(
      ["latest_post"],
      (result) => {
        if (
          !result.latest_post
        )
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
    ).map(
      (option) => option.value
    );
  };

  /*
    submit
  */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title || !content) {
      alert(
        "제목과 내용을 입력하세요"
      );

      return;
    }

    const payload = {
      title,

      content,

      /*
        legacy fallback
      */

      category:
        categorySlugs[0] ||
        null,

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
      {/* Metadata Panel */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "1fr 1fr 1fr",

          gap: 24,

          marginBottom: 32,

          alignItems: "start",
        }}
      >
        {/* Projects */}

        <div>
          <label
            style={{
              fontWeight: 700,

              display: "block",

              marginBottom: 8,
            }}
          >
            Projects
          </label>

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

              minHeight: 260,

              padding: 8,

              border:
                "1px solid #444",

              borderRadius: 8,

              background:
                "#111",

              color: "#fff",
            }}
          >
            {projects.map(
              (project) => (
                <option
                  key={
                    project.slug
                  }
                  value={
                    project.slug
                  }
                >
                  {project.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* Categories */}

        <div>
          <label
            style={{
              fontWeight: 700,

              display: "block",

              marginBottom: 8,
            }}
          >
            Categories
          </label>

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

              minHeight: 260,

              padding: 8,

              border:
                "1px solid #444",

              borderRadius: 8,

              background:
                "#111",

              color: "#fff",
            }}
          >
            {categories.map(
              (item) => (
                <option
                  key={item.slug}
                  value={item.slug}
                >
                  {item.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* Tags */}

        <div>
          <label
            style={{
              fontWeight: 700,

              display: "block",

              marginBottom: 8,
            }}
          >
            Tags
          </label>

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

              minHeight: 260,

              padding: 8,

              border:
                "1px solid #444",

              borderRadius: 8,

              background:
                "#111",

              color: "#fff",
            }}
          >
            {tags.map((tag) => (
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
      </div>

      {/* Title */}

      <div
        style={{
          marginBottom: 16,
        }}
      >
        <label>Title</label>

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

            borderRadius: 8,

            border:
              "1px solid #444",

            background:
              "#111",

            color: "#fff",
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

          border: "none",
        }}
      >
        {mode === "create"
          ? "Submit"
          : "Update"}
      </button>
    </form>
  );
}