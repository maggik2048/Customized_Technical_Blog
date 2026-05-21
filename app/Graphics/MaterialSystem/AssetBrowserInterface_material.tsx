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

export default function AssetBrowserInterface_material({
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
    <>
      {/* REGISTER PANEL */}
      <RegisterMaterialPanel
        onRegistered={(materialId: string) => {
          console.log('MATERIAL REGISTERED:', materialId);

          setLatestMaterialId(materialId);
          refreshAssets();
        }}
      />

      {/* REFRESH BUTTON (RESTORED) */}
      <button
        onClick={refreshAssets}
        style={styles.button}
      >
        Refresh Materials
      </button>

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
    </>
  );
}