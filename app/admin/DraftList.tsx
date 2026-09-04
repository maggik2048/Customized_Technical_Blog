"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type DraftPost = {
  id: string;
  title: string;
  content: string;
  category_slugs: string[];
  project_slugs: string[];
  tag_slugs: string[];
  updated_at: string;
  created_at: string;
};

type Props = {
  onSelectDraft?: (draft: DraftPost) => void;
  onClose?: () => void;
};

export default function DraftList({ onSelectDraft, onClose }: Props) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_draft", true)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (err: any) {
      console.error("Error fetching drafts:", err);
      setError(err.message || "Failed to load drafts");
    } finally {
      setLoading(false);
    }
  };

  const loadDraft = (draft: DraftPost) => {
    if (onSelectDraft) {
      onSelectDraft(draft);
    } else {
      // 기본 동작: /write 페이지로 이동하면서 draft 데이터 전달
      router.push(`/write?draftId=${draft.id}`);
    }
  };

  const deleteDraft = async (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("이 임시 저장글을 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", draftId);

      if (error) throw error;

      setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    } catch (err: any) {
      console.error("Error deleting draft:", err);
      alert("삭제 실패: " + err.message);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "방금 전";
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  const getContentPreview = (content: string, maxLength: number = 100) => {
    const plainText = content.replace(/[#*`>_\-]/g, "").trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + "...";
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1a1a1a",
          borderRadius: 16,
          maxWidth: 800,
          width: "100%",
          maxHeight: "80vh",
          padding: 32,
          border: "1px solid #333",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              📝 임시 저장글
            </h2>
            <p style={{ fontSize: 14, color: "#888", margin: "4px 0 0 0" }}>
              총 {drafts.length}개의 임시 저장글이 있습니다
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              fontSize: 28,
              cursor: "pointer",
              padding: "4px 12px",
              borderRadius: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#333";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#888";
            }}
          >
            ✕
          </button>
        </div>

        {/* Refresh Button */}
        <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
          <button
            onClick={fetchDrafts}
            style={{
              padding: "6px 16px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            🔄 새로고침
          </button>
        </div>

        {/* Draft List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            marginRight: -8,
            paddingRight: 8,
          }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 200,
                color: "#888",
              }}
            >
              ⏳ 불러오는 중...
            </div>
          ) : error ? (
            <div
              style={{
                padding: 20,
                background: "#2a1a1a",
                borderRadius: 8,
                color: "#ef4444",
                textAlign: "center",
              }}
            >
              ❌ {error}
            </div>
          ) : drafts.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
                color: "#666",
              }}
            >
              <span style={{ fontSize: 48, marginBottom: 16 }}>📭</span>
              <p style={{ fontSize: 16 }}>저장된 임시 글이 없습니다</p>
              <p style={{ fontSize: 13, color: "#555" }}>
                글을 작성하면 자동으로 저장됩니다
              </p>
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => loadDraft(draft)}
                style={{
                  padding: "16px 20px",
                  marginBottom: 12,
                  background: "#111",
                  borderRadius: 10,
                  border: "1px solid #2a2a2a",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1a1a2a";
                  e.currentTarget.style.borderColor = "#3a3a5a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#111";
                  e.currentTarget.style.borderColor = "#2a2a2a";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: "#fff",
                        margin: "0 0 6px 0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {draft.title || "제목 없음"}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: "#999",
                        margin: "0 0 8px 0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {getContentPreview(draft.content)}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: "#666",
                        }}
                      >
                        🕐 {formatDate(draft.updated_at)}
                      </span>
                      {draft.category_slugs && draft.category_slugs.length > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#888",
                            background: "#1a1a2a",
                            padding: "2px 10px",
                            borderRadius: 12,
                          }}
                        >
                          📂 {draft.category_slugs[0]}
                        </span>
                      )}
                      {draft.project_slugs && draft.project_slugs.length > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#888",
                            background: "#1a2a1a",
                            padding: "2px 10px",
                            borderRadius: 12,
                          }}
                        >
                          🚀 {draft.project_slugs[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteDraft(draft.id, e)}
                    style={{
                      padding: "4px 12px",
                      background: "transparent",
                      color: "#666",
                      border: "1px solid #333",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 12,
                      transition: "all 0.2s",
                      marginLeft: 12,
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#2a1a1a";
                      e.currentTarget.style.color = "#ef4444";
                      e.currentTarget.style.borderColor = "#ef4444";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#666";
                      e.currentTarget.style.borderColor = "#333";
                    }}
                  >
                    🗑️ 삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: "1px solid #2a2a2a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#555" }}>
            💡 클릭하면 해당 글을 불러옵니다
          </span>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}