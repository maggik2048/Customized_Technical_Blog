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
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const dragOffsetRef = useRef({
    x: 0,
    y: 0,
  });

  const [mounted, setMounted] = useState(false);

  const [isHoverCard, setIsHoverCard] = useState(false);

  const [isHoverPanel, setIsHoverPanel] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // drag 중에는 hover UI 숨김
  const visible =
    !isDragging &&
    (isHoverCard || isHoverPanel);

  const updatePosition = () => {
    if (!wrapperRef.current) return;

    const rect =
      wrapperRef.current.getBoundingClientRect();

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

  // -----------------------------------
  // DRAG
  // -----------------------------------

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!wrapperRef.current) return;

    const rect =
      wrapperRef.current.getBoundingClientRect();

    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setIsDragging(true);

    window.addEventListener(
      'pointermove',
      handlePointerMove
    );

    window.addEventListener(
      'pointerup',
      handlePointerUp
    );
  };

  const handlePointerMove = (
    e: PointerEvent
  ) => {
    if (!wrapperRef.current) return;

    const nextLeft =
      e.clientX - dragOffsetRef.current.x;

    const nextTop =
      e.clientY - dragOffsetRef.current.y;

    wrapperRef.current.style.position = 'fixed';

    wrapperRef.current.style.left = `${nextLeft}px`;

    wrapperRef.current.style.top = `${nextTop}px`;

    wrapperRef.current.style.zIndex = '999999';

    setPos((prev) => ({
      ...prev,
      top: nextTop,
      left: nextLeft,
    }));
  };

  const handlePointerUp = () => {
    setIsDragging(false);

    window.removeEventListener(
      'pointermove',
      handlePointerMove
    );

    window.removeEventListener(
      'pointerup',
      handlePointerUp
    );
  };

  return (
    <>
      {/* WRAPPER */}
      <div
        ref={wrapperRef}
        onMouseEnter={handleCardEnter}
        onMouseLeave={handleCardLeave}
        style={{
          position: 'relative',
          display: 'inline-block',
        }}
      >
        {/* CARD */}
        <div
          ref={cardRef}
          onPointerDown={handlePointerDown}
          style={{
            aspectRatio: '1 / 1',

            borderRadius: 18,

            overflow: 'hidden',

            cursor: isDragging
              ? 'grabbing'
              : 'grab',

            background:
              'rgba(255,255,255,0.06)',

            border:
              '1px solid rgba(255,255,255,0.08)',

            backdropFilter: 'blur(12px)',

            userSelect: 'none',

            touchAction: 'none',

            width: 220,

            boxShadow: isDragging
              ? '0 30px 80px rgba(0,0,0,0.45)'
              : '0 8px 24px rgba(0,0,0,0.18)',

            transform: isDragging
              ? 'scale(1.03)'
              : 'scale(1)',

            transition: isDragging
              ? 'none'
              : 'transform 0.18s ease, box-shadow 0.18s ease',
          }}
        >
          <img
            src={previewUrl}
            alt={assetName}
            draggable={false}
            style={{
              width: '100%',
              height: '75%',
              objectFit: 'cover',

              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',

              bottom: 0,
              left: 0,

              width: '100%',

              padding: 10,

              background:
                'rgba(0,0,0,0.35)',

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
                color:
                  'rgba(255,255,255,0.5)',

                fontSize: 11,
              }}
            >
              {materialId}
            </div>
          </div>
        </div>
      </div>

      {/* HOVER UI */}
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