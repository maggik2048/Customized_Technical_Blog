"use client";

import React from "react";

import RemarkPageRenderer from "./remarkPageRenderer";
import NotePageRenderer from "./NotePageRenderer";

/* =========================
   TYPES
========================= */

type Props = {
  category?: string;

  children: string;

  markdownComponents: any;

  sciFiMarkdownComponents: any;

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
   HELPERS
========================= */

function shouldUseNoteRenderer(
  category?: string
) {

  if (!category) {
    return false;
  }

  return NOTE_STYLE_CATEGORIES.includes(
    category.trim()
  );
}

/* =========================
   MEMOIZED RENDERERS
========================= */

const MemoRemarkPageRenderer =
  React.memo(
    RemarkPageRenderer
  );

const MemoNotePageRenderer =
  React.memo(
    NotePageRenderer
  );

/* =========================
   COMPONENT
========================= */

function MarkdownRendererCoordinatorComponent({
  category,

  children,

  markdownComponents,

  sciFiMarkdownComponents,

  isDark,

  CodeBlock,
}: Props) {

  const useNoteRenderer =
    React.useMemo(
      () =>
        shouldUseNoteRenderer(
          category
        ),
      [category]
    );

  // =========================
  // DEBUG
  // =========================

  console.log(
    "MARKDOWN COORDINATOR:",
    {
      category,

      useNoteRenderer,

      renderer:
        useNoteRenderer
          ? "NotePageRenderer"
          : "RemarkPageRenderer",
    }
  );

  // =========================
  // NOTE
  // =========================

  if (useNoteRenderer) {

    return (
      <MemoNotePageRenderer
        markdownComponents={
          markdownComponents
        }
        sciFiMarkdownComponents={
          sciFiMarkdownComponents
        }
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
      markdownComponents={
        markdownComponents
      }
      sciFiMarkdownComponents={
        sciFiMarkdownComponents
      }
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

const MarkdownRendererCoordinator =
  React.memo(
    MarkdownRendererCoordinatorComponent
  );

export default MarkdownRendererCoordinator;