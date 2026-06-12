"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CategoryCard from "./components/SidebarCategory/CategoryCard";
import TopHeaderText from "./components/TopHeaderText";
import SocialIcons from "./components/SocialIcons";
import LatestPosts from "./components/LatestPosts";
import ClickableImageBox from "./components/ClickableImageBox";
import ProjectBoxRenderer from "./components/ProjectBoxRenderer";

import WritePostButton from "./admin/write/WritePostButton";
import AuthenticationButtons from "./signup/AuthenticationButtons";

import { CATEGORY_TREE } from "./components/SidebarCategory/Data/CategoryTree";

export default function HomePage() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

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

        {/* PROJECT LAUNCHER */}
        <ProjectBoxRenderer />

        {/* TOP RIGHT CONTROLS */}
        <div
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            zIndex: 10000,

            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 16,
          }}
        >
          <WritePostButton />

          <AuthenticationButtons />
        </div>

        <div
          style={{
            height: "18vh",
            marginBottom: "1.5rem",
          }}
        >
          <h1 className="hero-title">
            Art of codE
            <br />

            <span className="hero-subtitle">
              Technical aRchive
            </span>
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            maxWidth: "1024px",
            margin: "80px auto 0 auto",
            padding: "0 1rem",
            gap: "2rem",
          }}
        >
          {/* LEFT COLUMN */}
          <div style={{ flex: 2 }}>
            {selected && (
              <>
                <button
                  onClick={() =>
                    setSelectedCategory(null)
                  }
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
                  {selected.children?.map(
                    (item) => (
                      <CategoryCard
                        key={item.name}
                        item={{
                          ...item,
                          href: `/category/${item.slug}`,
                          count: 1,
                        }}
                      />
                    )
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {!selected && (
              <ClickableImageBox
                imageSrc="/images/exploreCateg2.png"
                width={420}
                onClick={() =>
                  router.push(
                    "/category/graphics_pipeline"
                  )
                }
              />
            )}

            <LatestPosts />
          </div>
        </div>
      </div>
    </div>
  );
}