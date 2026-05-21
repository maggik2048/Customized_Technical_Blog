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

  const normalized =
    category.trim();

  return NOTE_STYLE_CATEGORIES.includes(
    normalized
  );
}

/* =========================
   COMPONENT
========================= */

export default function MarkdownRendererCoordinator({
  category,

  children,

  markdownComponents,

  sciFiMarkdownComponents,

  isDark,

  CodeBlock,
}: Props) {

  const useNoteRenderer =
    shouldUseNoteRenderer(
      category
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
  // NOTE RENDERER
  // =========================

  if (useNoteRenderer) {

    return (
      <NotePageRenderer
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
      </NotePageRenderer>
    );
  }

  // =========================
  // DEFAULT RENDERER
  // =========================

  return (
    <RemarkPageRenderer
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
    </RemarkPageRenderer>
  );
}