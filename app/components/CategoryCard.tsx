// CategoryCard.tsx
import Link from "next/link";
import { Item } from "./sidebarData";

export default function CategoryCard({ item }: { item: Item }) {
  const cardScale = 0.65;

  const cardStyle: React.CSSProperties = {
    transform: `scale(${cardScale})`,
    transformOrigin: "top left",
    width: "100%",
  };

  if (!item.href) {
    return (
      <div className="bg-black/50 p-3 rounded-lg opacity-40" style={cardStyle}>
        <div className="flex justify-between items-center gap-2">
          <h2
            className="text-sm font-medium tracking-wide truncate"
            style={{ color: "#7fbfff" }} // 🔹 텍스트 색상만 진파랑
          >
            {item.name}
          </h2>
          <p className="text-xs text-gray-500/80">Coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <Link href={item.href} className="block" style={cardStyle}>
      <div className="bg-black/70 hover:bg-black/85 transition p-3 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        <div className="flex justify-between items-center gap-2">
          <h2
            className="text-sm font-medium tracking-wide truncate"
            style={{ color: "#5dadef" }} // 🔹 텍스트 색상만 진파랑
          >
            {item.name}
          </h2>
          {item.count !== undefined && (
            <p className="text-xs text-gray-500/80 whitespace-nowrap">
              {item.count} topics
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}