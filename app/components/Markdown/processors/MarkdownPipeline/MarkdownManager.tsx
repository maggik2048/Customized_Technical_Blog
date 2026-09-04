"use client";

// ✅ IMPORT PROPRE - Plus besoin de require
import { gfm } from "turndown-plugin-gfm";

import React from "react";

import CodeMirror from "@uiw/react-codemirror";

import { markdown } from "@codemirror/lang-markdown";

import { EditorView } from "@codemirror/view";

// ✅ IMPORTANT: Import syntaxTree from @codemirror/language
import { syntaxTree } from "@codemirror/language";

import TurndownService from "turndown";

import MarkdownPreview from "./MarkdownPreview";

import { uploadImage } from "../../imagehandle/uploadImage";

import { DocumentPostProcessor } from "./DocumentPostProcessor";

import { uploadQueue } from "../../imagehandle/uploadQueue";

/**
 * =========================================
 * TYPES
 * =========================================
 */

type Props = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  disablePostProcessing?: boolean; // NEW: toggle prop
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
  disablePostProcessing = false, // Default: false (processing ENABLED)
}: Props) {
  /**
   * =====================================
   * PREVIEW REF
   * =====================================
   */

  // ✅ CORRIGÉ : Utilisation d'une assertion non-null
  const previewRef = React.useRef<HTMLDivElement>(null!);

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
   * ERROR STATE (NEW - FIX)
   * =====================================
   */

  const [hasError, setHasError] = React.useState(false);

  /**
   * =====================================
   * SAFE SYNTAX TREE WRAPPER (NEW - FIXES BACKTICK CRASH)
   * =====================================
   */

  const safeGetSyntaxTree = React.useCallback((view: EditorView) => {
    try {
      return syntaxTree(view.state);
    } catch (error) {
      console.warn("Failed to get syntax tree:", error);
      return null;
    }
  }, []);

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
       * FINAL POST PROCESS - only if not disabled
       */
      const processed = disablePostProcessing
        ? markdown
        : DocumentPostProcessor.process(markdown);

      /**
       * react state sync
       */

      setContent(processed);

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

          insert: processed,
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
  }, [setContent, disablePostProcessing]);

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
      /**
       * FINAL POST PROCESS - only if not disabled
       */
      const processed = disablePostProcessing
        ? insert
        : DocumentPostProcessor.process(insert);

      const current =
        view.state.doc.toString();

      const sel =
        view.state.selection.main;

      const next =
        current.slice(0, sel.from) +
        processed +
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
    [setContent, disablePostProcessing]
  );

  /**
   * =====================================
   * AST LOGGER (FIXED - SAFE WRAPPER)
   * =====================================
   */

  const logCurrentMarkdownTree =
    React.useCallback(
      (view: EditorView) => {
        try {
          const tree = safeGetSyntaxTree(view);
          if (!tree) {
            console.log("===== AST UNAVAILABLE =====");
            return;
          }

          const pos =
            view.state.selection.main.from;

          let node: any = tree.resolve(pos, -1);

          console.log(
            "===== CURRENT AST ====="
          );

          let depth = 0;
          while (node && depth < 20) {
            console.log(node.name);
            node = node.parent;
            depth++;
          }
        } catch (error) {
          console.warn("Failed to log AST:", error);
        }
      },
      [safeGetSyntaxTree]
    );

  /**
   * =====================================
   * INSIDE CODE BLOCK? (FIXED - SAFE WRAPPER)
   * =====================================
   */

  const isInsideCodeBlock =
    React.useCallback(
      (view: EditorView) => {
        try {
          const tree = safeGetSyntaxTree(view);
          if (!tree) return false;

          const pos =
            view.state.selection.main.from;

          let node: any = tree.resolve(pos, -1);

          let depth = 0;
          while (node && depth < 20) {
            if (
              node.name ===
                "FencedCode" ||
              node.name === "CodeBlock"
            ) {
              return true;
            }
            node = node.parent;
            depth++;
          }

          return false;
        } catch (error) {
          console.warn("Failed to check code block:", error);
          return false;
        }
      },
      [safeGetSyntaxTree]
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
        ) ||
        lower.includes("def ")
      ) {
        return "python";
      }

      if (
        lower.includes("#include") ||
        lower.includes("std::")
      ) {
        return "cpp";
      }

      if (
        lower.includes(
          "console.log"
        ) ||
        lower.includes("function ")
      ) {
        return "js";
      }

      if (
        lower.includes(
          "interface "
        ) ||
        lower.includes("type ")
      ) {
        return "ts";
      }

      if (
        lower.includes(
          "public class"
        ) ||
        lower.includes("System.out")
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

              // FIX: Prevent infinite loop
              if (next !== content) {
                setContent(next);
              }
              setHasError(false);
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

                    uploadQueue.add(async () => {
                      const url =
                        await uploadImage(file);

                      if (url) {
                        insertText(
                          view,
                          `\n![](${url})\n`
                        );
                      }
                    });

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

                    uploadQueue.add(async () => {
                      const url =
                        await uploadImage(file);

                      if (url) {
                        insertText(
                          view,
                          `\n![](${url})\n`
                        );
                      }
                    });

                    return;
                  }
                }

                /**
                 * =================================
                 * AST
                 * =================================
                 */

                try {
                  logCurrentMarkdownTree(
                    view
                  );
                } catch (error) {
                  console.warn("AST logging failed:", error);
                }

                /**
                 * inside code block?
                 */

                let insideCode = false;
                try {
                  insideCode =
                    isInsideCodeBlock(
                      view
                    );
                } catch (error) {
                  console.warn("Code block check failed:", error);
                  insideCode = false;
                }

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
        content, // FIX: Added to prevent loop
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
        position: "relative", // For the disabled indicator badge
      }}
    >
      {/* ================================= */}
      {/* ERROR INDICATOR (NEW) */}
      {/* ================================= */}
      {hasError && (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ef4444",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 700,
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
          }}
        >
          ⚠️ Editor Error - Content may not render correctly
        </div>
      )}

      {/* ================================= */}
      {/* DISABLED INDICATOR BADGE */}
      {/* ================================= */}
      
      {disablePostProcessing && (
        <div
          style={{
            position: "absolute",
            top: hasError ? "56px" : "12px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ef4444",
            color: "#fff",
            padding: "4px 16px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 700,
            zIndex: 1000,
            opacity: 0.9,
            boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
          }}
        >
          ⚠️ POST-PROCESSING DISABLED
        </div>
      )}

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