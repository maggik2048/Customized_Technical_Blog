import Link from "next/link";
import { Item } from "./sidebarData";

export default function CategoryCard({ item }: { item: Item }) {
  const cardScale = 0.75;

  const cardStyle: React.CSSProperties = {
    transform: `scale(${cardScale})`,
    transformOrigin: "top left",
    width: "100%",
  };

  if (!item.href) {
    return (
      <div
        className="bg-black/50 px-3 py-2 rounded-lg opacity-50 shadow-[0_0_10px_rgba(103,232,249,0.08)]"
        style={cardStyle}
      >
        <div className="flex justify-between items-center gap-1.5">
          <h2
            className="text-sm font-medium tracking-wide truncate"
            style={{
              color: "#67e8f9",
              textShadow: "0 0 4px rgba(103,232,249,0.25)",
            }}
          >
            {item.name}
          </h2>
          <p className="text-xs text-gray-500/70 whitespace-nowrap">
            Coming soon
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link href={item.href} className="block" style={cardStyle}>
      <div className="bg-black/70 hover:bg-black/85 transition px-3 py-2 rounded-lg shadow-[0_0_16px_rgba(56,189,248,0.18)] hover:shadow-[0_0_20px_rgba(56,189,248,0.25)]">
        <div className="flex justify-between items-center gap-1.5">
          <h2
            className="text-sm font-medium tracking-wide truncate"
            style={{
              color: "#38bdf8",
              textShadow: "0 0 6px rgba(56,189,248,0.35)",
            }}
          >
            {item.name}
          </h2>

          {item.count !== undefined && (
            <p className="text-xs text-gray-400/80 whitespace-nowrap">
              {item.count} topics
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}