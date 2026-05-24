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

  materialFolder: string;
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
  materialFolder,
}: Props) {
  if (!mounted || !visible || typeof window === 'undefined') {
    return null;
  }

  const onExport = async (target: string) => {
    try {
      console.log('========================');
      console.log('EXPORT CLICKED');
      console.log('TARGET:', target);
      console.log('MATERIAL FOLDER:', materialFolder);
      console.log('========================');

      // =========================
      // BLENDER
      // =========================

      if (target === 'Blender') {
        console.log('STARTING BLENDER EXPORT...');

        const res = await fetch(
          '/api/material/export/blender',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              materialFolder,
            }),
          }
        );

        console.log('BLENDER RESPONSE STATUS:', res.status);

        const json = await res.json();

        console.log('BLENDER RESPONSE JSON:', json);

        if (json.success) {
          console.log('BLENDER INVOKED SUCCESSFULLY');
        }

        else {
          console.error('BLENDER EXPORT FAILED');
        }

        return;
      }

      // =========================
      // UNREAL
      // =========================

      if (target === 'Unreal Engine') {
        console.log('STARTING UNREAL EXPORT...');

        const res = await fetch(
          '/api/material/export/unreal',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              materialFolder,
            }),
          }
        );

        console.log('UNREAL RESPONSE STATUS:', res.status);

        const json = await res.json();

        console.log('UNREAL RESPONSE JSON:', json);

        return;
      }

      // =========================
      // HOUDINI
      // =========================

      if (target === 'Houdini') {
        console.log('STARTING HOUDINI EXPORT...');

        const res = await fetch(
          '/api/material/export/houdini',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              materialFolder,
            }),
          }
        );

        console.log('HOUDINI RESPONSE STATUS:', res.status);

        const json = await res.json();

        console.log('HOUDINI RESPONSE JSON:', json);

        return;
      }

      // =========================
      // MAYA
      // =========================

      if (target === 'Maya') {
        console.log('STARTING MAYA EXPORT...');

        const res = await fetch(
          '/api/material/export/maya',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              materialFolder,
            }),
          }
        );

        console.log('MAYA RESPONSE STATUS:', res.status);

        const json = await res.json();

        console.log('MAYA RESPONSE JSON:', json);

        return;
      }

      // =========================
      // 3DS MAX
      // =========================

      if (target === '3ds Max') {
        console.log('STARTING 3DS MAX EXPORT...');

        const res = await fetch(
          '/api/material/export/max',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              materialFolder,
            }),
          }
        );

        console.log('MAX RESPONSE STATUS:', res.status);

        const json = await res.json();

        console.log('MAX RESPONSE JSON:', json);

        return;
      }

      // =========================
      // CINEMA 4D
      // =========================

      if (target === 'Cinema 4D') {
        console.log('STARTING C4D EXPORT...');

        const res = await fetch(
          '/api/material/export/c4d',
          {
            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
            },

            body: JSON.stringify({
              materialFolder,
            }),
          }
        );

        console.log('C4D RESPONSE STATUS:', res.status);

        const json = await res.json();

        console.log('C4D RESPONSE JSON:', json);

        return;
      }

      console.warn('UNKNOWN EXPORT TARGET');
    }

    catch (err) {
      console.error('EXPORT ERROR:', err);
    }
  };

  return createPortal(
    <div
      onMouseEnter={() => setIsHoverPanel(true)}
      onMouseLeave={() => setIsHoverPanel(false)}
      style={{
        position: 'fixed',

        top: position.top,

        left: position.left + position.width - 180,

        zIndex: 99999,

        width: 180,

        padding: 10,

        borderRadius: 12,

        background: 'rgba(0,0,0,0.6)',

        backdropFilter: 'blur(12px)',

        border: '1px solid rgba(255,255,255,0.08)',

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

            padding: '6px 8px',

            borderRadius: 8,

            transition: '0.15s ease',

            opacity: 0.92,

            userSelect: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'transparent';
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

          <span
            style={{
              whiteSpace: 'nowrap',

              overflow: 'hidden',

              textOverflow: 'ellipsis',
            }}
          >
            {t.name}
          </span>
        </div>
      ))}
    </div>,
    document.body
  );
}