"use client";

import React from "react";

import RemarkPageRenderer from "./remarkPageRenderer";
import NotePageRenderer from "./NotePageRenderer";
import RemarkLetterPageRenderer from "./RemarkLetterPageRenderer";

/* =========================
   TYPES
========================= */

type Props = {
  category?: string;
  children: string;
  markdownComponents: any;
  isDark: boolean;
  CodeBlock: any;
};

/* =========================
   NOTE STYLE CATEGORIES
========================= */

const NOTE_STYLE_CATEGORIES = [
  "network",
  "ai",
  "sqldb",
  "compiler",
  "embed",
  "discrete",
  "digitalelec",
  "os",
  "systems",
  "dsa",
  "cpp",
  "oop",
  "se",
  "security",
  "mt_concurrency",
  "graphics_pipeline",
  "unreal",
  "digitalTwin",
  "gameMath",
];

/* =========================
   LETTER STYLE CATEGORIES
========================= */

const LETTER_STYLE_CATEGORIES = [
  // la langue française(French Language)
  "french",
];

/* =========================
   HELPERS
========================= */

function shouldUseNoteRenderer(category?: string) {
  if (!category) {
    return false;
  }
  return NOTE_STYLE_CATEGORIES.includes(category.trim());
}

function shouldUseLetterRenderer(category?: string) {
  if (!category) {
    return false;
  }
  return LETTER_STYLE_CATEGORIES.includes(category.trim());
}

/* =========================
   MEMOIZED RENDERERS
========================= */

const MemoRemarkPageRenderer = React.memo(RemarkPageRenderer);
const MemoNotePageRenderer = React.memo(NotePageRenderer);
const MemoRemarkLetterPageRenderer = React.memo(RemarkLetterPageRenderer);

/* =========================
   COMPONENT
========================= */

function MarkdownRendererCoordinatorComponent({
  category,
  children,
  markdownComponents,
  isDark,
  CodeBlock,
}: Props) {
  const useNoteRenderer = React.useMemo(
    () => shouldUseNoteRenderer(category),
    [category]
  );

  const useLetterRenderer = React.useMemo(
    () => shouldUseLetterRenderer(category),
    [category]
  );

  // =========================
  // DEBUG
  // =========================

  console.log("MARKDOWN COORDINATOR:", {
    category,
    useNoteRenderer,
    useLetterRenderer,
    renderer: useLetterRenderer
      ? "RemarkLetterPageRenderer"
      : useNoteRenderer
      ? "NotePageRenderer"
      : "RemarkPageRenderer",
  });

  // =========================
  // 🆕 CODE BLOCK INDEX WRAPPER
  // =========================
  // 각 렌더러에 전달할 CodeBlock을 index 기능이 추가된 버전으로 래핑
  const CodeBlockWithIndex = React.useMemo(() => {
    // 코드 블록 카운터
    let codeBlockIndex = 0;

    // 실제 렌더링에 사용될 컴포넌트
    const WrappedCodeBlock = (props: any) => {
      // 코드 블록인지 확인 (inline이 아니고 language-가 있으면)
      const isCodeBlock = !props.inline && props.className?.includes("language-");
      
      // 코드 블록이면 index 할당하고 증가
      const index = isCodeBlock ? codeBlockIndex++ : undefined;
      
      // 원래 CodeBlock 컴포넌트에 index prop 추가해서 전달
      return <CodeBlock {...props} index={index} />;
    };

    return WrappedCodeBlock;
  }, [CodeBlock]);

  // =========================
  // LETTER STYLE
  // =========================

  if (useLetterRenderer) {
    return (
      <MemoRemarkLetterPageRenderer
        markdownComponents={markdownComponents}
        isDark={isDark}
        CodeBlock={CodeBlockWithIndex}
      >
        {children}
      </MemoRemarkLetterPageRenderer>
    );
  }

  // =========================
  // NOTE STYLE
  // =========================

  if (useNoteRenderer) {
    return (
      <MemoNotePageRenderer
        markdownComponents={markdownComponents}
        isDark={isDark}
        CodeBlock={CodeBlockWithIndex}
      >
        {children}
      </MemoNotePageRenderer>
    );
  }

  // =========================
  // DEFAULT
  // =========================

  return (
    <MemoRemarkPageRenderer
      markdownComponents={markdownComponents}
      isDark={isDark}
      CodeBlock={CodeBlockWithIndex}
    >
      {children}
    </MemoRemarkPageRenderer>
  );
}

/* =========================
   EXPORT MEMOIZED
========================= */

const MarkdownRendererCoordinator = React.memo(
  MarkdownRendererCoordinatorComponent
);

export default MarkdownRendererCoordinator;