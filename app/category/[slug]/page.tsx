import CategoryRenderer from "./CategoryRenderer";
import { supabase } from "@/lib/supabase";

export default async function CategoryPage(props: any) {
  const params = await props.params;

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, created_at, content")
    .eq("category", params.slug)
    .order("created_at", { ascending: false });

  if (error) {
    return <div>에러: {error.message}</div>;
  }

  return <CategoryRenderer posts={data || []} slug={params.slug} />;
}