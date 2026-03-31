export interface Item {
  name: string;
  href?: string;
  count?: number;
  children?: Item[];
}

export const menu: Item[] = [
  {
    name: "Computer Science Revisited",
    children: [
      { name: "Network1", count: 3, href: "/cs/network" },
      { name: "Artificial Intelligence", count: 0, href: "/cs/ai" },
      { name: "Discrete Mathematics", count: 0, href: "/cs/discrete" },
      { name: "Data Structure & Algorithm", count: 0, href: "/cs/dsa" },
      { name: "Data Structure & Algorithm", count: 0, href: "/cs/dsa" },
      { name: "Data Structure & Algorithm", count: 0, href: "/cs/dsa" },
      { name: "Data Structure & Algorithm", count: 0, href: "/cs/dsa" },
      { name: "Data Structure & Algorithm", count: 0, href: "/cs/dsa" },
    ],
  },
];