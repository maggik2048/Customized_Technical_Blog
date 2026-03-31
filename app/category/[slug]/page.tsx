import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default async function CategoryPage(props: any) {
  const params = await props.params;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("category", params.slug)
    .order("created_at", { ascending: false });

  if (error) {
    return <div>에러: {error.message}</div>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        Category: {params.slug}
      </h1>

      {data?.map((post) => (
        <div key={post.id} style={{ marginBottom: 30 }}>
          <h2>{post.title}</h2>

          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      ))}
    </div>
  );
}