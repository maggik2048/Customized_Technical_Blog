"use client";

import { ASTNode } from "../ast/types";

import ParagraphNode from "./ParagraphNode";
import CodeNode from "./CodeNode";
import ListNode from "./ListNode";

export default function ASTRenderer({
  ast,
}: {
  ast: ASTNode[];
}) {
  return (
    <>
      {ast.map((node, idx) => {
        switch (node.type) {
          case "paragraph":
            return (
              <ParagraphNode
                key={idx}
                content={node.content}
              />
            );

          case "code":
            return (
              <CodeNode
                key={idx}
                content={node.content}
              />
            );

          case "list":
            return (
              <ListNode
                key={idx}
                items={node.items}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
}