"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostAdminActions({ postId }: { postId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure that you want to delete this post?")) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      alert("Deletion Failed: " + error.message);
      return;
    }

    alert("Deletion Completed");


    router.push("/");
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Link href={`/admin/edit/${postId}`}>
        <button
          style={{
            padding: "6px 12px",
            background: "#414344",
            color: "#fff",
            borderRadius: 20,
          }}
        >
          Modify Post
        </button>
      </Link>

      <button
        onClick={handleDelete}
        style={{
          padding: "6px 12px",
          background: "#616465",
          color: "#fff",
          borderRadius: 1,
        }}
      >
        Delete Post
      </button>
    </div>
  );
}