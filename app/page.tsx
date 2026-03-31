import { menu } from "./components/sidebarData";
import CategoryCard from "./components/CategoryCard";

export default function HomePage() {
  return (
    <div className="pl-16 pr-10">
      {/* 🔥 TITLE WRAPPER */}
      <div style={{ position: "relative" }}>
        {/* 🔥 원본 (텍스처 텍스트) */}
        <h1
          className="
            hero-title
            leading-none
            tracking-[0.005em]
            mb-10
          "
          style={{ fontSize: "9vh" }}
        >
          Graphics Lab V2
        </h1>

        {/* 🔥 복제 (white overlay 텍스트) */}
        <h1
          className="hero-title-white"
          style={{
            fontSize: "9vh",
            position: "absolute",
            top: 0,
            left: "0", // 🔥 black bar 시작 위치
          }}
        >
          Graphics Lab V2
        </h1>
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