import { menu } from "./components/sidebarData";
import CategoryCard from "./components/CategoryCard";

export default function HomePage() {
  return (
    <div className="pl-16 pr-10">
      {/* 🔥 HUGE TITLE */}
      <h1
        className="
          font-black
          leading-none
          tracking-[0.005em]
          text-white
          mb-10
        "
        style={{ fontSize: "9vh" }}
      >
        Graphics Lab V2
      </h1>

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