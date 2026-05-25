"use client";

import React from "react";

import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";

import MarkdownPreview from "./MarkdownPreview";
import { createAPIExportHandler } from "./APIExportHandler";

/**
 * =========================================
 * TYPES
 * =========================================
 */

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * =========================================
 * COMPONENT
 * =========================================
 */

export default function MarkdownManager({
  content,
  setContent,
}: Props) {
  const previewRef = React.useRef<HTMLDivElement>(null);

  /**
   * =====================================
   * INSERT HELPER (UNCHANGED LOGIC)
   * =====================================
   */
  const insertText = React.useCallback(
    (view: EditorView, insert: string) => {
      const current = view.state.doc.toString();
      const sel = view.state.selection.main;

      console.log("[EDITOR] CURRENT DOC:");
      console.log(JSON.stringify(current));

      console.log("[EDITOR] SELECTION:");
      console.log(sel);

      const next =
        current.slice(0, sel.from) +
        insert +
        current.slice(sel.to);

      console.log("[EDITOR] NEXT DOC:");
      console.log(JSON.stringify(next));

      console.log("[EDITOR] NEXT DOC LINES:");
      console.log(next.split("\n"));

      view.dispatch({
        changes: {
          from: 0,
          to: current.length,
          insert: next,
        },
      });

      setContent(next);

      console.log("[EDITOR] INSERT COMPLETE");
    },
    [setContent]
  );

  /**
   * =====================================
   * PASTE HANDLER (EXTRACTED)
   * =====================================
   */
  const handlePaste = React.useMemo(() => {
    return createAPIExportHandler({
      insertText,
    });
  }, [insertText]);

  /**
   * =====================================
   * EXTENSIONS
   * =====================================
   */
  const extensions = React.useMemo(
    () => [
      markdown(),
      EditorView.lineWrapping,

      EditorView.domEventHandlers({
        paste: handlePaste,
      }),

      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const next = update.state.doc.toString();

          console.log("[UPDATE] DOC CHANGED");
          console.log(JSON.stringify(next));
          console.log(next.split("\n"));

          setContent(next);
        }
      }),
    ],
    [handlePaste, setContent]
  );

  /**
   * =====================================
   * RENDER
   * =====================================
   */
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div style={{ width: "50%", height: "100%" }}>
        <CodeMirror
          value={content}
          height="100%"
          extensions={extensions}
        />
      </div>

      <MarkdownPreview
        content={content}
        previewRef={previewRef}
      />
    </div>
  );
}