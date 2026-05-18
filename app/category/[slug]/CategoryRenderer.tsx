"use client";

import CategoryPostBoxRenderer from "./CategorypostBoxRenderer";
import CategoryInsideBackgroundRenderer from "./CategoryInsideBackgroundRenderer";

export default function CategoryRenderer({
  posts,
  allPosts,
  slug,
}: {
  posts: any[];
  allPosts: any[];
  slug: string;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 60,
        position: "relative",
        overflow: "hidden",
        fontFamily: "serif",
        color: "rgba(40,40,40,0.78)",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        width: "100%",
      }}
    >
      <CategoryInsideBackgroundRenderer />

      <div
        style={{
          marginBottom: 42,
          textAlign: "center",
          position: "relative",
          zIndex: 10,
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: "0.25em",
            color: "rgba(90,90,90,0.7)",
            marginBottom: 10,
          }}
        >
          ARCHIVE CATEGORY
        </div>

        <h1
          style={{
            fontSize: 44,
            letterSpacing: "0.12em",
            color: "rgba(50,50,50,0.85)",
            margin: 0,
            textShadow: "0 0 18px rgba(255,255,255,0.25)",
          }}
        >
          {slug.toUpperCase()}
        </h1>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* layout is now controlled externally */}
        <CategoryPostBoxRenderer posts={posts} allPosts={allPosts} />
      </div>
    </div>
  );
}