// AssetCard_HoverUi.tsx

'use client';

import { createPortal } from 'react-dom';

interface Props {
  mounted: boolean;

  visible: boolean;

  position: {
    top: number;
    left: number;
    width: number;
  };

  setIsHoverPanel: (v: boolean) => void;

  onExport: (target: string) => void;
}

const exportTargets = [
  { name: 'Unreal Engine', icon: '/icons/unreal.png' },
  { name: 'Blender', icon: '/icons/blender.png' },
  { name: 'Houdini', icon: '/icons/houdini.png' },
  { name: 'Maya', icon: '/icons/maya.png' },
  { name: '3ds Max', icon: '/icons/max.png' },
  { name: 'Cinema 4D', icon: '/icons/cinema.png' },
];

export default function AssetCard_HoverUi({
  mounted,
  visible,
  position,
  setIsHoverPanel,
  onExport,
}: Props) {
  if (!mounted || !visible || typeof window === 'undefined') {
    return null;
  }

  const safeTop = position.top || 0;
  const safeLeft = position.left || 0;
  const safeWidth = position.width || 0;

  return createPortal(
    <div
      onMouseEnter={() => setIsHoverPanel(true)}
      onMouseLeave={() => setIsHoverPanel(false)}
      style={{
        position: 'fixed',
        top: safeTop,
        left: safeLeft + safeWidth - 180,

        zIndex: 99999,

        width: 180,

        padding: 10,

        borderRadius: 12,

        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(12px)',

        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {exportTargets.map((t) => (
        <div
          key={t.name}
          onClick={() => onExport(t.name)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,

            fontSize: 12,
            color: 'white',

            cursor: 'pointer',

            whiteSpace: 'nowrap',

            opacity: 0.9,
          }}
        >
          <img
            src={t.icon}
            alt={t.name}
            style={{
              width: 16,
              height: 16,
            }}
          />

          <span>{t.name}</span>
        </div>
      ))}
    </div>,
    document.body
  );
}