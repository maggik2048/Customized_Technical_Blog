import Link from "next/link";
import { Item } from "./sidebarData";

export default function CategoryCard({ item }: { item: Item }) {
  // Disabled card (no link)
  if (!item.href) {
    return (
      <div className="bg-gray-800 p-6 rounded-2xl opacity-50 border border-gray-700">
        <h2 className="text-xl font-semibold text-gray-300">
          {item.name}
        </h2>
        <p className="text-sm text-gray-500 mt-2">Coming soon</p>
      </div>
    );
  }

  return (
    <Link href={item.href}>
      <div className="bg-gray-900 hover:bg-gray-800 transition-all duration-200 p-6 rounded-2xl cursor-pointer border border-gray-800 hover:scale-[1.02]">
        <h2 className="text-xl font-semibold text-gray-100 hover:text-white">
          {item.name}
        </h2>

        {item.count !== undefined && (
          <p className="text-sm text-gray-400 mt-2">
            {item.count} topics
          </p>
        )}
      </div>
    </Link>
  );
}