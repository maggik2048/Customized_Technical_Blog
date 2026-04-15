import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import "katex/dist/katex.min.css";

export default function MathDocPanel({ content }) {
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        borderLeft: "1px solid #ddd",
        overflowY: "auto",
        fontSize: 16,
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}