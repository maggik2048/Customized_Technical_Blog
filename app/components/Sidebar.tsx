"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCube, FaCalculator } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const menu = [
  {
    title: "Physics",
    key: "physics",
    items: [{ name: "Fluid Mechanics", href: "/physics/fluid" }],
  },
  {
    title: "Math",
    key: "math",
    items: [{ name: "Linear Algebra", href: "/math/linear" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>({ physics: true, math: false });

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-4 overflow-y-auto">
      {menu.map((section) => (
        <div key={section.key} className="mb-4 border-b border-gray-700 pb-2">
          <button
            onClick={() => setOpen({ ...open, [section.key]: !open[section.key] })}
            className="font-semibold text-lg w-full text-left hover:text-yellow-400 transition-colors flex items-center gap-2"
          >
            {section.title === "Physics" && <FaCube />}
            {section.title === "Math" && <FaCalculator />}
            {section.title}
          </button>

          {/* Accordion with animation */}
          <AnimatePresence>
            {open[section.key] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-4 mt-2 flex flex-col gap-1 overflow-hidden"
                transition={{ duration: 0.3 }}
              >
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                      pathname === item.href ? "bg-gray-700 text-white font-bold" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </aside>
  );
}