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
         * CUSTOM BACKGROUND IMAGE
         */
        backgroundImage:
          "url('/images/covers/bg.jpg')",

        backgroundSize: "cover",

        backgroundPosition: "center",

        backgroundRepeat: "no-repeat",

        backgroundAttachment: "fixed",

        /**
         * 기존 dark bookshelf mood 유지용
         */
        backgroundColor: "#120F0E",

        /**
         * 이미지 위 살짝 cinematic darkening
         */
        backgroundBlendMode: "multiply",

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