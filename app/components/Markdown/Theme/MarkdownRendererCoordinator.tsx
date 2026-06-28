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
  // 🆕 CODE BLOCK INDEX WRAPPER (수정됨)
  // =========================
  
  // ✅ 컴포넌트 인스턴스당 하나의 카운터 유지 (ref로 관리)
  const codeBlockCounterRef = React.useRef(0);
  
  // ✅ 콘텐츠 기반 매핑 (중복 방지 및 안정적인 인덱스 할당)
  const codeBlockMapRef = React.useRef<Map<string, number>>(new Map());
  
  // ✅ 마크다운 내용이 변경될 때마다 카운터 리셋 (새로운 문서)
  React.useEffect(() => {
    // 새로운 마크다운 내용이 들어오면 카운터 초기화
    codeBlockCounterRef.current = 0;
    codeBlockMapRef.current.clear();
    console.log('🔄 MarkdownRendererCoordinator: 코드 블록 카운터 리셋');
  }, [children]); // ← children이 변경될 때마다 리셋

  // ✅ CodeBlock을 래핑하는 컴포넌트 (수정됨)
  const CodeBlockWithIndex = React.useCallback(
    (props: any) => {
      // 코드 블록인지 확인 (inline이 아니고 language-가 있으면)
      const isCodeBlock = !props.inline && props.className?.includes("language-");
      
      // 코드 블록이 아니면 원래대로
      if (!isCodeBlock) {
        return <CodeBlock {...props} />;
      }
      
      // ✅ 콘텐츠 기반으로 고유 키 생성
      const content = String(props.children || '');
      const contentKey = `${content.substring(0, 30)}-${content.length}`;
      
      // ✅ 이미 매핑된 인덱스가 있는지 확인
      let blockIndex = codeBlockMapRef.current.get(contentKey);
      
      if (blockIndex === undefined) {
        // 새 코드 블록이면 인덱스 할당
        blockIndex = codeBlockCounterRef.current++;
        codeBlockMapRef.current.set(contentKey, blockIndex);
        console.log(`📝 새 코드 블록: index=${blockIndex}, key=${contentKey.substring(0, 20)}...`);
      } else {
        console.log(`♻️ 기존 코드 블록 재사용: index=${blockIndex}, key=${contentKey.substring(0, 20)}...`);
      }
      
      // ✅ index prop 전달
      return <CodeBlock {...props} index={blockIndex} />;
    },
    [CodeBlock] // CodeBlock이 변경될 때만 새로 생성
  );

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
   EXPORT MEMOIZED (개선됨)
========================= */

const MarkdownRendererCoordinator = React.memo(
  MarkdownRendererCoordinatorComponent,
  // ✅ props가 실제로 변경되었을 때만 리렌더링
  (prevProps, nextProps) => {
    const isSame = 
      prevProps.children === nextProps.children &&
      prevProps.category === nextProps.category &&
      prevProps.isDark === nextProps.isDark;
    
    if (!isSame) {
      console.log('🔄 MarkdownRendererCoordinator 리렌더링:', {
        childrenChanged: prevProps.children !== nextProps.children,
        categoryChanged: prevProps.category !== nextProps.category,
        isDarkChanged: prevProps.isDark !== nextProps.isDark,
      });
    }
    
    return isSame;
  }
);

export default MarkdownRendererCoordinator;