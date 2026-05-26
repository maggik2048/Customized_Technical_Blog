// lib/semanticSearch.ts

import { supabaseServer } from "./supabase-server";
import { embed } from "../scripts/embed";

import synonymMap from "./synonymMap.json";

import natural from "natural";

const wordnet = new natural.WordNet();

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

//
// WORDNET LOOKUP
//
async function getWordnetSynonyms(
  query: string
): Promise<string[]> {
  return new Promise(resolve => {
    wordnet.lookup(
      query,
      (results: any[]) => {
        const synonyms =
          results.flatMap(
            result =>
              result.synonyms || []
          );

        //
        // normalize
        //
        const cleaned =
          synonyms
            .map((s: string) =>
              s
                .replace(/_/g, " ")
                .toLowerCase()
                .trim()
            )
            .filter(Boolean);

        //
        // dedupe
        //
        resolve([
          ...new Set(cleaned),
        ]);
      }
    );
  });
}

export async function semanticSearch(
  query: string
) {
  const normalizedQuery =
    query.toLowerCase();

  //
  // 1. CUSTOM SYNONYMS
  //
  const customSynonyms =
    synonymMap[
      normalizedQuery as keyof typeof synonymMap
    ] || [];

  //
  // 2. WORDNET SYNONYMS
  //
  let wordnetSynonyms: string[] =
    [];

  try {
    wordnetSynonyms =
      await getWordnetSynonyms(
        normalizedQuery
      );
  } catch (err) {
    console.error(
      "WordNet synonym error:",
      err
    );
  }

  //
  // 3. MERGE SYNONYMS
  //
  const expandedQueries = [
    normalizedQuery,

    ...customSynonyms,

    ...wordnetSynonyms,
  ]
    //
    // remove duplicates
    //
    .filter(
      (value, index, self) =>
        self.indexOf(value) ===
        index
    )

    //
    // avoid huge query explosion
    //
    .slice(0, 20);

  //
  // 4. BUILD OR QUERY
  //
  const orQuery =
    expandedQueries
      .map(
        q =>
          `title.ilike.%${q}%,content.ilike.%${q}%`
      )
      .join(",");

  //
  // 5. KEYWORD SEARCH
  //
  const {
    data: keywordResults,
    error: keywordError,
  } = await supabaseServer
    .from("posts")
    .select("*")
    .or(orQuery)
    .limit(40);

  if (keywordError) {
    console.error(
      "Keyword search error:",
      keywordError
    );
  }

  //
  // 6. SCORE KEYWORD RESULTS
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

        //
        // custom synonym stronger
        //
        const isCustomSynonym =
          customSynonyms.includes(
            expanded
          );

        const titleBoost =
          isCustomSynonym
            ? 18
            : 10;

        const contentBoost =
          isCustomSynonym
            ? 10
            : 5;

        if (titleSynonymMatch) {
          score += titleBoost;

          if (
            matchedIn ===
            "semantic"
          ) {
            matchedIn =
              "synonym-title";
          }
        }

        if (contentSynonymMatch) {
          score += contentBoost;

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
  // 7. VECTOR SEARCH
  //
  let semanticResults: any[] =
    [];

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
  // 8. SCORE SEMANTIC RESULTS
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
  // 9. MERGE + BEST SCORE PICK
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
  // 10. FINAL SORT
  //
  return Array.from(
    mergedMap.values()
  ).sort(
    (a: any, b: any) =>
      (b.score || 0) -
      (a.score || 0)
  );
}