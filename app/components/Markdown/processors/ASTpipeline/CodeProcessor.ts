import { Block } from "../../preprocessor/segmenter";
import { astManager } from "./astManager";

export class CodeProcessor {
  static process(block: Block): Block {
    return {
      ...block,
      content: astManager.parsePaste("", block.content),
    };
  }
}