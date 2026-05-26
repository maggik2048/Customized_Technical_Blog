"use client";

import { useState } from "react";
import CategoryPostBoxRenderer from "./CategoryPostBoxRenderer";
import CategoryInsideBackgroundRenderer from "./CategoryInsideBackgroundRenderer";
import GlobalCinematicCanvas from "./GlobalCinematicCanvas";
import SearchBarButton from "./SearchBarButton";

export default function CategoryRenderer({
  posts,
  allPosts,
  slug,
}: {
  posts: any[];
  allPosts: any[];
  slug: string;
}) {
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [mode, setMode] = useState<"default" | "search">("default");

  const handleSearch = async (value: string) => {
    if (!value) {
      setSearchResults(null);
      setMode("default");
      return;
    }

    const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
    const data = await res.json();

    setSearchResults(data);
    setMode("search");
  };

  const displayPosts =
    mode === "search" && searchResults ? searchResults : posts;

  return (
    <>
      <GlobalCinematicCanvas />

      {/* SEARCH BAR */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <SearchBarButton onSearch={handleSearch} />
      </div>

      <div
        style={{
          minHeight: "100vh",
          padding: 60,
          position: "relative",
          overflowX: "hidden",
          fontFamily: "serif",
          color: "rgba(255, 255, 255, 0.78)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CategoryInsideBackgroundRenderer />

        {/* HEADER */}
        <div style={{ marginBottom: 42, textAlign: "center", width: 720 }}>
          <div style={{ fontSize: 14, letterSpacing: "0.25em" }}>
            {mode === "search" ? "SEARCH RESULTS" : "ARCHIVE CATEGORY"}
          </div>

          <h1 style={{ fontSize: 44, margin: 0 }}>
            {mode === "search" ? "RESULTS" : slug.toUpperCase()}
          </h1>
        </div>

        {/* CONTENT */}
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <CategoryPostBoxRenderer
            posts={displayPosts}
            allPosts={allPosts}
          />
        </div>
      </div>
    </>
  );
}