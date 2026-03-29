// app/components/SidebarItem.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Item } from "./sidebarData";

interface Props {
  item: Item;
  pathname?: string;
  parentKey?: string;
}

export default function SidebarItem({ item, pathname, parentKey = "" }: Props) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const key = parentKey + item.name;

  const isActive = item.href && pathname?.replace(/\/$/, "") === item.href.replace(/\/$/, "");

  return (
    <div className="ml-0">
      {/* 버튼 영역 */}
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className={`flex justify-between items-center w-full px-4 py-2 rounded text-left transition-colors
          ${isActive ? "bg-gray-700 font-bold text-white" : "text-gray-300 hover:bg-gray-800"}`}
      >
        <span className="truncate">{item.name}</span>
        {item.count !== undefined && <span className="ml-2 text-gray-400">{`(${item.count})`}</span>}
      </button>

      {/* 자식 메뉴 */}
      {hasChildren && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-4 flex flex-col gap-1 overflow-hidden"
            >
              {item.children!.map((child) => (
                <SidebarItem key={child.name} item={child} pathname={pathname} parentKey={key + "-"} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}