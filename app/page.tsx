import { menu } from "./components/sidebarData";
import CategoryCard from "./components/CategoryCard";
import TopHeaderText from "./components/TopHeaderText";
import SocialIcons from "./components/SocialIcons"; // ← 새로 추가

export default function HomePage() {
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

        {/* 🔥 CATEGORY GRID */}
        <div
          style={{
            maxWidth: "1024px",
            margin: "300px auto 0 auto",
            padding: "0 1rem",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {menu.map((section) =>
              section.children?.map((item) => <CategoryCard key={item.name} item={item} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}