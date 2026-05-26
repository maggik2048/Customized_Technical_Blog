// lib/semanticSearch.ts

import { supabaseServer } from "./supabase-server";
import { embed } from "../scripts/embed";

function createSnippet(
  content: string,
  query: string
) {
  if (!content) return "";

  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const matchIndex =
    lowerContent.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return content.slice(0, 120) + "...";
  }

  const start = Math.max(0, matchIndex - 80);

  const end = Math.min(
    content.length,
    matchIndex + query.length + 80
  );

  return (
    "..." +
    content.slice(start, end).replace(/\n/g, " ") +
    "..."
  );
}

export async function semanticSearch(
  query: string
) {
  //
  // 1. KEYWORD SEARCH
  //
  const {
    data: keywordResults,
    error: keywordError,
  } = await supabaseServer
    .from("posts")
    .select("*")
    .or(
      `title.ilike.%${query}%,content.ilike.%${query}%`
    )
    .limit(20);

  if (keywordError) {
    console.error(
      "Keyword search error:",
      keywordError
    );
  }

  //
  // 2. VECTOR SEARCH
  //
  let semanticResults: any[] = [];

  try {
    const queryEmbedding = await embed(query);

    const { data, error } =
      await supabaseServer.rpc("match_posts", {
        query_embedding: queryEmbedding,
        match_threshold: 0.1,
        match_count: 10,
      });

    if (error) {
      console.error(
        "Semantic search error:",
        error
      );
    } else {
      semanticResults = data || [];
    }
  } catch (err) {
    console.error(
      "Embedding generation failed:",
      err
    );
  }

  //
  // 3. MERGE + DEDUPE
  //
  const mergedMap = new Map();

  [
    ...(keywordResults || []),
    ...semanticResults,
  ].forEach((post: any) => {
    const lowerTitle =
      post.title?.toLowerCase?.() || "";

    const lowerContent =
      post.content?.toLowerCase?.() || "";

    const lowerQuery = query.toLowerCase();

    const titleMatched =
      lowerTitle.includes(lowerQuery);

    const contentMatched =
      lowerContent.includes(lowerQuery);

    mergedMap.set(post.id, {
      ...post,

      searchMeta: {
        matchedIn: titleMatched
          ? "title"
          : contentMatched
          ? "content"
          : "semantic",

        snippet: createSnippet(
          post.content || "",
          query
        ),
      },
    });
  });

  return Array.from(mergedMap.values());
}