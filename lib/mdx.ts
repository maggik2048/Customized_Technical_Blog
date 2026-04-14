// lib/mdx.ts
import { serialize } from "next-mdx-remote/serialize";

export async function parseMDX(content: string) {
  return await serialize(content);
}