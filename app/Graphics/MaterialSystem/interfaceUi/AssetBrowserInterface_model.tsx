'use client';

import { useState } from 'react';

import AssetCard from './AssetCard';
import { styles } from './assetbrowserinterfaceStyle';

type ModelItem = {
  modelId: string;
  modelName: string;
  previewUrl: string;
};

interface Props {
  onSelectModel: (modelId: string) => void;
}

export default function AssetBrowserInterface_model({
  onSelectModel,
}: Props) {

  const [models, setModels] = useState<ModelItem[]>([]);
  const [latestModelId, setLatestModelId] = useState<string | null>(null);

  const refreshModels = async () => {
    try {
      const res = await fetch('/api/model/list');
      const data = await res.json();

      setModels(data);

      console.log('MODELS REFRESHED:', data);
    } catch (err) {
      console.error('MODEL REFRESH FAILED', err);
    }
  };

  return (
    <div
      style={{
        ...styles.sidebar,

        //  RIGHT SIDE FIX
        right: 0,
        left: 'auto',

        borderLeft: '1px solid rgba(255,255,255,0.08)',
        borderRight: 'none',
      }}
    >

      {/* HEADER */}
      <div style={styles.headerWrapper}>
        <h1 style={styles.headerTitle}>
          3D Model Browser
        </h1>

        <div style={styles.headerSubtitle}>
          Model Library
        </div>
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search Models..."
        style={styles.searchInput}
      />

      {/* REFRESH */}
      <button
        onClick={refreshModels}
        style={styles.button}
      >
        Refresh Models
      </button>

      {/* SELECT ACTION */}
      <button
        onClick={() => {
          if (!latestModelId) {
            console.warn('NO MODEL SELECTED');
            return;
          }

          onSelectModel(latestModelId);
        }}
        style={styles.registerButton}
      >
        registerModel
      </button>

      {/* GRID */}
      <div style={styles.grid}>
        {models.map((model, index) => (
          <div
            key={model.modelId}
            onClick={() => setLatestModelId(model.modelId)}
            style={{ cursor: 'pointer' }}
          >
            <AssetCard
              assetName={model.modelName}
              previewUrl={model.previewUrl}
              materialId={model.modelId}
              index={index}
            />
          </div>
        ))}
      </div>

    </div>
  );
}