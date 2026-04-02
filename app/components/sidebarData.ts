import { supabase } from "@/lib/supabase";

export interface Item {
  name: string;
  category?: string;
  href?: string;
  count?: number;
  children?: Item[];
}

// 🔥 menu를 "함수"로 만든다 (핵심)
export async function getMenu(): Promise<Item[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("category");

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  // 🔥 count 계산
  const counts: Record<string, number> = {};

  data?.forEach((row) => {
    const key = row.category?.toLowerCase();
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });

  // 🔥 기존 구조 그대로 + count만 주입
  return [
    {
      name: "Computer Science Revisited",
      children: [
        {
          name: "Network1",
          category: "network",
          href: "/category/network",
          count: counts["network"] ?? 0,
        },
        {
          name: "Artificial Intelligence",
          category: "ai",
          href: "/category/ai",
          count: counts["ai"] ?? 0,
        },
        {
          name: "Discrete Mathematics",
          category: "discrete",
          href: "/category/discrete",
          count: counts["discrete"] ?? 0,
        },
        {
          name: "Data Structure & Algorithm",
          category: "dsa",
          href: "/category/dsa",
          count: counts["dsa"] ?? 0,
        },
        {
          name: "Unreal Engine",
          category: "unrealengine",
          href: "/category/unrealengine",
          count: counts["unrealengine"] ?? 0,
        },
      ],
    },
  ];
}