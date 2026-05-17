"use client";

import { useState } from "react";
import CategoryCard from "./components/SidebarCategory/CategoryCard";
import TopHeaderText from "./components/TopHeaderText";
import SocialIcons from "./components/SocialIcons";
import LatestPosts from "./components/LatestPosts";
import ClickableImageBox from "./components/ClickableImageBox";
import WritePostButton from "./admin/write/WritePostButton";

import { CATEGORY_TREE } from "./components/SidebarCategory/CategoryTree";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 선택된 카테고리 찾기
  const selected = CATEGORY_TREE.find(
    (cat) => cat.slug === selectedCategory
  );

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          paddingTop: "20px",
          paddingLeft: "80px",
        }}
      >
        <TopHeaderText />
        <SocialIcons />

        <div style={{ height: "9vh", marginBottom: "1.5rem" }}>
          <h1 className="hero-title" style={{ fontSize: "9vh" }}>
            ART of CODE
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            maxWidth: "1024px",
            margin: "300px auto 0 auto",
            padding: "0 1rem",
            gap: "2rem",
          }}
        >
          {/* LEFT */}
          <div style={{ flex: 2 }}>

            {/* 카테고리 선택된 경우 */}
            {selected && (
              <>
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    marginBottom: 16,
                    padding: "8px 16px",
                    borderRadius: 6,
                    background: "#ddd",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  Back
                </button>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                  {selected.children?.map((item) => (
                    <CategoryCard
                      key={item.name}
                      item={{
                        ...item,
                        href: `/category/${item.slug}`,
                        count: 1,
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {/* 초기 상태 (이미지) */}
            {!selected && (
              <div style={{ marginTop: 16 }}>
                <ClickableImageBox
                  imageSrc="/images/code3.png"
                  width={540}
                  onClick={() => setSelectedCategory("cs_revisited")}
                />
              </div>
            )}

            {/* 글쓰기 버튼 */}
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <WritePostButton />
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1 }}>
            <LatestPosts />
          </div>
        </div>
      </div>
    </div>
  );
}