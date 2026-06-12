"use client";

import React from "react";
import { uploadImage } from "./uploadImage";
import { uploadQueue } from "./uploadQueue";

export default function MarkdownImageUploader({
  content,
  setContent,
}: {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) {
  const handlePaste = async (
    e: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // file paste (png/jpg/webp/anything)
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (!file) continue;

        uploadQueue.add(async () => {
          const url = await uploadImage(file);
          if (!url) return;

          setContent((prev) => `${prev}\n![image](${url})\n`);
        });
      }

      // snipping tool / html base64 paste
      else if (
        item.kind === "string" &&
        item.type === "text/html"
      ) {
        item.getAsString(async (html) => {
          const match = html.match(
            /src="data:image\/(\w+);base64,([^"]+)"/
          );
          if (!match) return;

          const type = match[1];
          const base64 = match[2];

          const blob = await fetch(
            `data:image/${type};base64,${base64}`
          ).then((res) => res.blob());

          const file = new File([blob], "paste", {
            type: blob.type,
          });

          uploadQueue.add(async () => {
            const url = await uploadImage(file);
            if (!url) return;

            setContent((prev) => `${prev}\n![image](${url})\n`);
          });
        });
      }
    }
  };

  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      onPaste={handlePaste}
      style={{
        width: "100%",
        minHeight: 200,
        fontFamily: "monospace",
      }}
      placeholder="Paste image → auto resize(600px) + AVIF compress"
    />
  );
}