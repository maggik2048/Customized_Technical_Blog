// ProjectTree.ts

export type ProjectItem = {
  name: string;
  slug: string;

  /**
   * 연결된 카테고리 slug
   * ex) ["systems", "ai"]
   */
  categories: string[];

  /**
   * 프로젝트 기본 태그
   */
  tags?: string[];

  /**
   * optional description
   */
  description?: string;
};

export const PROJECT_TREE: ProjectItem[] = [
  {
    name: "Semantic Search",
    slug: "semantic_search",

    categories: ["systems", "ai"],

    tags: [
      "semantic-search",
      "retrieval",
      "ranking",
      "embeddings",
      "search-engine",
      "indexing",
      "observability",
    ],

    description:
      "Semantic retrieval engine, ranking pipeline, and search infrastructure experiments.",
  },

  {
    name: "Gamification Of Learning",
    slug: "gamification_of_learning",

    categories: ["frontend", "systems"],

    tags: [
      "education",
      "gamification",
      "ui-state",
      "tracking",
    ],

    description:
      "Learning experience system with gamification mechanics and progress tracking.",
  },

    {
    name: "DOM-range-highlighter",
    slug: "highlighter",

    categories: ["frontend", "systems"],

    tags: [
      "color",
      "highlight",
      "DOM",
      "note",
    ],

    description:
      "realistic, natural highlighter pen implementation -upscend from CSS styling.",
  },

  {
    name: "AI API Exporter",
    slug: "ai_api_exporter",

    categories: ["ai", "systems"],

    tags: [
      "ai",
      "api",
      "exporter",
      "automation",
      "pipeline",
    ],

    description:
      "AI response exporting and processing pipeline infrastructure.",
  },

  {
    name: "NPR Shader Programming : Charcoal",
    slug: "npr_shader_programming_charcoal",

    categories: ["graphics", "experiments"],

    tags: [
      "shader",
      "hlsl",
      "npr",
      "rendering",
      "graphics",
      "stylization",
    ],

    description:
      "Non-photorealistic rendering experiments using charcoal-style shaders.",
  },

  {
    name: "GIS Based World Streaming",
    slug: "gis_based_world_streaming",

    categories: ["systems", "graphics"],

    tags: [
      "gis",
      "world-streaming",
      "streaming",
      "terrain",
      "optimization",
    ],

    description:
      "Large-scale GIS terrain streaming and world partitioning experiments.",
  },

  {
    name: "Asset Management Database",
    slug: "asset_management_database",

    categories: ["systems", "backend"],

    tags: [
      "database",
      "asset-management",
      "sql",
      "pipeline",
      "backend",
    ],

    description:
      "Asset indexing and management database architecture.",
  },

  {
    name: "NAS & Linux Environment",
    slug: "nas_linux_environment",

    categories: ["systems", "infrastructure"],

    tags: [
      "linux",
      "nas",
      "server",
      "infrastructure",
      "networking",
      "self-hosting",
    ],

    description:
      "Linux server and NAS infrastructure setup and maintenance.",
  },

  {
    name: "HLSL : Ray March Cloud",
    slug: "hlsl_raymarch_cloud",

    categories: ["graphics", "experiments"],

    tags: [
      "raymarching",
      "cloud",
      "volumetric",
      "shader",
      "hlsl",
    ],

    description:
      "Volumetric cloud rendering experiments using ray marching.",
  },

  {
    name: "GitDiff Visualizer",
    slug: "gitdiff_visualizer",

    categories: ["frontend", "systems"],

    tags: [
      "diff-viewer",
      "visualization",
      "rendering",
      "editor",
      "markdown",
    ],

    description:
      "Git diff visualization and markdown rendering infrastructure.",
  },

  {
    name: "Frontend & Backend Engineering",
    slug: "fullstack",

    categories: ["frontend", "backend", "systems"],

    tags: [
      "frontend",
      "backend",
      "architecture",
      "rendering",
      "performance",
      "engineering",
    ],

    description:
      "General fullstack engineering, architecture, and infrastructure work.",
  },

  {
    name: "Category Project Tag System",
    slug: "projecttag",

    categories: ["frontend", "systems"],

    tags: [
      "taxonomy",
      "metadata",
      "tag-system",
      "category-system",
      "cms",
    ],

    description:
      "Hierarchical category, project, and tag management system.",
  },

  {
    name: "AuthSecuritySystem",
    slug: "authsecurity",

    categories: ["backend", "systems"],

    tags: [
      "restriction",
      "security",
      "authentication",
      "authorization",
      "middleware",
    ],

    description:
      "Authentication/Authorization.",
  },

    {
    name: "DocumentRenderer_NaturalEcrit",
    slug: "doc_renderer_naturalecrit",

    categories: ["frontend", "systems"],

    tags: [
      "chalcoal",
      "naturalshader",
      "letter",
      "rendering",
      "pen",
    ],

    description:
      "naturalistic pen&paper rendering",
  },

  {
    name: "CategoryPostboxRenderer",
    slug: "categorypostboxrenderer",

    categories: ["frontend", "systems"],

    tags: [
      "category",
      "imagethumbnail",
      "fetch",
      "rendering",
      "post",
    ],

    description:
      "sophistication of categorypostbox rendering.유지보수,고도화",
  },


    {
    name: "Jpg to AVIF Optimization pipeline ",
    slug: "jpgtoavif",

    categories: ["optimization", "database"],

    tags: [
      "avif",
      "imagethumbnail",
      "fetch",
      "rendering",
      "post",
      "jpg",
      "image",
      "upload",
    ],

    description:
      "Jpg to AVIF Optimization pipeline => database usage optimization",
  },

      {
    name: "MainHomepage Visual Development ",
    slug: "homepagevisdev",

    categories: ["frontend", "graphics"],

    tags: [
      "rendering",
      "aesthetic",
      "entrance",
      "background",
      "web",
    ],

    description:
      "MainHomepage Visual Development",
  },

  {
  name: "Sync GithubCommit to TechnicalBlogPost",

  slug: "syncgitblog",

  categories: [
    "developer-tools",
    "knowledge-management",
  ],

  tags: [
    "nextjs",
    "github",
    "git",
    "debugging",
    "commit-history",
    "technical-blog",
    "mdx",
    "automation",
    "developer-experience",
    "documentation",
    "webhooks",
    "github-actions",
  ],

  description:
    "A GitHubDesktop&homepage-integrated system  that links technical blog posts directly to commit history, diffs, and development workflows TO Corresponding BlogPost(and other way around too) creating a searchable knowledge base for debugging and project evolution.",
}
];