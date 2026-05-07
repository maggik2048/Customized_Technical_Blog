"use client";

import { usePathname } from "next/navigation";
import SidebarItem from "./SidebarItem";
import { Item } from "./sidebarData";

export default function Sidebar({ menu }: { menu?: Item[] }) {
  const pathname = usePathname();

  if (!menu) return null;

  return (
    <aside
      style={{
        width: "320px",
        height: "100vh",
        position: "relative",
        overflowY: "auto",
        fontFamily: "sans-serif",

        backgroundImage: "url('/images/sidebarRough.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
      }}
    >
      {/*  dark overlay (가독성) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.2)",
        }}
      />

      {/* content layer */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "16px",
          color: "white",
        }}
      >
        {menu.map((item) => (
          <SidebarItem key={item.name} item={item} pathname={pathname} />
        ))}
      </div>
    </aside>
  );
}