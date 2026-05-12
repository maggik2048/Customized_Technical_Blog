"use client";

export function getRotation(index: number) {
  return (index % 5) - 2;
}

export function getDefaultTransform(index: number) {
  return `rotate(${getRotation(index)}deg)`;
}

export function getHoverTransform() {
  return `translateX(10px) scale(1.015)`;
}

export function getDefaultShadow(active: boolean) {
  if (active) {
    return `
      0 0 24px rgba(173,140,71,0.16),
      inset 0 1px 0 rgba(255,255,255,0.06),
      inset 0 -1px 0 rgba(0,0,0,0.25)
    `;
  }

  return `
    inset 0 1px 0 rgba(255,255,255,0.025),
    inset 0 -1px 0 rgba(0,0,0,0.25),
    0 3px 10px rgba(0,0,0,0.22)
  `;
}

export function getHoverShadow() {
  return `
    0 12px 30px rgba(0,0,0,0.34),
    inset 0 1px 0 rgba(255,255,255,0.05)
  `;
}

export function onBookEnter(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.style.transform = getHoverTransform();
  el.style.boxShadow = getHoverShadow();
}

export function onBookLeave(
  e: React.MouseEvent<HTMLDivElement>,
  index: number,
  active: boolean
) {
  const el = e.currentTarget;
  el.style.transform = getDefaultTransform(index);
  el.style.boxShadow = getDefaultShadow(active);
}