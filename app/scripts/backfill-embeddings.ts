import { createClient } from "@supabase/supabase-js";

// Supabase client (server-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 중요: anon key 쓰면 update 막힘
);

// 임베딩 함수
async function embed(text: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  const json = await res.json();
  return json.data[0].embedding;
}

async function main() {
  console.log("Fetching posts...");

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, content, category");

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  if (!posts) {
    console.log("No posts found");
    return;
  }

  console.log(`Total posts: ${posts.length}`);

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    try {
      const text = `
        ${post.title}
        ${post.category}
        ${post.content}
      `;

      console.log(`[${i + 1}/${posts.length}] embedding: ${post.id}`);

      const embedding = await embed(text);

      const { error: updateError } = await supabase
        .from("posts")
        .update({ embedding })
        .eq("id", post.id);

      if (updateError) {
        console.error("Update error:", post.id, updateError);
      }
    } catch (err) {
      console.error("Failed on post:", post.id, err);
    }
  }

  console.log("Done.");
}

main();