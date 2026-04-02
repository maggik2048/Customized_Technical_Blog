import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default async function PostPage(props: any) {
  const params = await props.params;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) return <div>에러: {error.message}</div>;

  return (
    <div style={{ padding: 40, color: "#111" }}> {/* 🔹 글자색 추가 */}
      <h1 style={{ fontSize: 32, color: "#111" }}>{data.title}</h1>

      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {data.content}
      </ReactMarkdown>
    </div>
  );
}