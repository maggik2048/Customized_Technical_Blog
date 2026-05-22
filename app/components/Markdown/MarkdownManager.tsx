"use client";

import React from "react";
import MarkdownPreview from "./MarkdownPreview";

import { uploadImage } from "./uploadImage";
import { htmlToMarkdown } from "./htmlToMarkdown";

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

export default function MarkdownImageManager({
  content,
  setContent,
}: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const editorRef = React.useRef<HTMLTextAreaElement>(null);
  const previewRef = React.useRef<HTMLDivElement>(null);

  /* ================= IMAGE ================= */

  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadImage(file);
    if (!url) return;

    setContent((prev) => prev + `\n![](${url})\n`);
  };

  /* ================= PASTE ================= */

  const handlePaste = async (
    e: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.kind === "file") {
        e.preventDefault();

        const file = item.getAsFile();
        if (!file) return;

        const target = e.currentTarget;
        const start = target.selectionStart;
        const end = target.selectionEnd;

        const url = await uploadImage(file);
        if (!url) return;

        const markdown = `\n![](${url})\n`;

        setContent((prev) =>
          prev.substring(0, start) +
          markdown +
          prev.substring(end)
        );

        return;
      }
    }

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

  /* ================= SCROLL SYNC ================= */

  const handleScrollSync = () => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview) return;

    const ratio =
      editor.scrollTop /
      (editor.scrollHeight - editor.clientHeight);

    preview.scrollTop =
      ratio *
      (preview.scrollHeight - preview.clientHeight);
  };

  /* ================= AUTO IMAGE ================= */

  const renderContent = content.replace(
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
    "![]($1)"
  );

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* EDITOR */}
      <div style={{ width: "50%", height: "100%" }}>
        <textarea
          ref={editorRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
          onScroll={handleScrollSync}
          style={{
            width: "100%",
            height: "100%",
            padding: 20,
            fontFamily: "monospace",
            fontSize: 14,
            border: "none",
            outline: "none",
            resize: "none",
            overflow: "auto",
          }}
          placeholder="Ctrl + V로 이미지 붙여넣기 가능"
        />
      </div>

      {/* PREVIEW */}
      <MarkdownPreview
        content={renderContent}
        previewRef={previewRef}
      />

      {/* IMAGE INPUT */}
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}