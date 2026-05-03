import Sidebar from "./Sidebar";
import { getMenu } from "./sidebarData";

// ❗ Server Component (절대 "use client" 넣지 마라)
export default async function SidebarContainer() {
  try {
    const menu = await getMenu();

    // 🔥 디버깅용 (터미널에 찍힘)
    console.log("menu:", menu);

    return <Sidebar menu={menu} />;
  } catch (err) {
    console.error("SidebarContainer error:", err);

    // ❗ 에러나도 UI 깨지지 않게 fallback
    return <Sidebar menu={[]} />;
  }
}