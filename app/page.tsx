import { menu } from "./components/sidebarData";
import CategoryCard from "./components/CategoryCard";

export default function HomePage() {
  return (
    <div className="pl-16 pr-10">
      
      {/* 🔥 TITLE WRAPPER */}
      <div
        style={{
          position: "relative",
          height: "9vh", // 🔥 텍스트 높이 고정 (핵심)
          marginBottom: "2.5rem",
        }}
      >
        {/* 🔥 텍스처 텍스트 */}
        <h1
          className="hero-title"
          style={{
            fontSize: "9vh",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          Graphics Lab V2
        </h1>

        {/* 🔥 흰색 텍스트 (bar 안에서만 보임) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "180px",
            width: "630px",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <h1
            className="hero-title-white"
            style={{
              fontSize: "9vh",
              position: "absolute",
              top: 0,
              left: "-180px", // 🔥 핵심: 원래 위치로 보정
            }}
          >
            Graphics Lab V2
          </h1>
        </div>
      </div>

      {/* 🔥 CATEGORY GRID */}
      <div className="max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {menu.map((section) =>
            section.children?.map((item) => (
              <CategoryCard key={item.name} item={item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}