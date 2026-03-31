// CategoryCard.tsx
import Link from "next/link";
import { Item } from "./sidebarData";

export default function CategoryCard({ item }: { item: Item }) {
  const cardScale = 0.65;

  // 공통 스타일
  const cardStyle: React.CSSProperties = {
    transform: `scale(${cardScale})`,
    transformOrigin: "top left",
    width: "100%",
  };

  if (!item.href) {
    return (
      <div
        className="bg-black/50 p-3 rounded-lg opacity-40"
        style={cardStyle}
      >
        <h2 className="text-sm font-medium text-gray-400 tracking-wide">
          {item.name}
        </h2>
        <p className="text-xs text-gray-500 mt-1">Coming soon</p>
      </div>
    );
  }

  return (
    <Link href={item.href} className="block" style={cardStyle}>
      <div
        className="
          bg-black/70
          hover:bg-black/85
          transition
          p-3
          rounded-lg
          shadow-[0_0_20px_rgba(255,255,255,0.2)]
        "
      >
        <h2
          className="
            text-sm
            font-medium
            text-gray-300/80
            tracking-wide
            transition
            group-hover:text-white
          "
        >
          {item.name}
        </h2>

        {item.count !== undefined && (
          <p className="text-xs text-gray-500/80 mt-1">
            {item.count} topics
          </p>
        )}
      </div>
    </Link>
  );
}