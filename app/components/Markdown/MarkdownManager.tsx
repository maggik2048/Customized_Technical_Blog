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
   TABLE PARSER
========================= */
function tableToMarkdown(table: HTMLTableElement): string {
  const rows = Array.from(table.querySelectorAll("tr"));
  if (!rows.length) return "";

  const parsedRows = rows.map((row) => {
    const cells = Array.from(row.querySelectorAll("th, td"));
    return cells.map((c) => c.textContent?.trim() || "");
  });

  const header = parsedRows[0] || [];
  const body = parsedRows.slice(1);

  let md = "";

  if (header.length) {
    md += `| ${header.join(" | ")} |\n`;
    md += `| ${header.map(() => "---").join(" | ")} |\n`;
  }

  body.forEach((r) => {
    md += `| ${r.join(" | ")} |\n`;
  });

  return md + "\n";
}

/* =========================
   HTML → Markdown PARSER
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
        return;

      case "H2":
        out += `\n## ${el.textContent}\n\n`;
        return;

      case "H3":
        out += `\n### ${el.textContent}\n\n`;
        return;

      case "P":
        out += `\n${el.textContent}\n\n`;
        return;

      case "DIV":
        out += `\n${el.textContent}\n`;
        return;

      case "BR":
        out += "\n";
        return;

      case "STRONG":
      case "B":
        out += `**${el.textContent}**`;
        return;

      case "EM":
      case "I":
        out += `*${el.textContent}*`;
        return;

      case "UL":
        el.querySelectorAll("li").forEach((li) => {
          out += `- ${li.textContent}\n`;
        });
        out += "\n";
        return;

      case "OL":
        let i = 1;
        el.querySelectorAll("li").forEach((li) => {
          out += `${i++}. ${li.textContent}\n`;
        });
        out += "\n";
        return;

      case "LI":
        out += `\n- ${el.textContent}`;
        return;

      /* 🔥 TABLE SUPPORT */
      case "TABLE":
        out += "\n" + tableToMarkdown(el as HTMLTableElement) + "\n";
        return;

      default:
        el.childNodes.forEach(walk);
    }
  };

  doc.body.childNodes.forEach(walk);

  return out
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* =========================
   MAIN COMPONENT
========================= */
export default function MarkdownImageManager({
  content,
  setContent,
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setContent((prev) =>
      prev.substring(0, start) +
      parsed +
      prev.substring(end)
    );
  };

  const renderContent = content.replace(
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
    "![]($1)"
  );

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={handleInsertImage}>
          Insert Image
        </button>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

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
          >
            {renderContent || "Preview..."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}