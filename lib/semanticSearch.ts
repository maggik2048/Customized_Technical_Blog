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

  // NO DIRECT MATCH
  if (matchIndex === -1) {
    return (
      content
        .replace(/\n/g, " ")
        .slice(0, 140) + "..."
    );
  }

  const start = Math.max(
    0,
    matchIndex - 80
  );

  const end = Math.min(
    content.length,
    matchIndex + query.length + 80
  );

  return (
    "..." +
    content
      .slice(start, end)
      .replace(/\n/g, " ") +
    "..."
  );
}

export async function semanticSearch(
  query: string
) {
  const normalizedQuery =
    query.toLowerCase();

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
  // 2. SCORE KEYWORD RESULTS
  //
  const scoredKeywordResults = (
    keywordResults || []
  ).map((post: any) => {
    const lowerTitle =
      post.title?.toLowerCase?.() || "";

    const lowerContent =
      post.content?.toLowerCase?.() || "";

    const exactTitleMatch =
      lowerTitle === normalizedQuery;

    const partialTitleMatch =
      lowerTitle.includes(
        normalizedQuery
      );

    const contentMatch =
      lowerContent.includes(
        normalizedQuery
      );

    let score = 0;

    //
    // PRIORITY:
    // exact title > partial title > content
    //
    if (exactTitleMatch) {
      score += 100;
    }

    if (partialTitleMatch) {
      score += 50;
    }

    if (contentMatch) {
      score += 20;
    }

    return {
      ...post,

      score,

      searchMeta: {
        matchedIn: exactTitleMatch
          ? "exact-title"
          : partialTitleMatch
          ? "title"
          : "content",

        snippet: createSnippet(
          post.content || "",
          query
        ),
      },
    };
  });

  //
  // 3. VECTOR SEARCH
  //
  let semanticResults: any[] = [];

  try {
    const queryEmbedding =
      await embed(query);

    const { data, error } =
      await supabaseServer.rpc(
        "match_posts",
        {
          query_embedding:
            queryEmbedding,

          match_threshold: 0.1,

          match_count: 10,
        }
      );

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
  // 4. SCORE SEMANTIC RESULTS
  //
  const scoredSemanticResults =
    semanticResults.map(
      (post: any) => ({
        ...post,

        //
        // semantic always lower priority
        //
        score:
          (post.similarity || 0) * 10,

        searchMeta: {
          matchedIn: "semantic",

          snippet: createSnippet(
            post.content || "",
            query
          ),
        },
      })
    );

  //
  // 5. MERGE + BEST SCORE PICK
  //
  const mergedMap = new Map();

  [
    ...scoredSemanticResults,
    ...scoredKeywordResults,
  ].forEach((post: any) => {
    const existing =
      mergedMap.get(post.id);

    //
    // KEEP HIGHER SCORE VERSION
    //
    if (
      !existing ||
      post.score >
        (existing.score || 0)
    ) {
      mergedMap.set(post.id, post);
    }
  });

  //
  // 6. FINAL SORT
  //
  return Array.from(
    mergedMap.values()
  ).sort(
    (a: any, b: any) =>
      (b.score || 0) -
      (a.score || 0)
  );
}