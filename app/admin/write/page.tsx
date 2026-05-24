"use client";

import PostForm from "@/app/admin/PostForm";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function WritePage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return (
    <div style={{ padding: 40 }}>
      <h1>Write Post</h1>

      <PostForm
        mode="create"
        defaultCategory={category ?? undefined}
      />
    </div>
  );
}