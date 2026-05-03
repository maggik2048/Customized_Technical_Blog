// menuService.ts
import { supabase } from "./supabaseClient";
import { CATEGORY_TREE } from "./SidebarCategory/CategoryTree";
import { Item } from "./types";

export async function getMenu(): Promise<Item[]> {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("category");

  if (error) {
    console.error("Supabase error:", error);
    return CATEGORY_TREE.map((cat) => ({
      ...cat,
      children: cat.children?.map((child) => ({
        ...child,
        href: `/category/${child.slug}`,
        count: 0,
      })),
    }));
  }

  // 카테고리별 count 계산
  const counts: Record<string, number> = {};
  posts?.forEach((row) => {
    const key = row.category?.toLowerCase();
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });

  // 트리 구조 유지 + 하위 카테고리에 count 적용
  return CATEGORY_TREE.map((cat) => ({
    ...cat,
    children: cat.children?.map((child) => ({
      ...child,
      href: `/category/${child.slug}`,
      count: counts[child.slug] ?? 0,
    })),
  }));
}