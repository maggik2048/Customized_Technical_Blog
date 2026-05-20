"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { supabase } from "@/lib/supabase";

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

/* =========================
   HTML → Markdown (핵심)
========================= */
function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  let out = "";

  const walk = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      out += node.textContent;
      return;
    }

    const el = node as HTMLElement;

    switch (el.tagName) {
      case "H1":
        out += `\n# ${el.textContent}\n\n`;
        break;

      case "H2":
        out += `\n## ${el.textContent}\n\n`;
        break;

      case "H3":
        out += `\n### ${el.textContent}\n\n`;
        break;

      case "P":
        out += `\n${el.textContent}\n\n`;
        break;

      case "BR":
        out += "\n";
        break;

      case "STRONG":
      case "B":
        out += `**${el.textContent}**`;
        break;

      case "EM":
      case "I":
        out += `*${el.textContent}*`;
        break;

      case "UL":
        el.querySelectorAll("li").forEach((li) => {
          out += `- ${li.textContent}\n`;
        });
        out += "\n";
        break;

      case "OL":
        let i = 1;
        el.querySelectorAll("li").forEach((li) => {
          out += `${i++}. ${li.textContent}\n`;
        });
        out += "\n";
        break;

      default:
        el.childNodes.forEach(walk);
    }
  };

  doc.body.childNodes.forEach(walk);

  return out.trim();
}

/* =========================
   MAIN COMPONENT
========================= */
export default function MarkdownImageManager({
  content,
  setContent,
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  /* =========================
     IMAGE RESIZE
  ========================= */
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
        });
      };
    });
  };

  /* =========================
     IMAGE UPLOAD
  ========================= */
  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return;

    const resized = await resizeImage(file, 1000);
    const fileName = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("imagebucket")
      .upload(fileName, resized);

    if (error) return;

    const { data } = supabase.storage
      .from("imagebucket")
      .getPublicUrl(fileName);

    setContent((prev) => prev + `\n![](${data.publicUrl})\n`);
  };

  /* =========================
      PASTE HANDLER (핵심)
  ========================= */
  const handlePaste = (
    e: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const html = e.clipboardData.getData("text/html");
    const text = e.clipboardData.getData("text/plain");

    e.preventDefault();

    let parsed = "";

    if (html && html.includes("<")) {
      parsed = htmlToMarkdown(html);
    } else {
      parsed = text
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n");
    }

    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    setContent(
      (prev) =>
        prev.substring(0, start) +
        parsed +
        prev.substring(end)
    );
  };

  /* =========================
     AUTO LINK IMAGE
========================= */
  const renderContent = content.replace(
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
    "![]($1)"
  );

  return (
    <div>
      {/* IMAGE UPLOAD */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleInsertImage}>
          Insert Image
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {/* EDITOR */}
      <div style={{ display: "flex", gap: 20 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
          style={{
            width: "50%",
            height: 400,
            fontFamily: "monospace",
          }}
        />

        {/* PREVIEW */}
        <div
          style={{
            width: "50%",
            height: 400,
            overflow: "auto",
            background: "#111",
            color: "#fff",
            padding: 10,
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ inline, className, children }) {
                const text = String(children);

                if (
                  inline ||
                  (text.length < 80 && !text.includes("\n"))
                ) {
                  return (
                    <code
                      style={{
                        background: "#333",
                        padding: "2px 6px",
                      }}
                    >
                      {children}
                    </code>
                  );
                }

                const match = /language-(\w+)/.exec(
                  className || ""
                );

                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match?.[1] || "text"}
                  >
                    {text}
                  </SyntaxHighlighter>
                );
              },

              img({ src }) {
                return (
                  <img
                    src={src}
                    style={{ maxWidth: "100%" }}
                  />
                );
              },
            }}
          >
            {renderContent || "Preview..."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}