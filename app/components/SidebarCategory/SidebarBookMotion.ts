// SidebarBookMotion.ts

export function onBookEnter(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform =
    "translateX(10px) scale(1.015)";
  e.currentTarget.style.boxShadow =
    "0 12px 30px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.05)";
}

export function onBookLeave(
  e: React.MouseEvent<HTMLDivElement>,
  index: number,
  active: boolean
) {
  e.currentTarget.style.transform =
    `rotate(${(index % 5) - 2}deg)`;

  e.currentTarget.style.boxShadow = active
    ? "0 0 24px rgba(173,140,71,0.16), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.25)"
    : "inset 0 1px 0 rgba(255,255,255,0.025), inset 0 -1px 0 rgba(0,0,0,0.25), 0 3px 10px rgba(0,0,0,0.22)";
}

export function getDefaultTransform(index: number) {
  return `rotate(${(index % 5) - 2}deg)`;
}

export function getDefaultShadow(active: boolean) {
  return active
    ? "0 0 24px rgba(173,140,71,0.16), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.25)"
    : "inset 0 1px 0 rgba(255,255,255,0.025), inset 0 -1px 0 rgba(0,0,0,0.25), 0 3px 10px rgba(0,0,0,0.22)";
}