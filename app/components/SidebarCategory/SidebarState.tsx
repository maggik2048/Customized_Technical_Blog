"use client";

import { useEffect, useState, useMemo } from "react";
import { getMenu } from "./sidebarData";
import Sidebar from "./Sidebar";
import SidebarOpenCloseMotion from "./SidebarOpenCloseMotion";
import SidebarOpenCloseToggle from "./SidebarOpenCloseToggle";

// Définir le type Item ici
export interface Item {
  id: string;
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: Item[];
}

const SIDEBAR_WIDTH = 390;

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

  // sidebar 이동값 (Sidebar + Button 둘 다 기준으로 사용)
  const sidebarTranslateX = useMemo(() => {
    return open ? 0 : -SIDEBAR_WIDTH * 0.92;
  }, [open]);

  return (
    <>
      {/* Sidebar */}
      <SidebarOpenCloseMotion open={open}>
        <Sidebar menu={menu} />
      </SidebarOpenCloseMotion>

      {/* Toggle Button (sidebar 위치 기준 동기화) */}
      <SidebarOpenCloseToggle
        open={open}
        setOpen={setOpen}
        sidebarTranslateX={sidebarTranslateX}
        sidebarWidth={SIDEBAR_WIDTH}
      />
    </>
  );
}