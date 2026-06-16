import { NextResponse } from "next/server";
import { semanticSearch } from "@/lib/semanticSearch";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Missing query" },
      { status: 400 }
    );
  }

  try {
    const results = await semanticSearch(query);

    return NextResponse.json(results);
  } catch (err) {
    console.error("Search API failed:", err);

    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}