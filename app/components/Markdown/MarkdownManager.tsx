"use client";

import React from "react";
import MarkdownPreview from "./MarkdownPreview";

import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";

import { uploadImage } from "./uploadImage";
import { htmlToMarkdown } from "./htmlToMarkdown";
import { spaceToLineBreak } from "./spaceToLineBreak";

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

export default function MarkdownImageManager({
  content,
  setContent,
}: Props) {
  const previewRef = React.useRef<HTMLDivElement>(null);

  const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

  /* ================= IMAGE ================= */

  const handleImageUpload = async (file: File) => {
    const url = await uploadImage(file);
    return url;
  };

  /* ================= POST PROCESSOR ================= */

  const runPostProcess = React.useCallback(
    (text: string) => {
      const processed = spaceToLineBreak(text);

      // 변경된 경우만 업데이트
      if (processed !== text) {
        setContent(processed);
      }
    },
    [setContent]
  );

  /* ================= DEBOUNCED POST PROCESS ================= */

  const schedulePostProcess = React.useCallback(
    (text: string) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        runPostProcess(text);
      }, 700); // 0.7초 (0.5~1초 추천)
    },
    [runPostProcess]
  );

  /* ================= CODEMIRROR EXTENSIONS ================= */

  const extensions = React.useMemo(() => {
    return [
      markdown(),
      EditorView.lineWrapping,

      EditorView.domEventHandlers({
        paste: (event: ClipboardEvent, view: EditorView) => {
          const items = event.clipboardData?.items;
          if (!items) return false;

          event.preventDefault();

          /* ================= IMAGE ================= */
          for (const item of items) {
            if (item.kind === "file") {
              const file = item.getAsFile();
              if (!file) return true;

              (async () => {
                const url = await handleImageUpload(file);
                if (!url) return;

                const current = view.state.doc.toString();

                const sel = view.state.selection.main;

                const next =
                  current.slice(0, sel.from) +
                  `\n![](${url})\n` +
                  current.slice(sel.to);

                view.dispatch({
                  changes: {
                    from: 0,
                    to: current.length,
                    insert: next,
                  },
                });

                schedulePostProcess(next);
              })();

              return true;
            }
          }

          /* ================= TEXT ================= */

          const html = event.clipboardData?.getData("text/html");
          const text =
            event.clipboardData?.getData("text/plain") || "";

          let parsed = "";

          if (html && html.includes("<")) {
            parsed = htmlToMarkdown(html);
          } else {
            parsed = text.replace(/\r\n/g, "\n");
          }

          const current = view.state.doc.toString();
          const sel = view.state.selection.main;

          const next =
            current.slice(0, sel.from) +
            parsed +
            current.slice(sel.to);

          view.dispatch({
            changes: {
              from: 0,
              to: current.length,
              insert: next,
            },
          });

          // 즉시 말고 post-process 예약
          schedulePostProcess(next);

          return true;
        },
      }),

      /* ================= SYNC ================= */

      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          setContent(update.state.doc.toString());

          //  typing에도 약하게 post process 적용
          schedulePostProcess(update.state.doc.toString());
        }
      }),
    ];
  }, [setContent, schedulePostProcess]);

  /* ================= PREVIEW ================= */

  const renderContent = content.replace(
    /^(https?:\/\/.*\.(png|jpg|jpeg|gif|webp|bmp|svg))$/gm,
    "![]($1)"
  );

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      {/* EDITOR */}
      <div style={{ width: "50%", height: "100%" }}>
        <CodeMirror
          value={content}
          height="100%"
          extensions={extensions}
        />
      </div>

      {/* PREVIEW */}
      <MarkdownPreview
        content={renderContent}
        previewRef={previewRef}
      />
    </div>
  );
}