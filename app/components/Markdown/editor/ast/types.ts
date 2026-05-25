// app/components/Markdown/editor/ast/types.ts

export type ASTNode =
  | ParagraphNode
  | CodeBlockNode
  | ListNode
  | HeadingNode;

export type ParagraphNode = {
  type: "paragraph";
  content: string;
};

export type CodeBlockNode = {
  type: "code";
  language?: string;
  content: string;
};

export type ListNode = {
  type: "list";
  ordered: boolean;
  items: string[];
};

export type HeadingNode = {
  type: "heading";
  level: number;
  content: string;
};