// AssetBrowserInterface.tsx

'use client';

import { useState } from 'react';

import RegisterMaterialPanel from './RegisterMaterialPanel';
import AssetCard from './AssetCard';
import { styles } from './assetbrowserinterfaceStyle';

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

  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [latestMaterialId, setLatestMaterialId] = useState<string | null>(null);

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
    <div style={styles.sidebar}>

      {/* HEADER */}
      <div style={styles.headerWrapper}>
        <h1 style={styles.headerTitle}>
          Asset Browser
        </h1>

        <div style={styles.headerSubtitle}>
          PBR Material Library
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search Materials..."
        style={styles.searchInput}
      />

      {/* REFRESH */}
      <button
        onClick={refreshAssets}
        style={styles.button}
      >
        Refresh Assets
      </button>

      {/* REGISTER PANEL */}
      <RegisterMaterialPanel
        onRegistered={(materialId: string) => {
          console.log('MATERIAL REGISTERED:', materialId);

          setLatestMaterialId(materialId);
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
        style={styles.registerButton}
      >
        doMapping
      </button>

      {/* GRID */}
      <div style={styles.grid}>
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