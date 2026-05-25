import { createClient } from "@supabase/supabase-js";
import { embed } from "../lib/embed"; // Xenova version

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  console.log("Fetching posts...");

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, content, category");

  if (error) {
    console.error(error);
    return;
  }

  if (!posts) return;

  console.log(`Total posts: ${posts.length}`);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    const text = `
      ${post.title}
      ${post.category}
      ${post.content}
    `;

    console.log(`[${i + 1}/${posts.length}] ${post.id}`);

    const vector = await embed(text); // Xenova

    const { error: updateError } = await supabase
      .from("posts")
      .update({ embedding: vector })
      .eq("id", post.id);

    if (updateError) {
      console.error("update fail:", post.id, updateError);
    }
  }

  console.log("DONE");
}

main();