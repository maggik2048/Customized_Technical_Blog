"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { CATEGORY_TREE } from "./CategoryTree";
import Book from "./SidebarBook";

export default function Sidebar() {
  const pathname = usePathname();
  const shelfData = useMemo(() => CATEGORY_TREE, []);

  return (
    <aside
      style={{
        width: 390,
        height: "100vh",
        overflowY: "auto",
        background:
          "linear-gradient(to right, #161311 0%, #1B1715 28%, #120F0E 100%)",
        padding: "40px 22px",
      }}
    >
      {shelfData.map((section, sectionIdx) => (
        <div key={section.slug} style={{ marginBottom: 58 }}>
          <div
            style={{
              fontSize: 26,
              color: "rgba(219,205,180,0.88)",
              marginBottom: 18,
            }}
          >
            {section.name}
          </div>

          <div>
            {section.children?.map((child, idx) => (
              <Book
                key={child.slug}
                item={child}
                index={idx + sectionIdx * 10}
                pathname={pathname}
              />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}