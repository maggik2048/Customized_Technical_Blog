"use client";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function PostAdminActions({ postId }: { postId: string }) {
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) return alert("삭제 실패: " + error.message);
    alert("삭제 완료");
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <Link href={`/admin/edit/${postId}`}>
        <button style={{ padding: "6px 12px", background: "#f59e0b", color: "#fff" }}>수정</button>
      </Link>
      <button
        onClick={handleDelete}
        style={{ padding: "6px 12px", background: "#dc2626", color: "#fff" }}
      >
        삭제
      </button>
    </div>
  );
}