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
  // LETTER STYLE
  // =========================

  if (useLetterRenderer) {
    return (
      <MemoRemarkLetterPageRenderer
        markdownComponents={markdownComponents}
        isDark={isDark}
        CodeBlock={CodeBlock}
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
        CodeBlock={CodeBlock}
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
      CodeBlock={CodeBlock}
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