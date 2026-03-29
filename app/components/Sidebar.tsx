"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { title: "Physics", key: "physics", items: [{ name: "Fluid Mechanics", href: "/physics/fluid" }] },
  { title: "Math", key: "math", items: [{ name: "Linear Algebra", href: "/math/linear" }] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({ physics: true, math: false });

  return (
    <aside className="w-64 h-screen bg-gray-800 text-white p-4">
      {menu.map((section) => (
        <div key={section.key} className="mb-4">
          <button
            className="font-bold w-full text-left"
            onClick={() => setOpen({ ...open, [section.key]: !open[section.key] })}
          >
            {section.title}
          </button>
          {open[section.key] &&
            section.items.map((item) => (
              <Link key={item.href} href={item.href} className={`block px-2 py-1 rounded hover:bg-gray-700 ${pathname === item.href ? "bg-gray-600" : ""}`}>
                {item.name}
              </Link>
            ))}
        </div>
      ))}
    </aside>
  );
}