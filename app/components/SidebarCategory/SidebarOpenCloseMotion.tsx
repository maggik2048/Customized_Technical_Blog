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

        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        isolation: "isolate",

        padding: "40px 22px",

        transform: open
          ? "translate3d(0, 0, 0)"
          : "translate3d(-92%, 0, 0)",

        transition:
          "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",

        willChange: "transform",

        boxShadow: open
          ? "10px 0 40px rgba(0,0,0,0.55)"
          : "10px 0 40px rgba(0,0,0,0.25)",

        zIndex: 50,
      }}
    >
      {children}
    </aside>
  );
}