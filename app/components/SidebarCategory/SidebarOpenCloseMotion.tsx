"use client";

export default function SidebarOpenCloseMotion({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,

        width: 390,
        height: "100vh",

        overflowY: "auto",

        background:
          "linear-gradient(rgba(10,10,10,0.46), rgba(10,10,10,0.72)), url('/images/covers/bg.jpg') center / cover no-repeat",

        padding: "40px 22px",

        transform: open
          ? "translateX(0)"
          : "translateX(-92%)",

        transition:
          "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease",

        willChange: "transform",

        filter: open ? "blur(0px)" : "blur(2px)",

        boxShadow: open
          ? "10px 0 40px rgba(0,0,0,0.55)"
          : "none",

        zIndex: 50,
      }}
    >
      {children}
    </aside>
  );
}