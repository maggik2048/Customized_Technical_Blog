import { supabase } from "@/lib/supabase";

// ---------------------------
// 1️ 타입 정의
// ---------------------------
export interface Item {
  name: string;
  slug: string;        // category key
  href?: string;
  count?: number;
  children?: Item[];
}

// ---------------------------
// 2️ 카테고리 config (추가/수정 쉬움)
// ---------------------------
const CATEGORY_CONFIG: Omit<Item, "href" | "count">[] = [
  { name: "Network1", slug: "network" },
  { name: "Artificial Intelligence", slug: "ai" },
  { name: "Discrete Mathematics", slug: "discrete" },
  { name: "Data Structure & Algorithm", slug: "dsa" },
  { name: "Unreal Engine", slug: "unrealengine" },
  { name: "Embeded", slug: "embed" },
  // 나중에 한 줄 추가만 하면 됨
];

// ---------------------------
// 3️ 메뉴 생성 함수
// ---------------------------
export async function getMenu(): Promise<Item[]> {
  // Supabase에서 posts의 category 가져오기
  const { data: posts, error } = await supabase
    .from("posts")
    .select("category");

  if (error) {
    console.error("Supabase error:", error);
    return [
      {
        name: "Computer Science Revisited",
        children: CATEGORY_CONFIG.map((cat) => ({
          ...cat,
          href: `/category/${cat.slug}`,
          count: 0,
        })),
      },
    ];
  }

  // ---------------------------
  // 4️카테고리별 count 계산
  // ---------------------------
  const counts: Record<string, number> = {};

  posts?.forEach((row) => {
    const key = row.category?.toLowerCase();
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });

  // ---------------------------
  // 5 최종 메뉴 구조 생성
  // ---------------------------
  return [
    {
      name: "Computer Science Revisited",
      children: CATEGORY_CONFIG.map((cat) => ({
        ...cat,
        href: `/category/${cat.slug}`,
        count: counts[cat.slug] ?? 0,
      })),
    },
  ];
}