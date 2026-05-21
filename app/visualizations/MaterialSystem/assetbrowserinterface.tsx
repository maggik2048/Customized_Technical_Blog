'use client';

import { useState } from 'react';

import RegisterMaterialPanel from './RegisterMaterialPanel';
import AssetCard from './AssetCard';

type AssetItem = {
  materialId: string;
  assetName: string;
  previewUrl: string;
};

interface Props {
  onDoMapping: (materialId: string) => void;
}

export default function AssetBrowserInterface({
  onDoMapping,
}: Props) {

  //
  //  REAL ASSETS STATE
  //
  const [assets, setAssets] = useState<AssetItem[]>([]);

  const [latestMaterialId, setLatestMaterialId] = useState<string | null>(
    null
  );

  //
  //  REFRESH (PARENT RESPONSIBILITY)
  //
  const refreshAssets = async () => {

    try {

      const res = await fetch('/api/material/list');
      const data = await res.json();

      setAssets(data);

      console.log('ASSETS REFRESHED:', data);

    } catch (err) {
      console.error('REFRESH FAILED', err);
    }
  };

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
        <h1 style={{ color: 'white', fontSize: 26, fontWeight: 700, margin: 0 }}>
          Asset Browser
        </h1>

        <div style={{ color: 'rgba(255,255,255,0.45)', marginTop: 8, fontSize: 13 }}>
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
          marginBottom: 16,
          color: 'white',
          background: 'rgba(255,255,255,0.08)',
          fontSize: 14,
        }}
      />

      {/*  REFRESH BUTTON (PARENT CONTROL) */}
      <button
        onClick={refreshAssets}
        style={{
          width: '100%',
          height: 44,
          marginBottom: 16,
          borderRadius: 12,
          cursor: 'pointer',
          color: 'white',
          fontWeight: 700,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        Refresh Assets
      </button>

      {/* REGISTER PANEL */}
      <RegisterMaterialPanel
        onRegistered={(materialId: string) => {
          console.log('MATERIAL REGISTERED:', materialId);
          setLatestMaterialId(materialId);

          //  optional: 자동 refresh
          refreshAssets();
        }}
      />

      {/* DO MAPPING */}
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
          borderRadius: 14,
          marginBottom: 24,
          color: 'white',
          fontWeight: 700,
          background: 'rgba(255,255,255,0.08)',
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
        {assets.map((asset, index) => (
          <AssetCard
            key={asset.materialId}
            assetName={asset.assetName}
            previewUrl={asset.previewUrl}
            materialId={asset.materialId}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}