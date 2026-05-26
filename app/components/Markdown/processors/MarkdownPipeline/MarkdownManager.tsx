"use client";

import React from "react";

import CodeMirror from "@uiw/react-codemirror";

import { markdown } from "@codemirror/lang-markdown";

import { EditorView } from "@codemirror/view";

import { syntaxTree } from "@codemirror/language";

import TurndownService from "turndown";

import { gfm } from "turndown-plugin-gfm";

import MarkdownPreview from "./MarkdownPreview";

import { uploadImage } from "../../imagehandle/uploadImage";

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
 * TURNDOWN
 * =========================================
 */

const turndown = new TurndownService({
  headingStyle: "atx",

  codeBlockStyle: "fenced",

  emDelimiter: "*",
});

turndown.use(gfm);

/**
 * =========================================
 * COMPONENT
 * =========================================
 */

export default function MarkdownManager({
  content,
  setContent,
}: Props) {
  /**
   * =====================================
   * PREVIEW REF
   * =====================================
   */

  const previewRef =
    React.useRef<HTMLDivElement>(null);

  /**
   * =====================================
   * CODEMIRROR VIEW REF
   * =====================================
   */

  const editorViewRef =
    React.useRef<EditorView | null>(
      null
    );

  /**
   * =====================================
   * GPT EXTENSION INJECTION
   * =====================================
   */

  React.useEffect(() => {
    const handler = (
      event: MessageEvent
    ) => {
      if (
        event.data?.type !==
        "GPT_MARKDOWN"
      ) {
        return;
      }

      const markdown =
        event.data?.payload;

      if (
        typeof markdown !==
        "string"
      ) {
        return;
      }

      console.log(
        "================================="
      );

      console.log(
        "GPT MARKDOWN RECEIVED"
      );

      console.log(
        "================================="
      );

      console.log(markdown);

      /**
       * react state sync
       */

      setContent(markdown);

      /**
       * codemirror sync
       */

      const view =
        editorViewRef.current;

      if (!view) {
        console.log(
          "EDITOR VIEW NOT READY"
        );

        return;
      }

      view.dispatch({
        changes: {
          from: 0,

          to: view.state.doc.length,

          insert: markdown,
        },
      });

      console.log(
        "EDITOR CONTENT REPLACED"
      );
    };

    window.addEventListener(
      "message",
      handler
    );

    return () => {
      window.removeEventListener(
        "message",
        handler
      );
    };
  }, [setContent]);

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

      const next =
        current.slice(0, sel.from) +
        insert +
        current.slice(sel.to);

      view.dispatch({
        changes: {
          from: 0,

          to: current.length,

          insert: next,
        },
      });

      setContent(next);
    },
    [setContent]
  );

  /**
   * =====================================
   * AST LOGGER
   * =====================================
   */

  const logCurrentMarkdownTree =
    React.useCallback(
      (view: EditorView) => {
        const pos =
          view.state.selection.main.from;

        let node = syntaxTree(
          view.state
        ).resolve(pos, -1);

        console.log(
          "===== CURRENT AST ====="
        );

        while (node) {
          console.log(node.name);

          node = node.parent;
        }
      },
      []
    );

  /**
   * =====================================
   * INSIDE CODE BLOCK?
   * =====================================
   */

  const isInsideCodeBlock =
    React.useCallback(
      (view: EditorView) => {
        const pos =
          view.state.selection.main.from;

        let node = syntaxTree(
          view.state
        ).resolve(pos, -1);

        while (node) {
          if (
            node.name ===
              "FencedCode" ||
            node.name === "CodeBlock"
          ) {
            return true;
          }

          node = node.parent;
        }

        return false;
      },
      []
    );

  /**
   * =====================================
   * LANGUAGE DETECTION
   * =====================================
   */

  const detectLanguage =
    React.useCallback((text: string) => {
      const lower =
        text.toLowerCase();

      if (
        lower.includes(
          "import threading"
        )
      ) {
        return "python";
      }

      if (
        lower.includes("#include")
      ) {
        return "cpp";
      }

      if (
        lower.includes(
          "console.log"
        )
      ) {
        return "js";
      }

      if (
        lower.includes(
          "interface "
        )
      ) {
        return "ts";
      }

      if (
        lower.includes(
          "public class"
        )
      ) {
        return "java";
      }

      return "";
    }, []);

  /**
   * =====================================
   * HTML -> MARKDOWN
   * =====================================
   */

  const convertGPTClipboard =
    React.useCallback(
      (html: string) => {
        const parser =
          new DOMParser();

        const doc =
          parser.parseFromString(
            html,
            "text/html"
          );

        let result = "";

        const children = Array.from(
          doc.body.children
        );

        for (const child of children) {
          /**
           * =================================
           * CODE BLOCK
           * =================================
           */

          if (
            child.tagName.toLowerCase() ===
            "pre"
          ) {
            /**
             * raw html
             */

            const rawHtml =
              child.innerHTML || "";

            /**
             * br -> newline
             */

            const withBreaks =
              rawHtml.replace(
                /<br\s*\/?>/gi,
                "\n"
              );

            /**
             * html -> rendered text
             * 핵심:
             * innerText 사용
             */

            const temp =
              document.createElement(
                "div"
              );

            temp.innerHTML =
              withBreaks;

            const code =
              temp.innerText || "";

            /**
             * language detect
             */

            const language =
              detectLanguage(code);

            /**
             * fenced markdown
             */

            result +=
              "\n```" +
              language +
              "\n" +
              code.trimEnd() +
              "\n```\n\n";

            continue;
          }

          /**
           * =================================
           * NORMAL HTML
           * =================================
           */

          result +=
            turndown.turndown(
              child.outerHTML
            ) + "\n\n";
        }

        return result
          .replace(/\r/g, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();
      },
      [detectLanguage]
    );

  /**
   * =====================================
   * EXTENSIONS
   * =====================================
   */

  const extensions =
    React.useMemo(
      () => [
        markdown(),

        EditorView.lineWrapping,

        /**
         * editor view capture
         */

        EditorView.updateListener.of(
          (update) => {
            editorViewRef.current =
              update.view;

            if (
              update.docChanged
            ) {
              const next =
                update.state.doc.toString();

              setContent(next);
            }
          }
        ),

        EditorView.domEventHandlers(
          {
            paste: (
              event,
              view
            ) => {
              /**
               * native paste 차단
               */

              event.preventDefault();

              const clipboardData =
                event.clipboardData;

              if (
                !clipboardData
              ) {
                return true;
              }

              const items =
                Array.from(
                  clipboardData.items
                );

              const html =
                clipboardData.getData(
                  "text/html"
                ) || "";

              const plain =
                clipboardData.getData(
                  "text/plain"
                ) || "";

              (async () => {
                console.log(
                  "===== PASTE EVENT ====="
                );

                /**
                 * =================================
                 * IMAGE FIRST
                 * =================================
                 */

                for (const item of items) {
                  /**
                   * FILE IMAGE
                   */

                  if (
                    item.kind ===
                      "file" &&
                    item.type.startsWith(
                      "image/"
                    )
                  ) {
                    const file =
                      item.getAsFile();

                    if (!file) {
                      continue;
                    }

                    console.log(
                      "[IMAGE] uploading..."
                    );

                    const url =
                      await uploadImage(
                        file
                      );

                    if (url) {
                      insertText(
                        view,
                        `\n![](${url})\n`
                      );
                    }

                    return;
                  }

                  /**
                   * BASE64 IMAGE
                   */

                  if (
                    item.kind ===
                      "string" &&
                    item.type ===
                      "text/html"
                  ) {
                    const htmlString =
                      await new Promise<string>(
                        (
                          resolve
                        ) => {
                          item.getAsString(
                            resolve
                          );
                        }
                      );

                    const match =
                      htmlString.match(
                        /src="data:image\/(\w+);base64,([^"]+)"/
                      );

                    if (!match) {
                      continue;
                    }

                    const mime =
                      match[1];

                    const base64 =
                      match[2];

                    const blob =
                      await (
                        await fetch(
                          `data:image/${mime};base64,${base64}`
                        )
                      ).blob();

                    const file =
                      new File(
                        [blob],
                        `paste.${mime}`,
                        {
                          type: `image/${mime}`,
                        }
                      );

                    console.log(
                      "[IMAGE] uploading base64..."
                    );

                    const url =
                      await uploadImage(
                        file
                      );

                    if (url) {
                      insertText(
                        view,
                        `\n![](${url})\n`
                      );
                    }

                    return;
                  }
                }

                /**
                 * =================================
                 * AST
                 * =================================
                 */

                logCurrentMarkdownTree(
                  view
                );

                /**
                 * inside code block?
                 */

                const insideCode =
                  isInsideCodeBlock(
                    view
                  );

                /**
                 * =================================
                 * RAW CODE PASTE
                 * =================================
                 */

                if (
                  insideCode
                ) {
                  console.log(
                    "[PASTE] RAW CODE"
                  );

                  insertText(
                    view,
                    plain
                  );

                  return;
                }

                /**
                 * =================================
                 * HTML -> MARKDOWN
                 * =================================
                 */

                console.log(
                  "[PASTE] HTML -> MARKDOWN"
                );

                if (
                  html.trim()
                    .length > 0
                ) {
                  const markdown =
                    convertGPTClipboard(
                      html
                    );

                  insertText(
                    view,
                    markdown
                  );

                  return;
                }

                /**
                 * plain fallback
                 */

                insertText(
                  view,
                  plain
                );
              })();

              return true;
            },
          }
        ),
      ],
      [
        convertGPTClipboard,
        insertText,
        isInsideCodeBlock,
        logCurrentMarkdownTree,
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

        minHeight: "100vh",
        alignItems: "stretch",
      }}
    >
      {/* ================================= */}
      {/* LEFT : EDITOR */}
      {/* ================================= */}

      <div
        style={{
          width: "50%",

          height: "100%",
        }}
      >
        <CodeMirror
          value={content}
          height="100%"
          extensions={
            extensions
          }
        />
      </div>

      {/* ================================= */}
      {/* RIGHT : PREVIEW */}
      {/* ================================= */}

      <MarkdownPreview
        content={content}
        setContent={setContent}
        previewRef={
          previewRef
        }
      />
    </div>
  );
}