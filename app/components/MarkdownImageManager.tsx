"use client";

import React, { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import TurndownService from "turndown";
import { supabase } from "@/lib/supabase";

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

export default function MarkdownImageManager({ content, setContent }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const turndownService = new TurndownService();

  // 🔹 수식 자동 감싸기
  const autoWrapMath = (text: string) => {
    const mathPattern = /(\\frac|\\rightarrow|dydx|\\[a-zA-Z]+|[a-zA-Z]\([a-zA-Z0-9,]+\))/;

    const lines = text.split("\n").map((line) => {
      if (mathPattern.test(line)) {
        if (!line.startsWith("$$") && !line.endsWith("$$")) {
          return "$$\n" + line + "\n$$";
        }
      }
      return line;
    });

    return lines.join("\n");
  };

  // 🔹 붙여넣기 이벤트 처리 (HTML/Text → Markdown + 코드 + 자동 수식)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    let markdown = "";

    if (html) {
      markdown = turndownService.turndown(html);

      // Unicode / ChatGPT 수식 → LaTeX
      markdown = markdown
        .replace(/\\=/g, "=")
        .replace(/\\\\/g, "\\")
        .replace(/dydx/g, "\\frac{dy}{dx}")
        .replace(/→/g, "\\rightarrow")
        .replace(/𝑥/g, "x")
        .replace(/𝑦/g, "y")
        .replace(/𝑓/g, "f");

      // 🔹 자동 수식 감싸기
      markdown = autoWrapMath(markdown);

      // 🔹 HTML 코드 블록 감지 시 wrapping
      if (!/```/.test(markdown) && /<pre>|<code>/.test(html)) {
        markdown = "```\n" + markdown + "\n```";
      }

    } else if (text) {
      // 일반 텍스트 → 코드 블록 + 언어 감지
      let lang = "";
      if (text.includes("import") || text.includes("const") || text.includes("function")) lang = "ts";
      else if (text.includes("def") || text.includes("import ")) lang = "python";

      markdown = "```" + lang + "\n" + text + "\n```";
    }

    setContent((prev) => prev + "\n" + markdown + "\n");
  };

  // 🔹 이미지 업로드
  const resizeImage = (file: File, maxSize = 1000): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height);
          width *= scale;
          height *= scale;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, file.type);
      };
    });
  };

  const handleInsertImage = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    try {
      const resizedBlob = await resizeImage(file, 1000);
      const fileName = `${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("imagebucket")
        .upload(fileName, resizedBlob);

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("imagebucket")
        .getPublicUrl(fileName);

      if (!urlData?.publicUrl) {
        alert("Failed to get public URL after upload.");
        return;
      }

      setContent((prev) => prev + `\n![](${urlData.publicUrl})\n`);
      e.target.value = "";
    } catch (err) {
      console.error(err);
      alert("Unexpected error during upload.");
    }
  };

  // 🔹 순수 이미지 URL 자동 Markdown 변환
  const renderContent = content.replace(
    /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
    "![]($1)"
  );

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          onClick={handleInsertImage}
          style={{
            padding: "6px 12px",
            background: "#1e40af",
            color: "#fff",
            borderRadius: 4,
            cursor: "pointer",
            marginBottom: 8,
          }}
        >
          Insert Image
        </button>
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
          placeholder="Write Markdown with KaTeX..."
          style={{
            width: "50%",
            height: 400,
            padding: 10,
            fontFamily: "monospace",
          }}
        />
        <div
          style={{
            width: "50%",
            height: 400,
            overflow: "auto",
            padding: 10,
            background: "#f5f5f5",
            borderRadius: 8,
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ inline, className, children, ...props }) {
                const text = String(children);
                if (inline || (text.length < 80 && !text.includes("\n"))) {
                  return (
                    <code
                      style={{
                        background: "#333",
                        padding: "2px 6px",
                        borderRadius: 4,
                        color: "#fff",
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                const match = /language-(\w+)/.exec(className || "");
                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match?.[1] || "text"}
                    PreTag="div"
                  >
                    {text}
                  </SyntaxHighlighter>
                );
              },
              img({ src, alt, ...props }) {
                return (
                  <img
                    src={src}
                    alt={alt}
                    style={{
                      maxWidth: "100%",
                      maxHeight: 300,
                      display: "block",
                      margin: "10px 0",
                      borderRadius: 6,
                    }}
                    {...props}
                  />
                );
              },
            }}
          >
            {renderContent || "Preview will appear here..."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}