"use client";

import { usePathname } from "next/navigation";
import SidebarItem from "./SidebarItem";
import { Item } from "./sidebarData";

export default function Sidebar({ menu }: { menu?: Item[] }) {
  const pathname = usePathname();

  if (!menu) return null;

  return (
    <aside className="w-80 h-screen bg-gray-900 text-white p-4 overflow-y-auto font-sans">
      {menu.map((item) => (
        <SidebarItem key={item.name} item={item} pathname={pathname} />
      ))}
    </aside>
  );
}