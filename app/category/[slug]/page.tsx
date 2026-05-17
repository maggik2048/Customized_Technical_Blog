"use client";

import CategoryRenderer from "./CategoryRenderer";

import { supabase } from "@/lib/supabase";

export default async function CategoryPage(
  props: any
) {
  const params =
    await props.params;

  // =========================
  // CATEGORY POSTS
  // =========================

  const {
    data: categoryPosts,
    error:
      categoryError,
  } = await supabase
    .from("posts")
    .select(
      "id, title, created_at, content, category"
    )
    .eq(
      "category",
      params.slug
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (categoryError) {
    return (
      <div>
        에러:{" "}
        {
          categoryError.message
        }
      </div>
    );
  }

  // =========================
  // ALL POSTS
  // =========================

  const {
    data: allPosts,
    error: allError,
  } = await supabase
    .from("posts")
    .select(
      "id, created_at"
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (allError) {
    return (
      <div>
        에러:{" "}
        {allError.message}
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================

  return (
    <CategoryRenderer
      posts={
        categoryPosts || []
      }
      allPosts={
        allPosts || []
      }
      slug={params.slug}
    />
  );
}