// app/page.tsx
import { getMenu } from "./components/sidebarData";
import CategoryCard from "./components/CategoryCard";
import TopHeaderText from "./components/TopHeaderText";
import SocialIcons from "./components/SocialIcons";
import LatestPosts from "./components/LatestPosts";
import Link from "next/link";

// 🔥 async 추가 (핵심)
export default async function HomePage() {
  const menu = await getMenu(); // 🔥 이 줄 추가

  return (
    <div>
      {/* 🔥 HERO SECTION */}
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
        {/* 🔹 TOP NAV */}
        <TopHeaderText />

        {/* 🔹 SOCIAL ICONS */}
        <SocialIcons />

        {/* 🔥 HERO TITLE */}
        <div style={{ position: "relative", height: "9vh", marginBottom: "1.5rem" }}>
          <h1
            className="hero-title"
            style={{
              fontSize: "9vh",
            }}
          >
            Graphics Lab V2
          </h1>
        </div>

        {/* 🔥 MAIN GRID */}
        <div
          style={{
            display: "flex",
            maxWidth: "1024px",
            margin: "300px auto 0 auto",
            padding: "0 1rem",
            gap: "2rem",
          }}
        >
          {/* 🔹 CATEGORY GRID */}
          <div style={{ flex: 2 }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {menu.map((section) =>
                section.children?.map((item) => (
                  <CategoryCard key={item.name} item={item} />
                ))
              )}
            </div>

            {/* 🔹 글쓰기 버튼 */}
            <div style={{ marginTop: 32, textAlign: "center" }}>
              <Link href="/admin/write">
                <button
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#1e40af",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  새 글 작성
                </button>
              </Link>
            </div>
          </div>

          {/* 🔹 LATEST POSTS */}
          <div style={{ flex: 1 }}>
            <LatestPosts />
          </div>
        </div>
      </div>
    </div>
  );
}