"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
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
function tableToMarkdown(
  table: HTMLTableElement
): string {
  const rows = Array.from(
    table.querySelectorAll("tr")
  );

  if (!rows.length) return "";

  const parsedRows = rows.map((row) => {
    const cells = Array.from(
      row.querySelectorAll("th, td")
    );

    return cells.map(
      (c) => c.textContent?.trim() || ""
    );
  });

  const header = parsedRows[0] || [];
  const body = parsedRows.slice(1);

  let md = "";

  if (header.length) {
    md += `| ${header.join(" | ")} |\n`;
    md += `| ${header
      .map(() => "---")
      .join(" | ")} |\n`;
  }

  body.forEach((r) => {
    md += `| ${r.join(" | ")} |\n`;
  });

  return md + "\n";
}

/* =========================
   HTML → MARKDOWN
========================= */
function htmlToMarkdown(html: string): string {
  const doc = new DOMParser().parseFromString(
    html,
    "text/html"
  );

  let out = "";

  const walk = (node: ChildNode) => {
    /* ================= TEXT ================= */
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";

      out += text.replace(/\s*\n\s*/g, "\n");

      return;
    }

    const el = node as HTMLElement;

    switch (el.tagName) {
      /* ================= HEADINGS ================= */
      case "H1":
        out += `\n# ${el.textContent?.trim()}\n\n`;
        return;

      case "H2":
        out += `\n## ${el.textContent?.trim()}\n\n`;
        return;

      case "H3":
        out += `\n### ${el.textContent?.trim()}\n\n`;
        return;

      /* ================= PARAGRAPH ================= */
      case "P":
        out += `\n${el.textContent?.trim()}\n\n`;
        return;

      /* ================= DIV ================= */
      case "DIV": {
        const text = el.textContent?.trim();

        if (!text) return;

        const hasBlockChild = Array.from(
          el.children
        ).some((child) =>
          [
            "DIV",
            "P",
            "H1",
            "H2",
            "H3",
            "UL",
            "OL",
            "TABLE",
          ].includes(child.tagName)
        );

        // block 구조면 recursive
        if (hasBlockChild) {
          el.childNodes.forEach(walk);

          if (!out.endsWith("\n\n")) {
            out += "\n";
          }

          return;
        }

        out += `${text}\n\n`;

        return;
      }

      /* ================= SPAN ================= */
      case "SPAN": {
        const text = el.textContent?.trim();

        if (!text) return;

        const next = el.nextSibling;

        // GPT clipboard 대응
        if (
          next &&
          next.nodeName === "BR"
        ) {
          out += `${text}\n\n`;
          return;
        }

        out += text;

        return;
      }

      /* ================= BR ================= */
      case "BR":
        out += "\n";
        return;

      /* ================= INLINE ================= */
      case "STRONG":
      case "B":
        out += `**${el.textContent}**`;
        return;

      case "EM":
      case "I":
        out += `*${el.textContent}*`;
        return;

      /* ================= LIST ================= */
      case "UL":
        Array.from(el.children).forEach((li) => {
          out += `- ${li.textContent?.trim()}\n`;
        });

        out += "\n";
        return;

      case "OL":
        Array.from(el.children).forEach(
          (li, idx) => {
            out += `${idx + 1}. ${li.textContent?.trim()}\n`;
          }
        );

        out += "\n";
        return;

      case "LI":
        out += `- ${el.textContent?.trim()}\n`;
        return;

      /* ================= TABLE ================= */
      case "TABLE":
        out +=
          "\n" +
          tableToMarkdown(
            el as HTMLTableElement
          ) +
          "\n";

        return;

      /* ================= DEFAULT ================= */
      default:
        el.childNodes.forEach(walk);
    }
  };

  doc.body.childNodes.forEach(walk);

  return out
    .replace(/\r/g, "")
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
  const fileInputRef =
    React.useRef<HTMLInputElement>(null);

  /* ================= IMAGE RESIZE ================= */
  const resizeImage = (
    file: File,
    maxSize = 1000
  ): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();

      img.src = URL.createObjectURL(file);

      img.onload = () => {
        let { width, height } = img;

        if (
          width > maxSize ||
          height > maxSize
        ) {
          const scale = Math.min(
            maxSize / width,
            maxSize / height
          );

          width *= scale;
          height *= scale;
        }

        const canvas =
          document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const ctx =
          canvas.getContext("2d")!;

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        });
      };
    });
  };

  /* ================= IMAGE INSERT ================= */
  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const resized = await resizeImage(
      file,
      1000
    );

    const fileName = `${Date.now()}_${
      file.name
    }`;

    const { error } = await supabase.storage
      .from("imagebucket")
      .upload(fileName, resized);

    if (error) return;

    const { data } = supabase.storage
      .from("imagebucket")
      .getPublicUrl(fileName);

    setContent(
      (prev) =>
        prev + `\n![](${data.publicUrl})\n`
    );
  };

  /* ================= PASTE PROCESSOR ================= */
  const handlePaste = (
    e: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const html =
      e.clipboardData.getData("text/html");

    const text =
      e.clipboardData.getData("text/plain");

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

  /* ================= IMAGE URL AUTO-CONVERT ================= */
  const renderContent = content.replace(
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
    "![]($1)"
  );

  return (
    <div>
      {/* IMAGE BUTTON */}
      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          onClick={handleInsertImage}
        >
          Insert Image
        </button>

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      {/* EDITOR + PREVIEW */}
      <div
        style={{
          display: "flex",
          gap: 20,
        }}
      >
        {/* EDITOR */}
        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          onPaste={handlePaste}
          style={{
            width: "50%",
            height: 400,
            padding: 10,
            fontFamily: "monospace",
          }}
        />

        {/* PREVIEW */}
        <div
          style={{
            width: "50%",
            height: 400,
            overflow: "auto",
            padding: 10,
            background: "#111",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          <ReactMarkdown
            remarkPlugins={[
              remarkGfm,
              remarkMath,
              remarkBreaks,
            ]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({
                inline,
                className,
                children,
                ...props
              }: any) {
                const text =
                  String(children);

                if (
                  inline ||
                  (text.length < 80 &&
                    !text.includes("\n"))
                ) {
                  return (
                    <code
                      style={{
                        background: "#333",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }

                const match =
                  /language-(\w+)/.exec(
                    className || ""
                  );

                return (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={
                      match?.[1] || "text"
                    }
                    PreTag="div"
                  >
                    {text}
                  </SyntaxHighlighter>
                );
              },

              img({
                src,
                alt,
                ...props
              }: any) {
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
            {renderContent || "Preview..."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}