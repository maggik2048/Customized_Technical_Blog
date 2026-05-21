'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  assetName: string;
  previewUrl: string;
  materialId: string;
  index: number;
}

const exportTargets = [
  { name: 'Unreal Engine', icon: '/icons/unreal.png' },
  { name: 'Blender', icon: '/icons/blender.png' },
  { name: 'Houdini', icon: '/icons/houdini.png' },
  { name: 'Maya', icon: '/icons/maya.png' },
  { name: '3ds Max', icon: '/icons/3dsmax.png' },
  { name: 'Cinema 4D', icon: '/icons/cinema4d.png' },
];

export default function AssetCard({
  assetName,
  previewUrl,
  materialId,
  index,
}: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);

  const [isHoverCard, setIsHoverCard] = useState(false);
  const [isHoverPanel, setIsHoverPanel] = useState(false);

  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const visible = isHoverCard || isHoverPanel;

  const updatePosition = () => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    setPos({
      top: rect.top,
      left: rect.left,
      width: rect.width,
    });
  };

  const handleCardEnter = () => {
    updatePosition();
    setIsHoverCard(true);
  };

  const handleCardLeave = () => {
    // 바로 닫지 않음 (panel hover 체크 때문에)
    setTimeout(() => {
      setIsHoverCard(false);
    }, 80);
  };

  const handleExport = (target: string) => {
    console.log(`export ${materialId} to ${target}`);
  };

  const safeTop = pos.top || 0;
  const safeLeft = pos.left || 0;
  const safeWidth = pos.width || 0;

  return (
    <>
      {/* CARD */}
      <div
        onMouseEnter={handleCardEnter}
        onMouseLeave={handleCardLeave}
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        <div
          ref={cardRef}
          style={{
            aspectRatio: '1 / 1',
            borderRadius: 18,
            overflow: 'hidden',
            cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <img
            src={previewUrl}
            alt={assetName}
            style={{
              width: '100%',
              height: '75%',
              objectFit: 'cover',
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: 10,
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>
              {assetName}
            </div>

            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
              {materialId}
            </div>
          </div>
        </div>
      </div>

      {/* PORTAL */}
      {mounted &&
        visible &&
        typeof window !== 'undefined' &&
        createPortal(
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
                onClick={() => handleExport(t.name)}
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
        )}
    </>
  );
}