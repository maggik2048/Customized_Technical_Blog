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

  /* ================= IMAGE BUTTON ================= */

  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  /* ================= FILE CHANGE ================= */

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

  /* ================= AUTO IMAGE URL ================= */

  const renderContent = content.replace(
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
    "![]($1)"
  );

  return (
    <div>
      {/* IMAGE BUTTON */}
      <div style={{ marginBottom: 10 }}>
        <button type="button" onClick={handleInsertImage}>
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
      <div style={{ display: "flex", gap: 20 }}>
        {/* EDITOR */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
          style={{
            width: "50%",
            height: 400,
            padding: 10,
            fontFamily: "monospace",
          }}
          placeholder="Ctrl + V 로 이미지 붙여넣기 가능"
        />

        {/* PREVIEW (분리됨) */}
        <MarkdownPreview content={renderContent} />
      </div>
    </div>
  );
}