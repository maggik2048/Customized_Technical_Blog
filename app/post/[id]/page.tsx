import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import DrawingOverlay from "../../components/DrawingOverlay"; // 상대경로 확인..이건 drawing was possible in separated box. 

interface PostPageProps {
  params: { id?: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const postId = params?.id ?? "642b0d17-7938-4f2c-96ba-1e79ec8ff413";

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) return <div>에러: {error.message}</div>;
  if (!data) return <div>게시글이 존재하지 않습니다.</div>;

  return (
    <div className="document-font" style={{ padding: 40 }}>
      <h1 style={{ fontSize: 32 }}>{data.title}</h1>

      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            if (inline)
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

      <DrawingOverlay width={800} height={600} />
    </div>
  );
}