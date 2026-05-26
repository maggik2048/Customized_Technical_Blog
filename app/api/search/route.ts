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

  const results = await semanticSearch(query);

  return NextResponse.json(results);
}