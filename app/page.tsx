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

        {/* GRAPHICS PROJECT BUTTONS */}
        <ProjectBoxRenderer />

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

        {/* AUTH BUTTONS BELOW TITLE */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "100px",
            marginBottom: "20px",
          }}
        >
          <AuthenticationButtons />
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
          <div style={{ flex: 2 }}>
            {selected && (
              <>
                <button
                  onClick={() =>
                    setSelectedCategory(
                      null
                    )
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

            {!selected && (
              <div
                style={{
                  marginTop: 16,
                }}
              >
                <ClickableImageBox
                  imageSrc="/images/exploreCateg2.png"
                  width={540}
                  onClick={() =>
                    router.push(
                      "/category/graphics_pipeline"
                    )
                  }
                />
              </div>
            )}

            <div
              style={{
                marginTop: 32,
                textAlign: "center",
              }}
            >
              <WritePostButton />
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <LatestPosts />
          </div>
        </div>
      </div>
    </div>
  );
}