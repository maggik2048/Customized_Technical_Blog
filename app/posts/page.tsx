import InfinitePosts from "@/app/components/papers/InfinitePosts";

export default async function Page() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts?page=1`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch posts");
    }

    const initialPosts = await res.json();

    return <InfinitePosts initialPosts={initialPosts} />;
  } catch (err) {
    return (
      <div style={{ padding: 40 }}>
        Failed to load posts
      </div>
    );
  }
}