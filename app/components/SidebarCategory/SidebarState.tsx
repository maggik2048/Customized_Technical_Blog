"use client";

import { useState } from "react";

import SidebarOpenCloseMotion from "./SidebarOpenCloseMotion";
import SidebarOpenCloseToggle from "./SidebarOpenCloseToggle";
import Sidebar from "./Sidebar";

export default function SidebarState() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <SidebarOpenCloseMotion open={open}>
        <Sidebar open={open} />
      </SidebarOpenCloseMotion>

      <SidebarOpenCloseToggle open={open} setOpen={setOpen} />
    </>
  );
}