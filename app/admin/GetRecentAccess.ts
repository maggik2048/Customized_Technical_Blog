import { supabase } from "@/lib/supabase";

import { CATEGORY_TREE } from "@/app/components/SidebarCategory/CategoryTree";

export async function getRecentAccessCategories() {
 const { data, error } = await supabase
 .from("posts")
 .select("category, updated_at")
 .order("updated_at", {
 ascending: false,
 });

 if (error || !data) {
 console.error(error);

 return CATEGORY_TREE.flatMap(
 (parent) => parent.children || []
 );
 }

 /*
 recent category order
 */

 const recentOrder = Array.from(
 new Set(
 data.map((post) => post.category)
 )
 );

 const priorityMap = new Map<
 string,
 number
 >();

 recentOrder.forEach(
 (slug, index) => {
 priorityMap.set(slug, index);
 }
 );

 /*
 flatten all categories
 */

 const allCategories =
 CATEGORY_TREE.flatMap(
 (parent) =>
 parent.children || []
 );

 /*
 recent priority sorting
 */

 return [...allCategories].sort(
 (a, b) => {
 const aPriority =
 priorityMap.get(a.slug) ??
 Number.MAX_SAFE_INTEGER;

 const bPriority =
 priorityMap.get(b.slug) ??
 Number.MAX_SAFE_INTEGER;

 return (
 aPriority - bPriority
 );
 }
 );
}