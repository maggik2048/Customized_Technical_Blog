// ASTbasedBlockRouter.ts

import { ASTNode } from "./HTMLtoASTExtractor";

import { MarkdownProcessor } from "../processors/MarkdownProcessor";
import { CodeProcessor } from "../processors/CodeProcessor";
import { ListProcessor } from "../processors/ListProcessor";
import { TableProcessor } from "../processors/TableProcessor";
import { DefaultProcessor } from "../processors/DefaultProcessor";

export class ASTbasedBlockRouter {
  private static markdownProcessor = new MarkdownProcessor();
  private static codeProcessor = new CodeProcessor();
  private static listProcessor = new ListProcessor();
  private static tableProcessor = new TableProcessor();
  private static defaultProcessor = new DefaultProcessor();

  static process(node: ASTNode): string {
    switch (node.type) {
      case "heading":
      case "paragraph":
      case "blockquote":
      case "text":
        return this.markdownProcessor.process(node);

      case "code":
        return this.codeProcessor.process(node);

      case "list":
        return this.listProcessor.process(node);

      case "table":
        return this.tableProcessor.process(node);

      default:
        return this.defaultProcessor.process(node as any);
    }
  }
}