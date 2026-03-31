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
      { name: "Network1", count: 3, href: "/category/network" },
      { name: "Artificial Intelligence", count: 0, href: "/category/ai" },
      { name: "Discrete Mathematics", count: 0, href: "/category/discrete" },
      { name: "Data Structure & Algorithm", count: 0, href: "/category/dsa" },
      { name: "Unreal Engine", count: 30, href: "/category/unrealengine" },
    ],
  },
];