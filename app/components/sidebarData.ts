// app/components/sidebarData.ts
export interface Item {
  name: string;
  href?: string;
  count?: number;
  children?: Item[];
}

export const menu: Item[] = [
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
        children: [{ name: "Operating Systems", count: 17, href: "/cs/digital/os" }],
      },
      { name: "Systems Programming", count: 7, href: "/cs/systems" },
      { name: "DataStructure & Algorithm", count: 0, href: "/cs/dsa" },
      { name: "C++", count: 0, href: "/cs/cpp" },
      { name: "Software Engineering", count: 0, href: "/cs/se" },
      { name: "Security", count: 1, href: "/cs/security" },
      { name: "Multithreading & Concurrency", count: 13, href: "/cs/concurrency" },
    ],
  },
];