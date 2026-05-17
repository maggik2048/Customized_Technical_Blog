"use client";

import { useEffect, useState } from "react";
import { getMenu } from "./sidebarData";
import Sidebar from "./Sidebar";
import SidebarOpenCloseMotion from "./SidebarOpenCloseMotion";
import SidebarOpenCloseToggle from "./SidebarOpenCloseToggle";
import { Item } from "./types";

export default function SidebarState() {
  const [open, setOpen] = useState(true);
  const [menu, setMenu] = useState<Item[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getMenu();
      setMenu(data);
    };
    load();
  }, []);

  return (
    <>
      <SidebarOpenCloseMotion open={open}>
        <Sidebar menu={menu} />
      </SidebarOpenCloseMotion>

      <SidebarOpenCloseToggle open={open} setOpen={setOpen} />
    </>
  );
}