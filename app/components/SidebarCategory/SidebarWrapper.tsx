"use client";

import { useEffect, useState } from "react";
import { getMenu } from "./sidebarData";
import Sidebar from "./Sidebar";
import { Item } from "./types";

export default function SidebarWrapper() {
  const [menu, setMenu] = useState<Item[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getMenu();
      setMenu(data);
    };
    load();
  }, []);

  return <Sidebar menu={menu} />;
}