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
  const [categories, setCategories] = useState<MetadataItem[]>([]);
  const [projects, setProjects] = useState<MetadataItem[]>([]);
  const [tags, setTags] = useState<MetadataItem[]>([]);

  /*
    selected metadata states
  */
  const [categorySlugs, setCategorySlugs] = useState<string[]>([]);
  const [projectSlugs, setProjectSlugs] = useState<string[]>([]);
  const [tagSlugs, setTagSlugs] = useState<string[]>([]);

  /*
    content states
  */
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commitPending, setCommitPending] = useState(false);

  /*
    post-processing toggle state - ENABLED by default
  */
  const [isPostProcessingEnabled, setIsPostProcessingEnabled] = useState(true);

  /*
    Add new item states
  */
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagGroup, setNewTagGroup] = useState("");
  const [isSubmittingTag, setIsSubmittingTag] = useState(false);

  /*
    metadata load
  */
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const data = await getRecentAccessMetadata();
        
        // Debug logging
        console.log('📊 Loaded metadata:', {
          categoriesCount: data.categories.length,
          projectsCount: data.projects.length,
          tagsCount: data.tags.length,
          firstFiveTags: data.tags.slice(0, 5),
          allTags: data.tags
        });
        
        setCategories(data.categories);
        setProjects(data.projects);
        setTags(data.tags);
      } catch (error) {
        console.error('Error loading metadata:', error);
      }
    };

    loadMetadata();
  }, []);

  /*
    default category initialize
  */
  useEffect(() => {
    if (!categories.length) return;
    if (mode !== "create") return;

    if (defaultCategory) {
      setCategorySlugs([defaultCategory]);
      return;
    }

    const fallback = categories[0]?.slug;
    if (!fallback) return;
    setCategorySlugs([fallback]);
  }, [categories, defaultCategory, mode]);

  /*
    edit mode fetch
  */
  useEffect(() => {
    if (mode !== "edit") return;
    if (!postId) return;

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

      if (!data) return;

      setTitle(data.title || "");
      setContent(data.content || "");
      setCategorySlugs(data.category_slugs || []);
      setProjectSlugs(data.project_slugs || []);
      setTagSlugs(data.tag_slugs || []);
      setCommitPending(data.commit_pending ?? false);
    };

    fetchPost();
  }, [mode, postId]);

  /*
    chrome extension import - only in browser environment
  */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const chromeAPI = (window as any).chrome;
    if (!chromeAPI) return;
    if (!chromeAPI.storage?.local) return;

    chromeAPI.storage.local.get(
      ["latest_post"],
      (result: any) => {
        if (!result.latest_post) return;
        setContent(result.latest_post);
      }
    );
  }, []);

  /*
    multi select helper
  */
  const getSelectedValues = (e: React.ChangeEvent<HTMLSelectElement>) => {
    return Array.from(e.target.selectedOptions).map((option) => option.value);
  };

  /*
    toggle post-processing handler
  */
  const togglePostProcessing = () => {
    setIsPostProcessingEnabled((prev) => !prev);
  };

  /*
    Add Category handlers
  */
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("카테고리 이름을 입력하세요");
      return;
    }

    const slug = newCategoryName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    if (!slug) {
      alert("유효한 slug를 생성할 수 없습니다");
      return;
    }

    setIsSubmittingCategory(true);

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name: newCategoryName.trim(), slug }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          alert(`"${newCategoryName}"은(는) 이미 존재하는 카테고리입니다`);
        } else {
          console.error("Error adding category:", error);
          alert("카테고리 추가 실패");
        }
        return;
      }

      setCategories((prev) => [...prev, { name: data.name, slug: data.slug }]);
      setCategorySlugs((prev) => [...prev, data.slug]);
      setNewCategoryName("");
      setIsAddingCategory(false);
    } catch (error) {
      console.error("Error:", error);
      alert("오류가 발생했습니다");
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  /*
    Add Project handlers
  */
  const handleAddProject = async () => {
    if (!newProjectName.trim()) {
      alert("프로젝트 이름을 입력하세요");
      return;
    }

    const slug = newProjectName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');

    if (!slug) {
      alert("유효한 slug를 생성할 수 없습니다");
      return;
    }

    setIsSubmittingProject(true);

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ name: newProjectName.trim(), slug }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          alert(`"${newProjectName}"은(는) 이미 존재하는 프로젝트입니다`);
        } else {
          console.error("Error adding project:", error);
          alert("프로젝트 추가 실패");
        }
        return;
      }

      setProjects((prev) => [...prev, { name: data.name, slug: data.slug }]);
      setProjectSlugs((prev) => [...prev, data.slug]);
      setNewProjectName("");
      setIsAddingProject(false);
    } catch (error) {
      console.error("Error:", error);
      alert("오류가 발생했습니다");
    } finally {
      setIsSubmittingProject(false);
    }
  };

  /*
    Add Tag handlers
  */
  const handleAddTag = async () => {
    if (!newTagName.trim()) {
      alert("태그 이름을 입력하세요");
      return;
    }

    const slug = newTagName
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (!slug) {
      alert("유효한 slug를 생성할 수 없습니다");
      return;
    }

    setIsSubmittingTag(true);

    try {
      const { data, error } = await supabase
        .from("tags")
        .insert([{ 
          name: newTagName.trim(), 
          slug,
          group_name: newTagGroup.trim() || null 
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          alert(`"${newTagName}"은(는) 이미 존재하는 태그입니다`);
        } else {
          console.error("Error adding tag:", error);
          alert("태그 추가 실패");
        }
        return;
      }

      setTags((prev) => [...prev, { 
        name: data.name, 
        slug: data.slug,
        group: data.group_name || undefined 
      }]);
      setTagSlugs((prev) => [...prev, data.slug]);
      setNewTagName("");
      setNewTagGroup("");
      setIsAddingTag(false);
    } catch (error) {
      console.error("Error:", error);
      alert("오류가 발생했습니다");
    } finally {
      setIsSubmittingTag(false);
    }
  };

  /*
    submit
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 내용을 입력하세요");
      return;
    }

    const payload = {
      title,
      content,
      commit_pending: commitPending,
      category: categorySlugs[0] || null,
      category_slugs: categorySlugs,
      project_slugs: projectSlugs,
      tag_slugs: tagSlugs,
    };

    if (mode === "create") {
      const { error } = await supabase.from("posts").insert([payload]);
      if (error) {
        console.error(error);
        alert("글 저장 실패");
        return;
      }
      router.push("/");
      router.refresh();
      return;
    }

    if (mode === "edit" && postId) {
      const { error } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", postId);
      if (error) {
        console.error(error);
        alert("수정 실패");
        return;
      }
      router.push(`/post/${postId}`);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Metadata Panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 24,
          marginBottom: 32,
          alignItems: "start",
        }}
      >
        {/* Projects */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <label style={{ fontWeight: 700 }}>Projects</label>
            <button
              type="button"
              onClick={() => {
                setIsAddingProject(!isAddingProject);
                if (isAddingProject) setNewProjectName("");
              }}
              style={{
                padding: "4px 12px",
                background: isAddingProject ? "#dc2626" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "12px",
                transition: "all 0.2s",
              }}
            >
              {isAddingProject ? "✕" : "+ New"}
            </button>
          </div>

          {isAddingProject && (
            <div
              style={{
                marginBottom: 8,
                padding: 10,
                background: "#1a1a1a",
                borderRadius: 6,
                border: "1px solid #333",
              }}
            >
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddProject();
                  }
                  if (e.key === "Escape") {
                    setIsAddingProject(false);
                    setNewProjectName("");
                  }
                }}
                autoFocus
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  marginBottom: 6,
                  background: "#111",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: 4,
                  fontSize: "13px",
                }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={handleAddProject}
                  disabled={isSubmittingProject || !newProjectName.trim()}
                  style={{
                    flex: 1,
                    padding: "4px 10px",
                    background: isSubmittingProject || !newProjectName.trim() ? "#555" : "#22c55e",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: isSubmittingProject || !newProjectName.trim() ? "not-allowed" : "pointer",
                    opacity: isSubmittingProject || !newProjectName.trim() ? 0.6 : 1,
                    fontSize: "12px",
                  }}
                >
                  {isSubmittingProject ? "..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingProject(false);
                    setNewProjectName("");
                  }}
                  style={{
                    padding: "4px 10px",
                    background: "#555",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <select
            multiple
            value={projectSlugs}
            onChange={(e) => setProjectSlugs(getSelectedValues(e))}
            style={{
              width: "100%",
              minHeight: 260,
              padding: 8,
              border: "1px solid #444",
              borderRadius: 8,
              background: "#111",
              color: "#fff",
            }}
          >
            {projects.length === 0 ? (
              <option value="" disabled>No projects found</option>
            ) : (
              projects.map((project) => (
                <option key={project.slug} value={project.slug}>
                  {project.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Categories */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <label style={{ fontWeight: 700 }}>Categories</label>
            <button
              type="button"
              onClick={() => {
                setIsAddingCategory(!isAddingCategory);
                if (isAddingCategory) setNewCategoryName("");
              }}
              style={{
                padding: "4px 12px",
                background: isAddingCategory ? "#dc2626" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "12px",
                transition: "all 0.2s",
              }}
            >
              {isAddingCategory ? "✕" : "+ New"}
            </button>
          </div>

          {isAddingCategory && (
            <div
              style={{
                marginBottom: 8,
                padding: 10,
                background: "#1a1a1a",
                borderRadius: 6,
                border: "1px solid #333",
              }}
            >
              <input
                type="text"
                placeholder="Category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                  if (e.key === "Escape") {
                    setIsAddingCategory(false);
                    setNewCategoryName("");
                  }
                }}
                autoFocus
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  marginBottom: 6,
                  background: "#111",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: 4,
                  fontSize: "13px",
                }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  disabled={isSubmittingCategory || !newCategoryName.trim()}
                  style={{
                    flex: 1,
                    padding: "4px 10px",
                    background: isSubmittingCategory || !newCategoryName.trim() ? "#555" : "#22c55e",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: isSubmittingCategory || !newCategoryName.trim() ? "not-allowed" : "pointer",
                    opacity: isSubmittingCategory || !newCategoryName.trim() ? 0.6 : 1,
                    fontSize: "12px",
                  }}
                >
                  {isSubmittingCategory ? "..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategoryName("");
                  }}
                  style={{
                    padding: "4px 10px",
                    background: "#555",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <select
            multiple
            value={categorySlugs}
            onChange={(e) => setCategorySlugs(getSelectedValues(e))}
            style={{
              width: "100%",
              minHeight: 260,
              padding: 8,
              border: "1px solid #444",
              borderRadius: 8,
              background: "#111",
              color: "#fff",
            }}
          >
            {categories.length === 0 ? (
              <option value="" disabled>No categories found</option>
            ) : (
              categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Tags */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <label style={{ fontWeight: 700 }}>Tags</label>
            <button
              type="button"
              onClick={() => {
                setIsAddingTag(!isAddingTag);
                if (isAddingTag) {
                  setNewTagName("");
                  setNewTagGroup("");
                }
              }}
              style={{
                padding: "4px 12px",
                background: isAddingTag ? "#dc2626" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: "12px",
                transition: "all 0.2s",
              }}
            >
              {isAddingTag ? "✕" : "+ New"}
            </button>
          </div>

          {isAddingTag && (
            <div
              style={{
                marginBottom: 8,
                padding: 10,
                background: "#1a1a1a",
                borderRadius: 6,
                border: "1px solid #333",
              }}
            >
              <input
                type="text"
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                  if (e.key === "Escape") {
                    setIsAddingTag(false);
                    setNewTagName("");
                    setNewTagGroup("");
                  }
                }}
                autoFocus
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  marginBottom: 6,
                  background: "#111",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: 4,
                  fontSize: "13px",
                }}
              />
              <input
                type="text"
                placeholder="Group (optional)"
                value={newTagGroup}
                onChange={(e) => setNewTagGroup(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  marginBottom: 6,
                  background: "#111",
                  color: "#888",
                  border: "1px solid #444",
                  borderRadius: 4,
                  fontSize: "12px",
                }}
              />
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={isSubmittingTag || !newTagName.trim()}
                  style={{
                    flex: 1,
                    padding: "4px 10px",
                    background: isSubmittingTag || !newTagName.trim() ? "#555" : "#22c55e",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: isSubmittingTag || !newTagName.trim() ? "not-allowed" : "pointer",
                    opacity: isSubmittingTag || !newTagName.trim() ? 0.6 : 1,
                    fontSize: "12px",
                  }}
                >
                  {isSubmittingTag ? "..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingTag(false);
                    setNewTagName("");
                    setNewTagGroup("");
                  }}
                  style={{
                    padding: "4px 10px",
                    background: "#555",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <select
            multiple
            value={tagSlugs}
            onChange={(e) => setTagSlugs(getSelectedValues(e))}
            style={{
              width: "100%",
              minHeight: 260,
              padding: 8,
              border: "1px solid #444",
              borderRadius: 8,
              background: "#111",
              color: "#fff",
            }}
          >
            {tags.length === 0 ? (
              <option value="" disabled>⚠️ No tags found - check console for errors</option>
            ) : (
              tags.map((tag) => (
                <option key={tag.slug} value={tag.slug}>
                  {tag.group ? `[${tag.group}] ` : "[no group] "}
                  {tag.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <label>Title</label>
        <br />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 8,
            border: "1px solid #444",
            background: "#111",
            color: "#fff",
          }}
        />
      </div>

      {/* Post-Processing Toggle Button */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "8px 12px",
          border: "1px solid #333",
          borderRadius: "8px",
          backgroundColor: "#1a1a1a",
        }}
      >
        <span style={{ fontWeight: 700, color: "#ccc" }}>
          Post-Processing Rules:
        </span>
        <button
          type="button"
          onClick={togglePostProcessing}
          style={{
            padding: "6px 16px",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "14px",
            background: isPostProcessingEnabled ? "#22c55e" : "#ef4444",
            color: "#fff",
            transition: "all 0.2s ease",
            minWidth: "80px",
          }}
        >
          {isPostProcessingEnabled ? "🟢 ENABLED" : "🔴 DISABLED"}
        </button>
        <span style={{ fontSize: "12px", color: "#888", marginLeft: "8px" }}>
          {isPostProcessingEnabled
            ? "All rules are active"
            : "All rules are temporarily disabled"}
        </span>
      </div>

      {/* Markdown */}
      <MarkdownImageManager
        content={content}
        setContent={setContent}
        disablePostProcessing={!isPostProcessingEnabled}
      />

      {/* Commit Ready */}
      <div style={{ marginTop: 24, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => setCommitPending((prev) => !prev)}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            background: commitPending ? "#f97316" : "#333",
            color: "#fff",
          }}
        >
          {commitPending ? "🟠 Commit Ready" : "⚫ Commit Ready"}
        </button>
      </div>

      {/* Submit */}
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
          border: "none",
        }}
      >
        {mode === "create" ? "Submit" : "Update"}
      </button>
    </form>
  );
}