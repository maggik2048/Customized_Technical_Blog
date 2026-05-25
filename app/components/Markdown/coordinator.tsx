import { markdownSegmenter, Block } from "./segmenter";
import { BlockRouter } from "./BlockRouter";

export type PipelineType = "segmented";

export type PipelineResult = {
  pipeline: PipelineType;
  output: string;
  blocks: Block[];
};

/**
 * Coordinator 역할:
 * - raw input 받기
 * - segmentation
 * - routing
 * - rendering
 *
 * ❗ 절대 markdown/code 로직 포함하지 않음
 */
export class MarkdownCoordinator {
  processPaste(html: string, text: string): PipelineResult {
    // 1. input normalize
    const raw = this.getRawInput(html, text);

    // 2. segment
    const blocks = this.segment(raw);

    // 3. process (router only)
    const processedBlocks = this.processBlocks(blocks);

    // 4. render
    const output = this.render(processedBlocks);

    return {
      pipeline: "segmented",
      output,
      blocks: processedBlocks,
    };
  }

  /**
   * raw input 결정만 담당
   */
  private getRawInput(html: string, text: string): string {
    return text || html || "";
  }

  /**
   * segmentation 위임
   */
  private segment(raw: string): Block[] {
    return markdownSegmenter.segment(raw);
  }

  /**
   * block processing → router로 완전 위임
   */
  private processBlocks(blocks: Block[]): Block[] {
    return blocks.map((block) =>
      BlockRouter.process(block)
    );
  }

  /**
   * rendering 위임
   */
  private render(blocks: Block[]): string {
    return markdownSegmenter.renderBlocks(blocks);
  }
}

/**
 * singleton
 */
export const markdownCoordinator =
  new MarkdownCoordinator();