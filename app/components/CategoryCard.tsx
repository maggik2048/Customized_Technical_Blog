import Link from "next/link";
import { Item } from "./sidebarData";

export default function CategoryCard({ item }: { item: Item }) {
  // href 없으면 클릭 막기
  if (!item.href) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg opacity-50">
        <h2 className="text-xl font-semibold">{item.name}</h2>
        <p className="text-sm text-gray-400">Coming soon</p>
      </div>
    );
  }

  return (
    <Link href={item.href}>
      <div className="bg-gray-900 hover:bg-gray-700 transition p-6 rounded-lg cursor-pointer">
        <h2 className="text-xl font-semibold">{item.name}</h2>
        {item.count !== undefined && (
          <p className="text-sm text-gray-400 mt-2">
            {item.count} topics
          </p>
        )}
      </div>
    </Link>
  );
}