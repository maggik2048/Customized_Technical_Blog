import { getMenu } from "./components/sidebarData";
import CategoryCard from "./components/CategoryCard";
import TopHeaderText from "./components/TopHeaderText";
import SocialIcons from "./components/SocialIcons";
import LatestPosts from "./components/LatestPosts";
import Link from "next/link";

export default async function HomePage() {
  const menu = await getMenu();

  return (
    <div>
      {/* 🔥 HERO SECTION CONTENT */}
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

        {/* 🔥 TITLE */}
        <div style={{ height: "9vh", marginBottom: "1.5rem" }}>
          <h1
            className="hero-title"
            style={{ fontSize: "9vh" }}
          >
            ART of CODE
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
          {/* CATEGORY */}
          <div style={{ flex: 2 }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
              {menu.map((section) =>
                section.children?.map((item) => (
                  <CategoryCard key={item.name} item={item} />
                ))
              )}
            </div>

            {/* BUTTON */}
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
                  Write New Post
                </button>
              </Link>
            </div>
          </div>

          {/* POSTS */}
          <div style={{ flex: 1 }}>
            <LatestPosts />
          </div>
        </div>
      </div>
    </div>
  );
}