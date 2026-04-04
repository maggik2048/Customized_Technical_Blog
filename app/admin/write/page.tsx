"use client";

import PostForm from "@/app/admin/PostForm";

export default function WritePage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Write Post</h1>
      <PostForm mode="create" />
    </div>
  );
}