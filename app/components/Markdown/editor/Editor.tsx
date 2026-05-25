"use client";

import { useMemo, useState } from "react";

import { parseMarkdownAST } from "./parser/parseMarkdownAST";

import ASTRenderer from "./renderer/ASTRenderer";

import { astToMarkdown } from "./serializer/astToMarkdown";

export default function Editor() {
  const [text, setText] = useState(
`hello

- item1
- item2

\`\`\`ts
function test() {
    return 1;
}
\`\`\`
`
  );

  const ast = useMemo(() => {
    return parseMarkdownAST(text);
  }, [text]);

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
      }}
    >
      {/* EDITOR */}

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        style={{
          width: "50%",
          height: "100vh",
          fontFamily: "monospace",
          whiteSpace: "pre",
        }}
      />

      {/* RENDER */}

      <div
        style={{
          width: "50%",
          padding: 20,
        }}
      >
        <ASTRenderer ast={ast} />

        <hr />

        <pre>
          {astToMarkdown(ast)}
        </pre>
      </div>
    </div>
  );
}