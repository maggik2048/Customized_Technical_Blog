// app/components/Markdown/MarkdownManager.tsx

"use client";

import React from "react";

import CodeMirror from "@uiw/react-codemirror";

import { markdown } from "@codemirror/lang-markdown";

import { EditorView } from "@codemirror/view";

import MarkdownPreview from "./MarkdownPreview";

import { uploadImage } from "./uploadImage";

import { markdownCoordinator } from "./coordinator";

/**
 * =========================================
 * TYPES
 * =========================================
 */

type Props = {
  content: string;

  setContent: React.Dispatch<
    React.SetStateAction<string>
  >;
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
  const previewRef =
    React.useRef<HTMLDivElement>(null);

  /**
   * =====================================
   * INSERT HELPER
   * =====================================
   */

  const insertText = React.useCallback(
    (
      view: EditorView,
      insert: string
    ) => {
      const current =
        view.state.doc.toString();

      const sel =
        view.state.selection.main;

      console.log(
        "[EDITOR] CURRENT DOC:"
      );

      console.log(
        JSON.stringify(current)
      );

      console.log(
        "[EDITOR] SELECTION:"
      );

      console.log(sel);

      const next =
        current.slice(
          0,
          sel.from
        ) +
        insert +
        current.slice(sel.to);

      console.log(
        "[EDITOR] NEXT DOC:"
      );

      console.log(
        JSON.stringify(next)
      );

      console.log(
        "[EDITOR] NEXT DOC LINES:"
      );

      console.log(
        next.split("\n")
      );

      view.dispatch({
        changes: {
          from: 0,
          to: current.length,
          insert: next,
        },
      });

      setContent(next);

      console.log(
        "[EDITOR] INSERT COMPLETE"
      );
    },
    [setContent]
  );

  /**
   * =====================================
   * EXTENSIONS
   * =====================================
   */

  const extensions = React.useMemo(
    () => [
      /**
       * markdown language
       */
      markdown(),

      /**
       * line wrapping
       */
      EditorView.lineWrapping,

      /**
       * paste handler
       */
      EditorView.domEventHandlers({
        paste: (
          event: ClipboardEvent,
          view: EditorView
        ) => {
          console.log(
            "===================================="
          );

          console.log(
            "[PASTE] EVENT START"
          );

          console.log(
            "===================================="
          );

          const clipboard =
            event.clipboardData;

          if (!clipboard) {
            console.log(
              "[PASTE] clipboard missing"
            );

            return false;
          }

          event.preventDefault();

          /**
           * =================================
           * IMAGE PIPELINE
           * =================================
           */

          for (const item of clipboard.items) {
            console.log(
              "[PASTE] ITEM:",
              item.kind,
              item.type
            );

            if (
              item.kind === "file"
            ) {
              console.log(
                "[PASTE] IMAGE DETECTED"
              );

              const file =
                item.getAsFile();

              if (!file) {
                console.log(
                  "[PASTE] IMAGE FILE NULL"
                );

                return true;
              }

              (async () => {
                console.log(
                  "[PASTE] UPLOADING IMAGE..."
                );

                const url =
                  await uploadImage(
                    file
                  );

                console.log(
                  "[PASTE] IMAGE URL:",
                  url
                );

                if (!url) {
                  return;
                }

                insertText(
                  view,
                  `\n![](${url})\n`
                );
              })();

              return true;
            }
          }

          /**
           * =================================
           * TEXT / HTML PIPELINE
           * =================================
           */

          const html =
            clipboard.getData(
              "text/html"
            );

          const text =
            clipboard.getData(
              "text/plain"
            ) || "";

          console.log(
            "[PASTE] RAW HTML:"
          );

          console.log(
            JSON.stringify(html)
          );

          console.log(
            "[PASTE] RAW TEXT:"
          );

          console.log(
            JSON.stringify(text)
          );

          console.log(
            "[PASTE] RAW TEXT LINES:"
          );

          console.log(
            text.split("\n")
          );

          /**
           * =================================
           * COORDINATOR
           * =================================
           */

          const result =
            markdownCoordinator.processPaste(
              html,
              text
            );

          console.log(
            "[PASTE] PIPELINE:"
          );

          console.log(
            result.pipeline
          );

          console.log(
            "[PASTE] DETECTION:"
          );

          console.log(
            result.detection
          );

          console.log(
            "[PASTE] FINAL OUTPUT:"
          );

          console.log(
            JSON.stringify(
              result.output
            )
          );

          /**
           * =================================
           * INSERT
           * =================================
           */

          insertText(
            view,
            result.output
          );

          console.log(
            "===================================="
          );

          console.log(
            "[PASTE] EVENT END"
          );

          console.log(
            "===================================="
          );

          return true;
        },
      }),

      /**
       * update listener
       */
      EditorView.updateListener.of(
        (update) => {
          if (
            update.docChanged
          ) {
            const next =
              update.state.doc.toString();

            console.log(
              "[UPDATE] DOC CHANGED"
            );

            console.log(
              JSON.stringify(next)
            );

            console.log(
              next.split("\n")
            );

            setContent(next);
          }
        }
      ),
    ],
    [
      insertText,
      setContent,
    ]
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
      <div
        style={{
          width: "50%",
          height: "100%",
        }}
      >
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