"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Item {
  name: string;
  href?: string;
  count?: number;
  children?: Item[];
}

// 이전 메뉴 구조 그대로
const menu: Item[] = [
  {
    name: "Computer Science Revisited (학부 기초 정리)",
    children: [
      { name: "Network", count: 3, href: "/cs/network" },
      { name: "Artificial Intelligence", count: 0, href: "/cs/ai" },
      { name: "SQL & Database", count: 11, href: "/cs/sql" },
      {
        name: "Compiler & Programming Language",
        count: 27,
        children: [{ name: "Embedded", count: 2, href: "/cs/compiler/embedded" }],
      },
      { name: "Discrete Mathematics", count: 0, href: "/cs/discrete" },
      {
        name: "Digital Electronics (COE)",
        count: 1,
        children: [
          { name: "Operating Systems", count: 17, href: "/cs/digital/os" },
        ],
      },
      { name: "Systems Programming", count: 7, href: "/cs/systems" },
      { name: "DataStructure & Algorithm", count: 0, href: "/cs/dsa" },
      { name: "C++", count: 0, href: "/cs/cpp" },
      { name: "Software Engineering", count: 0, href: "/cs/se" },
      {
        name: "Security",
        count: 1,
        href: "/cs/security",
      },
      { name: "Multithreading & Concurrency", count: 13, href: "/cs/concurrency" },
    ],
  },
];

// 메뉴 렌더링 재귀 함수
export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const renderItems = (items: Item[], parentKey = "") =>
    items.map((item, index) => {
      const key = parentKey + index;
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={key} className="ml-0">
          <button
            onClick={() => hasChildren && setOpen({ ...open, [key]: !open[key] })}
            className={`flex justify-between items-center w-full px-4 py-2 rounded text-left transition-colors ${
              pathname === item.href ? "bg-gray-700 font-bold" : "text-gray-300"
            } hover:bg-gray-800`}
          >
            <span>{item.name}</span>
            {item.count !== undefined && <span className="ml-2 text-gray-400">({item.count})</span>}
          </button>

          {hasChildren && (
            <AnimatePresence>
              {open[key] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="ml-4 overflow-hidden flex flex-col gap-1"
                >
                  {renderItems(item.children!, key + "-")}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      );
    });

  return (
    <aside className="w-64 h-screen bg-black text-white p-6 space-y-4 overflow-y-auto">
      <h1 className="text-xl font-bold mb-6">Graphics Lab</h1>
      {renderItems(menu)}
    </aside>
  );
}