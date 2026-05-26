"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import CategoryPostBoxRenderer from "./CategoryPostBoxRenderer";
import CategoryInsideBackgroundRenderer from "./CategoryInsideBackgroundRenderer";
import GlobalCinematicCanvas from "./GlobalCinematicCanvas";

export default function CategoryRenderer({
  posts,
  allPosts,
  slug,
}: {
  posts: any[];
  allPosts: any[];
  slug: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL QUERY
  const initialQuery = searchParams.get("q") || "";

  // SEARCH RESULT STATE
  const [searchResults, setSearchResults] =
    useState<any[] | null>(null);

  // PAGE MODE
  const [mode, setMode] =
    useState<"default" | "search">(
      initialQuery ? "search" : "default"
    );

  // CURRENT QUERY
  const [currentQuery, setCurrentQuery] =
    useState(initialQuery);

  /**
   * URL QUERY → LOCAL STATE SYNC
   *
   * Example:
   * /category/math?q=vector
   */
  useEffect(() => {
    if (!initialQuery.trim()) {
      setMode("default");
      setCurrentQuery("");
      return;
    }

    setMode("search");
    setCurrentQuery(initialQuery);
  }, [initialQuery]);

  /**
   * INITIAL SEARCH RESTORE
   *
   * F5 refresh support
   * Direct URL access support
   */
  useEffect(() => {
    if (!initialQuery.trim()) return;

    const runInitialSearch = async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(
            initialQuery
          )}`
        );

        if (!res.ok) {
          throw new Error(
            `Search API failed: ${res.status}`
          );
        }

        const data = await res.json();

        setSearchResults(data);
        setMode("search");
      } catch (err) {
        console.error(
          "Initial search restore failed:",
          err
        );

        // FAIL SAFE
        setSearchResults([]);
      }
    };

    runInitialSearch();
  }, [initialQuery]);

  /**
   * MAIN SEARCH HANDLER
   */
  const handleSearch = async (value: string) => {
    const trimmed = value.trim();

    setCurrentQuery(trimmed);

    /**
     * EMPTY QUERY
     * → RESET PAGE
     */
    if (!trimmed) {
      setSearchResults(null);
      setMode("default");

      router.replace(`/category/${slug}`);

      return;
    }

    try {
      /**
       * URL SYNC
       */
      router.replace(
        `/category/${slug}?q=${encodeURIComponent(
          trimmed
        )}`
      );

      /**
       * GLOBAL SEARCH
       */
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(
          trimmed
        )}`
      );

      if (!res.ok) {
        throw new Error(
          `Search API failed: ${res.status}`
        );
      }

      const data = await res.json();

      setSearchResults(data);
      setMode("search");
    } catch (err) {
      console.error("Search failed:", err);

      // FAIL SAFE
      setSearchResults([]);
      setMode("search");
    }
  };

  /**
   * DISPLAY POSTS
   */
  const displayPosts =
    mode === "search" && searchResults
      ? searchResults
      : posts;

  return (
    <>
      <GlobalCinematicCanvas />

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
        <div
          style={{
            marginBottom: 42,
            textAlign: "center",
            width: 720,
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.25em",
            }}
          >
            {mode === "search"
              ? "SEARCH RESULTS"
              : "ARCHIVE CATEGORY"}
          </div>

          <h1
            style={{
              fontSize: 44,
              margin: 0,
            }}
          >
            {mode === "search"
              ? currentQuery.toUpperCase()
              : slug.toUpperCase()}
          </h1>
        </div>

        {/* CONTENT */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CategoryPostBoxRenderer
            posts={displayPosts}
            allPosts={allPosts}
            onSearch={handleSearch}
            currentQuery={currentQuery}
          />
        </div>
      </div>
    </>
  );
}