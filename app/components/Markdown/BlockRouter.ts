import { Block } from "./segmenter";
import { MarkdownProcessor } from "./processors/MarkdownProcessor";
import { CodeProcessor } from "./processors/CodeProcessor";

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