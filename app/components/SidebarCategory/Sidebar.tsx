// Sidebar.tsx

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
      className="sidebar"
      style={{
        width: 390,
        height: "100vh",

        overflowY: "auto",

        /**
         * CINEMATIC EDITORIAL BACKGROUND
         */
        background:
          "linear-gradient(rgba(10,10,10,0.46), rgba(10,10,10,0.68)), url('/images/covers/bg.jpg') center / cover no-repeat",

        padding: "40px 22px",
      }}
    >
      {shelfData.map((section, sectionIdx) => (
        <div
          key={section.slug}
          style={{
            marginBottom: 58,
          }}
        >
          <div
            style={{
              fontSize: 26,

              color:
                "rgba(219,205,180,0.88)",

              marginBottom: 18,

              textShadow:
                "0 1px 8px rgba(0,0,0,0.45)",
            }}
          >
            {section.name}
          </div>

          <div>
            {section.children?.map(
              (child, idx) => (
                <Book
                  key={child.slug}
                  item={child}
                  index={
                    idx +
                    sectionIdx * 10
                  }
                  pathname={pathname}
                />
              )
            )}
          </div>
        </div>
      ))}
    </aside>
  );
}