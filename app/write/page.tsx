import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default async function PostPage(props: any) {
  const params = props.params;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) return <div>에러: {error.message}</div>;

  return (
    <div className="document-font" style={{ padding: 40 }}>
      <h1 style={{ fontSize: 32 }}>{data.title}</h1>

      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            // ✅ inline code
            if (inline) {
              return (
                <code
                  style={{
                    background: "#eee",
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontSize: "0.9em",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // ✅ block code
            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match?.[1] || "text"}
                PreTag="div"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
        }}
      >
        {data.content}
      </ReactMarkdown>
    </div>
  );
}