import { supabaseServer } from "./supabase-server";
import { embed } from "../scripts/embed";

export async function semanticSearch(query: string) {
  const queryEmbedding = await embed(query);

  const { data, error } = await supabaseServer.rpc("match_posts", {
    query_embedding: queryEmbedding,
    match_threshold: 0.1,
    match_count: 10,
  });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}