"use client";

import { useParams } from "next/navigation";
import PostForm from "@/app/admin/PostForm";

export default function EditPage() {
  const params = useParams();

  const id = params?.id as string;

  console.log("EditPage UUID:", id);

  if (!id) {
    return <div>잘못된 접근: id 없음</div>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Modify Post</h1>
      <PostForm mode="edit" postId={id} />
    </div>
  );
}