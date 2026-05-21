'use client';

import { useState, useRef } from 'react';

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

  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const handleEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setPos({
        top: rect.top,
        left: rect.left,
        width: rect.width,
      });
    }
    setHovered(true);
  };

  const handleLeave = () => {
    setHovered(false);
  };

  const handleExport = (target: string) => {
    console.log(`export ${materialId} to ${target}`);
  };

  return (
    <>
      {/* WRAPPER: 카드 + hover 영역 전체 포함 */}
      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        {/* CARD */}
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
          {/* IMAGE */}
          <img
            src={previewUrl}
            alt={assetName}
            style={{
              width: '100%',
              height: '75%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* LABEL */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              padding: 10,
              boxSizing: 'border-box',
              background: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>
              {assetName}
            </div>

            <div
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 11,
                marginTop: 3,
              }}
            >
              {materialId}
            </div>
          </div>
        </div>

        {/* HOVER UI (OUTSIDE CARD BUT STILL INSIDE WRAPPER LOGIC) */}
        {hovered && (
          <div
            style={{
              position: 'fixed',
              top: pos.top,
              left: pos.left + pos.width - 180,
              zIndex: 9999,

              width: 180,
              padding: 10,
              borderRadius: 12,
              background: 'rgba(0,0,0,0.55)',
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
                    objectFit: 'contain',
                    flexShrink: 0,
                  }}
                />
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}