"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CategoryCard from "./components/SidebarCategory/CategoryCard";
import TopHeaderText from "./components/TopHeaderText";
import SocialIcons from "./components/SocialIcons";
import LatestPosts from "./components/LatestPosts";
import ClickableImageBox from "./components/ClickableImageBox";
import WritePostButton from "./admin/write/WritePostButton";

import { CATEGORY_TREE } from "./components/SidebarCategory/CategoryTree";

export default function HomePage() {

  const router = useRouter();

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<string | null>(null);

  const selected =
    CATEGORY_TREE.find(
      (cat) =>
        cat.slug ===
        selectedCategory
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

        {/* Pencil Effect Button */}
        <button
          onClick={() => {

            console.log(
              "PENCIL BUTTON CLICKED"
            );

            router.push(
              "/Graphics/PencilEffect"
            );
          }}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 9999,
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#222",
            color: "#fff",
          }}
        >
          Pencil Background
        </button>

        {/* HDRI Renderer Button */}
        <button
          onClick={() => {

            console.log(
              "HDRI BUTTON CLICKED"
            );

            router.push(
              "/Graphics/MaterialSystem"
            );
          }}
          style={{
            position: "absolute",
            top: 70,
            right: 20,
            zIndex: 9999,
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#444",
            color: "#fff",
          }}
        >
          HDRI Renderer
        </button>

        {/* World Stream Renderer Button */}
        <button
          onClick={() => {

            console.log(
              "WORLD STREAM BUTTON CLICKED"
            );

            router.push(
              "/Graphics/WorldStreamingSystem"
            );
          }}
          style={{
            position: "absolute",
            top: 120,
            right: 20,
            zIndex: 9999,
            padding: "10px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: "#2c5cff",
            color: "#fff",
          }}
        >
          WorldStreamRenderer
        </button>

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
            margin: "300px auto 0 auto",
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
                          href:
                            `/category/${item.slug}`,
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