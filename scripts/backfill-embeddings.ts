import "dotenv/config";
import { supabaseServer } from "../lib/supabase-server";
import { embed } from "./embed";

async function main() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }

  console.log("Fetching posts...");

  const { data: posts, error } = await supabaseServer
    .from("posts")
    .select("id, title, content, category");

  if (error) {
    console.error(error);
    return;
  }

  if (!posts) return;

  console.log(`Total posts: ${posts.length}`);

  for (const [i, post] of posts.entries()) {
    try {
      const text = [
        post.title,
        `category: ${post.category}`,
        post.content,
      ].join("\n");

      console.log(`[${i + 1}/${posts.length}] ${post.id}`);

      const vector = await embed(text);

      const { error: updateError } = await supabaseServer
        .from("posts")
        .update({ embedding: vector })
        .eq("id", post.id);

      if (updateError) {
        console.error("update fail:", post.id, updateError);
      }
    } catch (err) {
      console.error("failed:", post.id, err);
    }
  }

  console.log("DONE");
}

main();