"use client";

import React from "react";

import CodeMirror from "@uiw/react-codemirror";

import { markdown } from "@codemirror/lang-markdown";

import { EditorView } from "@codemirror/view";

import { syntaxTree } from "@codemirror/language";

import TurndownService from "turndown";

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
 * GPT / CHATGPT HTML -> MARKDOWN
 * =========================================
 *
 * 핵심 전략:
 *
 * 1. 일반 텍스트
 *    -> turndown
 *
 * 2. code/pre
 *    -> plain text 기반 fenced code block
 *
 * 이유:
 * text/html 의 code block 은
 * flatten 되는 경우가 많음.
 *
 * plain text 는 indentation 유지됨.
 */

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
      const lower = text.toLowerCase();

      if (
        lower.includes("import threading")
      ) {
        return "python";
      }

      if (
        lower.includes("#include")
      ) {
        return "cpp";
      }

      if (
        lower.includes("console.log")
      ) {
        return "js";
      }

      if (
        lower.includes("interface ")
      ) {
        return "ts";
      }

      if (
        lower.includes("public class")
      ) {
        return "java";
      }

      return "";
    }, []);

  /**
   * =====================================
   * EXTRACT GPT CODE BLOCKS
   * =====================================
   *
   * GPT clipboard 특징:
   *
   * - text/html 에 code/pre 있음
   * - text/plain 은 indentation 유지
   *
   * 그래서:
   *
   * HTML 구조 기준으로
   * code block 개수 파악 후
   * plain text 에서 fenced wrapping
   */

  const convertGPTClipboard =
    React.useCallback(
      (
        html: string,
        plain: string
      ) => {
        /**
         * DOM parse
         */

        const parser = new DOMParser();

        const doc =
          parser.parseFromString(
            html,
            "text/html"
          );

        /**
         * GPT code block 존재?
         */

        const codeNodes = Array.from(
          doc.querySelectorAll("pre")
        );

        /**
         * code block 없으면
         * 일반 turndown
         */

        if (codeNodes.length === 0) {
          return turndown.turndown(html);
        }

        /**
         * =================================
         * GPT MIXED CONTENT PARSE
         * =================================
         */

        let result = "";

        /**
         * body children 순회
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
             * code text
             */

            const code =
              child.textContent || "";

            /**
             * language detect
             */

            const language =
              detectLanguage(code);

            result +=
              "\n```" +
              language +
              "\n" +
              code.replace(/\n$/, "") +
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
        console.log(
          "===== CUSTOM MARKDOWN PASTE ====="
        );

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

        if (html.trim().length > 0) {
          const markdown =
            convertGPTClipboard(
              html,
              plain
            );

          console.log("[MARKDOWN]");
          console.log(markdown);

          insertText(view, markdown);

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
      [convertGPTClipboard, insertText]
    );

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
        paste: (event, view) => {
          console.log(
            "===== PASTE EVENT ====="
          );

          /**
           * AST 출력
           */

          logCurrentMarkdownTree(view);

          /**
           * 현재 code block 내부?
           */

          const insideCode =
            isInsideCodeBlock(view);

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
      }),

      /**
       * DOC CHANGE
       */

      EditorView.updateListener.of(
        (update) => {
          if (update.docChanged) {
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
          extensions={extensions}
        />
      </div>

      {/* ================================= */}
      {/* RIGHT : PREVIEW */}
      {/* ================================= */}

      <MarkdownPreview
        content={content}
        previewRef={previewRef}
      />
    </div>
  );
}