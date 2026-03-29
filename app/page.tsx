import Link from "next/link";
import { menu } from "./components/sidebarData";
import CategoryCard from "./components/CategoryCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">Graphics Lab V2</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {menu.map((section) =>
          section.children?.map((item) => (
            <CategoryCard key={item.name} item={item} />
          ))
        )}
      </div>
    </div>
  );
}