import { supabaseServer } from "./supabase-server";
import { embed } from "../scripts/embed";

export async function semanticSearch(query: string) {
  //
  // 1. KEYWORD SEARCH
  //
  const { data: keywordResults, error: keywordError } =
    await supabaseServer
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

  [...keywordResults || [], ...semanticResults].forEach(
    (post: any) => {
      mergedMap.set(post.id, post);
    }
  );

  return Array.from(mergedMap.values());
}