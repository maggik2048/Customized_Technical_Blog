// TagTree.ts

export type TagItem = {
  name: string;
  slug: string;

  /**
   * optional grouping
   */
  group?: string;
};

export const TAG_TREE: TagItem[] = [
  // Search / Retrieval
  {
    name: "Semantic Search",
    slug: "semantic-search",
    group: "search",
  },

  {
    name: "Retrieval",
    slug: "retrieval",
    group: "search",
  },

  {
    name: "Ranking",
    slug: "ranking",
    group: "search",
  },

  {
    name: "Embeddings",
    slug: "embeddings",
    group: "search",
  },

  {
    name: "Indexing",
    slug: "indexing",
    group: "search",
  },

  {
    name: "Observability",
    slug: "observability",
    group: "search",
  },

  // Frontend
  {
    name: "Markdown",
    slug: "markdown",
    group: "frontend",
  },

  {
    name: "Rendering",
    slug: "rendering",
    group: "frontend",
  },

  {
    name: "Editor",
    slug: "editor",
    group: "frontend",
  },

  {
    name: "Diff Viewer",
    slug: "diff-viewer",
    group: "frontend",
  },

  {
    name: "UI State",
    slug: "ui-state",
    group: "frontend",
  },

  {
    name: "CSS Art",
    slug: "css-art",
    group: "frontend",
  },

  {
    name: "Medieval Style",
    slug: "medieval-style",
    group: "frontend",
  },

  // Backend / Infra
  {
    name: "Backend",
    slug: "backend",
    group: "backend",
  },

  {
    name: "Pipeline",
    slug: "pipeline",
    group: "backend",
  },

  {
    name: "Database",
    slug: "database",
    group: "backend",
  },

  {
    name: "Performance",
    slug: "performance",
    group: "backend",
  },

  {
    name: "Infrastructure",
    slug: "infrastructure",
    group: "backend",
  },

  {
    name: "Linux",
    slug: "linux",
    group: "backend",
  },

  {
    name: "Networking",
    slug: "networking",
    group: "backend",
  },

  // Graphics
  {
    name: "Shader",
    slug: "shader",
    group: "graphics",
  },

  {
    name: "HLSL",
    slug: "hlsl",
    group: "graphics",
  },

  {
    name: "NPR",
    slug: "npr",
    group: "graphics",
  },

  {
    name: "Raymarching",
    slug: "raymarching",
    group: "graphics",
  },

  {
    name: "Volumetric",
    slug: "volumetric",
    group: "graphics",
  },

  // AI
  {
    name: "AI",
    slug: "ai",
    group: "ai",
  },

  {
    name: "Automation",
    slug: "automation",
    group: "ai",
  },

  // Misc
  {
    name: "Taxonomy",
    slug: "taxonomy",
    group: "system",
  },

  {
    name: "CMS",
    slug: "cms",
    group: "system",
  },

  {
    name: "Architecture",
    slug: "architecture",
    group: "system",
  },

  {
    name: "Optimization",
    slug: "optimization",
    group: "system",
  },

  {
    name: "Git",
    slug: "git",
    group: "devtools",
  },

  {
    name: "IDE",
    slug: "ide",
    group: "devtools",
  },
];