"use client";

import React from "react";

import CodeMirror from "@uiw/react-codemirror";

import { markdown } from "@codemirror/lang-markdown";

import { EditorView } from "@codemirror/view";

import { syntaxTree } from "@codemirror/language";

import TurndownService from "turndown";

import { gfm } from "turndown-plugin-gfm";

import MarkdownPreview from "./MarkdownPreview";

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

/**
 * =========================================
 * GITHUB FLAVORED MARKDOWN
 * =========================================
 *
 * 지원:
 * - table
 * - strikethrough
 * - task list
 */

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
   * GPT HTML -> MARKDOWN
   * =====================================
   */

  const convertGPTClipboard =
    React.useCallback(
      (html: string) => {
        /**
         * html parse
         */

        const parser =
          new DOMParser();

        const doc =
          parser.parseFromString(
            html,
            "text/html"
          );

        /**
         * 최종 markdown
         */

        let result = "";

        /**
         * body children
         */

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
             * GPT clipboard 는
             * br 기반 linebreak 많음
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
             * html -> text
             */

            const temp =
              document.createElement(
                "div"
              );

            temp.innerHTML =
              withBreaks;

            const code =
              temp.textContent || "";

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

          /**
           * GFM plugin 덕분에:
           * - table
           * - task list
           * - strikethrough
           * 지원됨
           */

          result +=
            turndown.turndown(
              child.outerHTML
            ) + "\n\n";
        }

        return result.trim();
      },
      [detectLanguage]
    );

  /**
   * =====================================
   * CUSTOM PASTE
   * =====================================
   */

  const handleMarkdownPaste =
    React.useCallback(
      (
        event: ClipboardEvent,
        view: EditorView
      ) => {
        /**
         * html
         */

        const html =
          event.clipboardData?.getData(
            "text/html"
          ) || "";

        /**
         * plain
         */

        const plain =
          event.clipboardData?.getData(
            "text/plain"
          ) || "";

        console.log("[HTML]");
        console.log(html);

        console.log("[PLAIN]");
        console.log(plain);

        /**
         * =================================
         * HTML EXISTS
         * =================================
         */

        if (
          html.trim().length > 0
        ) {
          const markdown =
            convertGPTClipboard(
              html
            );

          console.log(
            "[FINAL MARKDOWN]"
          );

          console.log(markdown);

          insertText(
            view,
            markdown
          );

          return true;
        }

        /**
         * =================================
         * PLAIN TEXT FALLBACK
         * =================================
         */

        insertText(view, plain);

        return true;
      },
      [
        convertGPTClipboard,
        insertText,
      ]
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

        EditorView.domEventHandlers(
          {
            paste: (
              event,
              view
            ) => {
              console.log(
                "===== PASTE EVENT ====="
              );

              /**
               * AST 출력
               */

              logCurrentMarkdownTree(
                view
              );

              /**
               * 현재 code block 내부?
               */

              const insideCode =
                isInsideCodeBlock(
                  view
                );

              /**
               * =================================
               * INSIDE CODE BLOCK
               * =================================
               */

              if (insideCode) {
                console.log(
                  "[PASTE] RAW CODE BLOCK PASTE"
                );

                /**
                 * 기본 paste 허용
                 */

                return false;
              }

              /**
               * =================================
               * NORMAL MARKDOWN AREA
               * =================================
               */

              console.log(
                "[PASTE] CUSTOM HTML -> MARKDOWN"
              );

              /**
               * 기본 paste 막기
               */

              event.preventDefault();

              /**
               * custom paste
               */

              return handleMarkdownPaste(
                event as ClipboardEvent,
                view
              );
            },
          }
        ),

        /**
         * DOC CHANGE
         */

        EditorView.updateListener.of(
          (update) => {
            if (
              update.docChanged
            ) {
              const next =
                update.state.doc.toString();

              setContent(next);
            }
          }
        ),
      ],
      [
        handleMarkdownPaste,
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

        height: "100vh",
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
        previewRef={
          previewRef
        }
      />
    </div>
  );
}