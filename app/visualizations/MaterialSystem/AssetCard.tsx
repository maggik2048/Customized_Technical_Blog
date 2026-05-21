// AssetCard.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import AssetCard_HoverUi from './AssetCard_HoverUi';

interface Props {
  assetName: string;
  previewUrl: string;
  materialId: string;
  index: number;
}

export default function AssetCard({
  assetName,
  previewUrl,
  materialId,
}: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);

  const [isHoverCard, setIsHoverCard] = useState(false);
  const [isHoverPanel, setIsHoverPanel] = useState(false);

  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

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
    setTimeout(() => {
      setIsHoverCard(false);
    }, 80);
  };

  const handleExport = (target: string) => {
    console.log(`export ${materialId} to ${target}`);
  };

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
            <div
              style={{
                color: 'white',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {assetName}
            </div>

            <div
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: 11,
              }}
            >
              {materialId}
            </div>
          </div>
        </div>
      </div>

      <AssetCard_HoverUi
        mounted={mounted}
        visible={visible}
        position={pos}
        setIsHoverPanel={setIsHoverPanel}
        onExport={handleExport}
      />
    </>
  );
}