"use client";

import { useParams } from "next/navigation";
import PostForm from "@/app/admin/PostForm";

export default function EditPage() {
  const { id } = useParams();

  return (
    <div style={{ padding: 40 }}>
      <h1>Modify Post</h1>
      <PostForm mode="edit" postId={id as string} />
    </div>
  );
}