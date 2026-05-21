'use client';

import { useState } from 'react';

import RegisterMaterialPanel from './RegisterMaterialPanel';
import AssetCard from './AssetCard';

interface Props {
  onDoMapping: (materialId: string) => void;
}

export default function AssetBrowserInterface({
  onDoMapping,
}: Props) {
  const dummyAssets = Array.from({ length: 24 }, (_, i) => i);

  const [latestMaterialId, setLatestMaterialId] = useState<string | null>(
    null
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 360,
        height: '100vh',
        overflowY: 'auto',
        background: 'rgba(15,15,15,0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        zIndex: 1000,
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            color: 'white',
            fontSize: 26,
            fontWeight: 700,
            margin: 0,
          }}
        >
          Asset Browser
        </h1>

        <div
          style={{
            color: 'rgba(255,255,255,0.45)',
            marginTop: 8,
            fontSize: 13,
          }}
        >
          PBR Material Library
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search Materials..."
        style={{
          width: '100%',
          height: 42,
          border: 'none',
          outline: 'none',
          borderRadius: 12,
          paddingLeft: 14,
          marginBottom: 20,
          color: 'white',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          fontSize: 14,
        }}
      />

      {/* REGISTER PANEL */}
      <RegisterMaterialPanel
        onRegistered={(materialId: string) => {
          console.log('MATERIAL REGISTERED:', materialId);
          setLatestMaterialId(materialId);
        }}
      />

      {/* DO MAPPING BUTTON */}
      <button
        onClick={() => {
          if (!latestMaterialId) {
            console.warn('NO MATERIAL ID YET');
            return;
          }

          onDoMapping(latestMaterialId);
        }}
        style={{
          width: '100%',
          height: 48,
          border: 'none',
          outline: 'none',
          borderRadius: 14,
          marginBottom: 24,
          cursor: 'pointer',
          color: 'white',
          fontSize: 14,
          fontWeight: 700,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          transition: '0.25s ease',
        }}
      >
        doMapping
      </button>

      {/* GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
        }}
      >
        {dummyAssets.map((item) => (
          <AssetCard key={item} item={item} />
        ))}
      </div>
    </div>
  );
}