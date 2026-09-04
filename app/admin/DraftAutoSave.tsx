"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import DraftList from "./DraftList";

type DraftAutoSaveProps = {
  mode: "create" | "edit";
  postId?: string;
  title: string;
  content: string;
  categorySlugs: string[];
  projectSlugs: string[];
  tagSlugs: string[];
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategorySlugsChange: (slugs: string[]) => void;
  onProjectSlugsChange: (slugs: string[]) => void;
  onTagSlugsChange: (slugs: string[]) => void;
  onDraftLoaded?: (draft: any) => void;
  onClearDraft?: () => void;
};

export default function DraftAutoSave({
  mode,
  postId,
  title,
  content,
  categorySlugs,
  projectSlugs,
  tagSlugs,
  onTitleChange,
  onContentChange,
  onCategorySlugsChange,
  onProjectSlugsChange,
  onTagSlugsChange,
  onDraftLoaded,
  onClearDraft,
}: DraftAutoSaveProps) {
  /*
    Auto-save states
  */
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isDraftPostId, setIsDraftPostId] = useState<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  /*
    DraftList states
  */
  const [showDraftList, setShowDraftList] = useState(false);

  /*
    Auto-save function
  */
  const autoSave = useCallback(async () => {
    // Only auto-save if there's content or title
    if (!title.trim() && !content.trim()) {
      setAutoSaveStatus("idle");
      return;
    }

    // Don't auto-save if we're in edit mode (already have a post)
    if (mode === "edit" && postId) {
      setAutoSaveStatus("idle");
      return;
    }

    setAutoSaveStatus("saving");

    try {
      const payload = {
        title: title || "Untitled Draft",
        content: content || "",
        commit_pending: false,
        category: categorySlugs[0] || null,
        category_slugs: categorySlugs,
        project_slugs: projectSlugs,
        tag_slugs: tagSlugs,
        is_draft: true,
        updated_at: new Date().toISOString(),
      };

      let result;

      if (isDraftPostId) {
        // Update existing draft
        const { data, error } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", isDraftPostId)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from("posts")
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        result = data;
        setIsDraftPostId(result.id);
      }

      setAutoSaveStatus("saved");
      setLastSavedAt(new Date());
    } catch (error) {
      console.error("Auto-save error:", error);
      setAutoSaveStatus("error");
    }
  }, [title, content, categorySlugs, projectSlugs, tagSlugs, mode, postId, isDraftPostId]);

  /*
    Auto-save timer - every 10 seconds
  */
  useEffect(() => {
    if (!isAutoSaveEnabled) {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
      return;
    }

    // Don't auto-save in edit mode
    if (mode === "edit" && postId) {
      return;
    }

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
    }

    // Set up new timer (10 seconds)
    autoSaveTimerRef.current = setInterval(() => {
      autoSave();
    }, 10000);

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [autoSave, isAutoSaveEnabled, mode, postId]);

  /*
    Save draft on page unload (before close/refresh)
  */
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (title.trim() || content.trim()) {
        autoSave();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [autoSave, title, content]);

  /*
    Load draft from localStorage on mount
  */
  useEffect(() => {
    if (mode === "create") {
      const savedDraft = localStorage.getItem("post_draft");
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.title) onTitleChange(draft.title);
          if (draft.content) onContentChange(draft.content);
          if (draft.categorySlugs) onCategorySlugsChange(draft.categorySlugs);
          if (draft.projectSlugs) onProjectSlugsChange(draft.projectSlugs);
          if (draft.tagSlugs) onTagSlugsChange(draft.tagSlugs);
          if (draft.draftId) setIsDraftPostId(draft.draftId);
          if (onDraftLoaded) onDraftLoaded(draft);
        } catch (e) {
          console.error("Failed to load draft:", e);
        }
      }
    }

    isInitialMount.current = false;
  }, [mode]);

  /*
    Save draft to localStorage on changes
  */
  useEffect(() => {
    if (isInitialMount.current) return;

    const draft = {
      title,
      content,
      categorySlugs,
      projectSlugs,
      tagSlugs,
      draftId: isDraftPostId,
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem("post_draft", JSON.stringify(draft));
    } catch (e) {
      console.error("Failed to save draft to localStorage:", e);
    }
  }, [title, content, categorySlugs, projectSlugs, tagSlugs, isDraftPostId]);

  /*
    Clear draft
  */
  const clearDraft = () => {
    localStorage.removeItem("post_draft");
    setIsDraftPostId(null);
    setAutoSaveStatus("idle");
    setLastSavedAt(null);
    if (onClearDraft) onClearDraft();
  };

  /*
    DraftList handlers
  */
  const handleOpenDraftList = () => {
    setShowDraftList(true);
  };

  const handleCloseDraftList = () => {
    setShowDraftList(false);
  };

  const handleSelectDraft = (draft: any) => {
    onTitleChange(draft.title || "");
    onContentChange(draft.content || "");
    onCategorySlugsChange(draft.category_slugs || []);
    onProjectSlugsChange(draft.project_slugs || []);
    onTagSlugsChange(draft.tag_slugs || []);
    setIsDraftPostId(draft.id);
    setShowDraftList(false);
    
    // localStorage에도 저장
    const draftData = {
      title: draft.title || "",
      content: draft.content || "",
      categorySlugs: draft.category_slugs || [],
      projectSlugs: draft.project_slugs || [],
      tagSlugs: draft.tag_slugs || [],
      draftId: draft.id,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("post_draft", JSON.stringify(draftData));
  };

  /*
    toggle auto-save handler
  */
  const toggleAutoSave = () => {
    setIsAutoSaveEnabled((prev) => !prev);
    if (isAutoSaveEnabled) {
      setAutoSaveStatus("idle");
    }
  };

  return (
    <>
      {/* Auto-Save Status Bar */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          background: "#1a1a1a",
          borderRadius: 8,
          border: "1px solid #333",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: "13px", color: "#ccc" }}>
            💾 Auto-Save:
          </span>
          <button
            type="button"
            onClick={toggleAutoSave}
            style={{
              padding: "4px 12px",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "12px",
              background: isAutoSaveEnabled ? "#22c55e" : "#ef4444",
              color: "#fff",
            }}
          >
            {isAutoSaveEnabled ? "ON" : "OFF"}
          </button>
          <span style={{ fontSize: "12px", color: "#888" }}>
            {mode === "edit" && postId ? "(Edit mode - auto-save disabled)" : "Every 10 seconds"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Drafts List Button */}
          <button
            type="button"
            onClick={handleOpenDraftList}
            style={{
              padding: "4px 14px",
              background: "#8b5cf6",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            📋 Drafts
          </button>
          {autoSaveStatus === "saving" && (
            <span style={{ fontSize: "12px", color: "#fbbf24" }}>⏳ Saving...</span>
          )}
          {autoSaveStatus === "saved" && (
            <span style={{ fontSize: "12px", color: "#22c55e" }}>
              ✅ Saved {lastSavedAt ? `at ${lastSavedAt.toLocaleTimeString()}` : ""}
            </span>
          )}
          {autoSaveStatus === "error" && (
            <span style={{ fontSize: "12px", color: "#ef4444" }}>❌ Save failed</span>
          )}
          {mode === "create" && isDraftPostId && (
            <span style={{ fontSize: "11px", color: "#888" }}>
              Draft ID: {isDraftPostId.slice(0, 8)}...
            </span>
          )}
        </div>
      </div>

      {/* DraftList Modal */}
      {showDraftList && (
        <DraftList
          onSelectDraft={handleSelectDraft}
          onClose={handleCloseDraftList}
        />
      )}
    </>
  );
}