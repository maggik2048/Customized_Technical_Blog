import { menu } from "./components/sidebarData";
import CategoryCard from "./components/CategoryCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white pl-16 pr-10 pt-12">
      {/* Title */}
      <h1 className="text-5xl font-extrabold tracking-tight mb-12">
        Graphics Lab V2
      </h1>

      {/* Content */}
      <div className="max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
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