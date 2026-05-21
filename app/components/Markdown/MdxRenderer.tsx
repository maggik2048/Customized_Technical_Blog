// app/components/MdxRenderer.tsx
"use client";

import { MDXRemote } from "next-mdx-remote";
import SatProjection from "@/app/Graphics/SatProjection";

const components = {
  SatProjection,
};

export default function MdxRenderer({ source }: { source: any }) {
  return <MDXRemote {...source} components={components} />;
}