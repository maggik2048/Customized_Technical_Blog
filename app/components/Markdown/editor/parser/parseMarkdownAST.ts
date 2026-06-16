import { ASTNode, CodeBlockNode } from "../ast/types";

/**
 * Parses markdown text into an Abstract Syntax Tree (AST)
 * @param input - The markdown text to parse
 * @returns Array of AST nodes
 */
export function parseMarkdownAST(input: string): ASTNode[] {
  const lines = input.split("\n");
  const ast: ASTNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* ================= CODE BLOCK ================= */
    if (line.startsWith("```")) {
      // Extract language from code fence (e.g., ```javascript -> "javascript")
      const language = line.replace(/```/, "").trim();

      i++;
      let code = "";

      // Collect all lines until closing code fence
      while (i < lines.length && !lines[i].startsWith("```")) {
        code += lines[i] + "\n";
        i++;
      }

      // Create code block node with language if present
      const codeNode: CodeBlockNode = {
        type: "code",
        content: code.trimEnd(),
      };

      // Only add language if it has a value
      if (language) {
        codeNode.language = language;
      }

      ast.push(codeNode);

      // Skip the closing ```
      i++;
      continue;
    }

    /* ================= HEADING ================= */
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      
      ast.push({
        type: "heading",
        level,
        content: content.trim(),
      });

      i++;
      continue;
    }

    /* ================= LIST (Unordered) ================= */
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];

      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
        i++;
      }

      ast.push({
        type: "list",
        ordered: false,
        items,
      });

      continue;
    }

    /* ================= LIST (Ordered) ================= */
    const orderedMatch = line.match(/^\s*(\d+)\.\s+(.+)/);
    if (orderedMatch) {
      const items: string[] = [];

      while (i < lines.length) {
        const match = lines[i].match(/^\s*(\d+)\.\s+(.+)/);
        if (!match) break;
        items.push(match[2]);
        i++;
      }

      ast.push({
        type: "list",
        ordered: true,
        items,
      });

      continue;
    }

    /* ================= BLOCKQUOTE ================= */
    if (line.startsWith("> ")) {
      let content = line.replace(/^> /, "");
      i++;
      
      // Collect multi-line blockquotes
      while (i < lines.length && lines[i].startsWith("> ")) {
        content += "\n" + lines[i].replace(/^> /, "");
        i++;
      }

      // Note: BlockquoteNode not defined in your types yet
      // You might want to add it, or skip for now
      // For now, treat as paragraph with > prefix
      ast.push({
        type: "paragraph",
        content: `> ${content.trim()}`,
      });

      continue;
    }

    /* ================= HORIZONTAL RULE ================= */
    if (/^(---|\*\*\*|___)$/.test(line.trim())) {
      // Note: You might want to add HR type to AST
      // For now, skip or treat as empty paragraph
      i++;
      continue;
    }

    /* ================= IMAGE ================= */
    const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (imageMatch) {
      // Note: ImageNode not defined in your types yet
      // For now, treat as paragraph with markdown
      ast.push({
        type: "paragraph",
        content: line,
      });

      i++;
      continue;
    }

    /* ================= LINK ================= */
    const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch && !line.match(/!\[/)) { // Exclude images
      // Note: LinkNode not defined in your types yet
      // For now, treat as paragraph with markdown
      ast.push({
        type: "paragraph",
        content: line,
      });

      i++;
      continue;
    }

    /* ================= TABLE ================= */
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1].includes("|---")) {
      // Note: TableNode not defined in your types yet
      // For now, treat as paragraph
      ast.push({
        type: "paragraph",
        content: line,
      });

      i++;
      continue;
    }

    /* ================= PARAGRAPH ================= */
    if (line.trim()) {
      let content = line;
      i++;
      
      // Collect multi-line paragraphs (until empty line or next block)
      while (i < lines.length && 
             lines[i].trim() && 
             !lines[i].startsWith("```") &&
             !lines[i].startsWith("#") &&
             !lines[i].startsWith("> ") &&
             !/^\s*[-*+]\s+/.test(lines[i]) &&
             !/^\s*\d+\.\s+/.test(lines[i])) {
        content += "\n" + lines[i];
        i++;
      }

      ast.push({
        type: "paragraph",
        content: content.trim(),
      });

      continue;
    }

    // Skip empty lines
    i++;
  }

  return ast;
}

/**
 * Utility function to convert AST back to markdown
 */
export function astToMarkdown(ast: ASTNode[]): string {
  return ast.map(node => {
    switch (node.type) {
      case "code":
        return `\`\`\`${node.language || ''}\n${node.content}\n\`\`\``;
      case "heading":
        return `${'#'.repeat(node.level)} ${node.content}`;
      case "paragraph":
        return node.content;
      case "list":
        const prefix = node.ordered ? '1. ' : '- ';
        return node.items.map(item => `${prefix}${item}`).join('\n');
      default:
        return '';
    }
  }).join('\n\n');
}

/**
 * Utility function to find all code blocks in AST
 */
export function findCodeBlocks(ast: ASTNode[]): CodeBlockNode[] {
  return ast.filter((node): node is CodeBlockNode => node.type === "code");
}

/**
 * Type guard for CodeBlockNode
 */
export function isCodeBlockNode(node: ASTNode): node is CodeBlockNode {
  return node.type === "code";
}

/**
 * Type guard for ParagraphNode
 */
export function isParagraphNode(node: ASTNode): node is ParagraphNode {
  return node.type === "paragraph";
}

/**
 * Type guard for ListNode
 */
export function isListNode(node: ASTNode): node is ListNode {
  return node.type === "list";
}

/**
 * Type guard for HeadingNode
 */
export function isHeadingNode(node: ASTNode): node is HeadingNode {
  return node.type === "heading";
}