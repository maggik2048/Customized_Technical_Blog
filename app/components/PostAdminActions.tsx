"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostAdminActions({ postId }: { postId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }

    alert("삭제 완료");

    // 🔥 새로고침 대신 이동 (UX 개선)
    router.push("/");
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Link href={`/admin/edit/${postId}`}>
        <button
          style={{
            padding: "6px 12px",
            background: "#f59e0b",
            color: "#fff",
            borderRadius: 4,
          }}
        >
          수정
        </button>
      </Link>

      <button
        onClick={handleDelete}
        style={{
          padding: "6px 12px",
          background: "#dc2626",
          color: "#fff",
          borderRadius: 4,
        }}
      >
        삭제
      </button>
    </div>
  );
}