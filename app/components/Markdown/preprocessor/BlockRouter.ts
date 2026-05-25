import { Block } from "./segmenter";
import { MarkdownProcessor } from "../processors/MarkdownPipeline/MarkdownProcessor";
import { CodeProcessor } from "../processors/ASTpipeline/CodeProcessor";

export class BlockRouter {
  static process(block: Block): Block {
    switch (block.type) {
      case "markdown":
        return MarkdownProcessor.process(block);

      case "code":
        return CodeProcessor.process(block);

      default:
        return block;
    }
  }
}