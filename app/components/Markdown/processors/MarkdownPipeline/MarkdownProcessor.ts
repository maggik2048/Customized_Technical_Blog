import { Block } from "../../preprocessor/segmenter";
import { MarkdownPipeline } from "./MarkdownPipeline";

export class MarkdownProcessor {
  static process(block: Block): Block {
    return {
      ...block,
      content: MarkdownPipeline.run(block.content),
    };
  }
}