// lib/semanticSearch.ts

import { supabaseServer } from "./supabase-server";
import { embed } from "../scripts/embed";

import synonymMap from "./synonymMap.json";

function createSnippet(
  content: string,
  query: string
) {
  if (!content) return "";

  const lowerContent =
    content.toLowerCase();

  const lowerQuery =
    query.toLowerCase();

  const matchIndex =
    lowerContent.indexOf(lowerQuery);

  //
  // NO DIRECT MATCH
  //
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
    matchIndex +
      query.length +
      80
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
  // 1. QUERY EXPANSION
  //
  const synonyms =
    synonymMap[
      normalizedQuery as keyof typeof synonymMap
    ] || [];

  const expandedQueries = [
    normalizedQuery,
    ...synonyms,
  ];

  //
  // 2. BUILD OR QUERY
  //
  const orQuery =
    expandedQueries
      .map(
        q =>
          `title.ilike.%${q}%,content.ilike.%${q}%`
      )
      .join(",");

  //
  // 3. KEYWORD SEARCH
  //
  const {
    data: keywordResults,
    error: keywordError,
  } = await supabaseServer
    .from("posts")
    .select("*")
    .or(orQuery)
    .limit(30);

  if (keywordError) {
    console.error(
      "Keyword search error:",
      keywordError
    );
  }

  //
  // 4. SCORE KEYWORD RESULTS
  //
  const scoredKeywordResults = (
    keywordResults || []
  ).map((post: any) => {
    const lowerTitle =
      post.title?.toLowerCase?.() ||
      "";

    const lowerContent =
      post.content?.toLowerCase?.() ||
      "";

    let score = 0;

    let matchedIn = "semantic";

    //
    // ORIGINAL QUERY MATCHES
    //
    const exactTitleMatch =
      lowerTitle ===
      normalizedQuery;

    const partialTitleMatch =
      lowerTitle.includes(
        normalizedQuery
      );

    const contentMatch =
      lowerContent.includes(
        normalizedQuery
      );

    //
    // STRONG BOOST
    //
    if (exactTitleMatch) {
      score += 100;
      matchedIn = "exact-title";
    }

    if (partialTitleMatch) {
      score += 50;
      matchedIn = "title";
    }

    if (contentMatch) {
      score += 20;
      matchedIn = "content";
    }

    //
    // SYNONYM MATCHES
    //
    expandedQueries.forEach(
      expanded => {
        if (
          expanded === normalizedQuery
        ) {
          return;
        }

        const titleSynonymMatch =
          lowerTitle.includes(
            expanded
          );

        const contentSynonymMatch =
          lowerContent.includes(
            expanded
          );

        if (titleSynonymMatch) {
          score += 15;

          if (
            matchedIn ===
            "semantic"
          ) {
            matchedIn =
              "synonym-title";
          }
        }

        if (contentSynonymMatch) {
          score += 8;

          if (
            matchedIn ===
            "semantic"
          ) {
            matchedIn =
              "synonym-content";
          }
        }
      }
    );

    return {
      ...post,

      score,

      searchMeta: {
        matchedIn,

        expandedQueries,

        snippet: createSnippet(
          post.content || "",
          query
        ),
      },
    };
  });

  //
  // 5. VECTOR SEARCH
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
  // 6. SCORE SEMANTIC RESULTS
  //
  const scoredSemanticResults =
    semanticResults.map(
      (post: any) => ({
        ...post,

        //
        // semantic lower priority
        //
        score:
          (post.similarity || 0) *
          10,

        searchMeta: {
          matchedIn: "semantic",

          expandedQueries,

          snippet: createSnippet(
            post.content || "",
            query
          ),
        },
      })
    );

  //
  // 7. MERGE + BEST SCORE PICK
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
  // 8. FINAL SORT
  //
  return Array.from(
    mergedMap.values()
  ).sort(
    (a: any, b: any) =>
      (b.score || 0) -
      (a.score || 0)
  );
}