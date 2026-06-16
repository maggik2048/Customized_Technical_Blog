import CategoryRenderer from "./CategoryRenderer";
import { supabase } from "@/lib/supabase";

export default async function CategoryPage(props: any) {
  const params = await props.params;

  // Fetch category-specific posts
  const { data, error } = await supabase
    .from("posts")
    .select("id, title, created_at, content")
    .eq("category", params.slug)
    .order("created_at", { ascending: false });

  if (error) {
    return <div>에러: {error.message}</div>;
  }

  // Fetch ALL posts (needed for CategoryPostBoxRenderer)
  const { data: allPosts, error: allPostsError } = await supabase
    .from("posts")
    .select("id, title, created_at, content, category")
    .order("created_at", { ascending: false });

  if (allPostsError) {
    console.error("Error fetching all posts:", allPostsError);
  }

  return (
    <CategoryRenderer 
      posts={data || []} 
      allPosts={allPosts || []}
      slug={params.slug} 
    />
  );
}