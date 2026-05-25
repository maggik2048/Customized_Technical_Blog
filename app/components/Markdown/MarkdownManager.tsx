// app/components/Markdown/MarkdownManager.tsx

"use client";

import React from "react";

import CodeMirror from "@uiw/react-codemirror";

import { markdown } from "@codemirror/lang-markdown";

import { EditorView } from "@codemirror/view";

import MarkdownPreview from "./MarkdownPreview";

import { uploadImage } from "./uploadImage";

/**
 * =========================================
 * AST MANAGER
 * =========================================
 */

class ASTManager {
  normalize(input: string): string {
    console.log(
      "[AST] normalize input:",
      JSON.stringify(input)
    );

    if (!input || typeof input !== "string") {
      console.log(
        "[AST] normalize -> empty"
      );

      return "";
    }

    const normalized =
      input.replace(/\r\n/g, "\n");

    console.log(
      "[AST] normalize output:",
      JSON.stringify(normalized)
    );

    return normalized;
  }

  spaceToLineBreak(
    input: string
  ): string {
    console.log(
      "[AST] spaceToLineBreak input:",
      JSON.stringify(input)
    );

    const result =
      this.normalize(input);

    console.log(
      "[AST] spaceToLineBreak output:",
      JSON.stringify(result)
    );

    return result;
  }

  parse(input: string) {
    console.log(
      "[AST] parse input:",
      JSON.stringify(input)
    );

    const normalized =
      this.normalize(input);

    const parsed = {
      raw: input,
      normalized,
      lines:
        normalized.split("\n"),
    };

    console.log(
      "[AST] parse output:",
      parsed
    );

    return parsed;
  }

  render(input: string): string {
    console.log(
      "[AST] render input:",
      JSON.stringify(input)
    );

    const result =
      this.normalize(input);

    console.log(
      "[AST] render output:",
      JSON.stringify(result)
    );

    return result;
  }

  parsePaste(
    html: string,
    text: string
  ): string {
    console.log(
      "[AST] parsePaste START"
    );

    console.log(
      "[AST] RAW HTML:"
    );

    console.log(
      JSON.stringify(html)
    );

    console.log(
      "[AST] RAW TEXT:"
    );

    console.log(
      JSON.stringify(text)
    );

    console.log(
      "[AST] TEXT LINES:"
    );

    console.log(
      text.split("\n")
    );

    const result =
      this.normalize(
        text || html || ""
      );

    console.log(
      "[AST] parsePaste RESULT:"
    );

    console.log(
      JSON.stringify(result)
    );

    console.log(
      "[AST] RESULT LINES:"
    );

    console.log(
      result.split("\n")
    );

    return result;
  }
}

export const astManager =
  new ASTManager();

/**
 * =========================================
 * COMPONENT
 * =========================================
 */

type Props = {
  content: string;

  setContent: React.Dispatch<
    React.SetStateAction<string>
  >;
};

export default function MarkdownManager({
  content,
  setContent,
}: Props) {
  const previewRef =
    React.useRef<HTMLDivElement>(null);

  const extensions = React.useMemo(
    () => [
      /**
       * markdown extension
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
            "=========================="
          );

          console.log(
            "[PASTE] EVENT START"
          );

          console.log(
            "=========================="
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
           * IMAGE
           */
          for (const item of clipboard.items) {
            console.log(
              "[PASTE] clipboard item:",
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
                  "[PASTE] file null"
                );

                return true;
              }

              (async () => {
                console.log(
                  "[PASTE] uploading image..."
                );

                const url =
                  await uploadImage(
                    file
                  );

                console.log(
                  "[PASTE] uploaded url:",
                  url
                );

                if (!url) {
                  return;
                }

                const current =
                  view.state.doc.toString();

                console.log(
                  "[PASTE] CURRENT DOC:"
                );

                console.log(
                  JSON.stringify(
                    current
                  )
                );

                const sel =
                  view.state.selection.main;

                console.log(
                  "[PASTE] selection:",
                  sel
                );

                const next =
                  current.slice(
                    0,
                    sel.from
                  ) +
                  `\n![](${url})\n` +
                  current.slice(sel.to);

                console.log(
                  "[PASTE] NEXT DOC:"
                );

                console.log(
                  JSON.stringify(next)
                );

                view.dispatch({
                  changes: {
                    from: 0,
                    to: current.length,
                    insert: next,
                  },
                });

                setContent(next);
              })();

              return true;
            }
          }

          /**
           * TEXT / HTML
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

          const parsed =
            astManager.parsePaste(
              html,
              text
            );

          console.log(
            "[PASTE] PARSED RESULT:"
          );

          console.log(
            JSON.stringify(parsed)
          );

          const current =
            view.state.doc.toString();

          console.log(
            "[PASTE] CURRENT DOC:"
          );

          console.log(
            JSON.stringify(current)
          );

          const sel =
            view.state.selection.main;

          console.log(
            "[PASTE] selection:",
            sel
          );

          const next =
            current.slice(
              0,
              sel.from
            ) +
            parsed +
            current.slice(sel.to);

          console.log(
            "[PASTE] FINAL NEXT DOC:"
          );

          console.log(
            JSON.stringify(next)
          );

          console.log(
            "[PASTE] FINAL NEXT DOC LINES:"
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

          console.log(
            "[PASTE] dispatch complete"
          );

          setContent(next);

          console.log(
            "[PASTE] setContent complete"
          );

          console.log(
            "=========================="
          );

          console.log(
            "[PASTE] EVENT END"
          );

          console.log(
            "=========================="
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
    [setContent]
  );

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