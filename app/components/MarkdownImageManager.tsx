"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { supabase } from "@/lib/supabase";

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

export default function MarkdownImageManager({ content, setContent }: Props) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Trigger file picker
  const handleInsertImage = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    try {
      const fileName = `${Date.now()}_${file.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("imagebucket") // your public bucket
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload failed:", uploadError.message);
        alert("Image upload failed: " + uploadError.message);
        return;
      }

      // Get public URL
      const { data: urlData, error: urlError } = supabase.storage
        .from("imagebucket")
        .getPublicUrl(fileName);

      if (urlError || !urlData?.publicUrl) {
        console.error("Failed to get public URL:", urlError);
        alert("Failed to get public URL after upload.");
        return;
      }

      // Insert Markdown image link
      setContent((prev) => prev + `\n![](${urlData.publicUrl})\n`);

      // Reset file input so same file can be selected again
      e.target.value = "";
    } catch (err) {
      console.error(err);
      alert("Unexpected error during upload.");
    }
  };

  // Convert plain image URLs to Markdown links automatically
  const renderContent = content.replace(
    /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/gm,
    "![]($1)"
  );

  return (
    <div>
      {/* Insert Image Button */}
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

      {/* Markdown Editor + Preview */}
      <div style={{ display: "flex", gap: 20 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
            background: "#111",
            color: "#fff",
            borderRadius: 8,
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                if (inline) {
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