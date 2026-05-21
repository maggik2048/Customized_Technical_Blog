'use client';

import { useState } from 'react';

import AssetBrowserInterface_material from './AssetBrowserInterface_material';
import { styles } from './assetbrowserinterfaceStyle';

interface Props {
  onDoMapping: (materialId: string) => void;
}

export default function AssetBrowserInterface({
  onDoMapping,
}: Props) {

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

      {/* SEARCH (UI only for now) */}
      <input
        placeholder="Search Materials..."
        style={styles.searchInput}
      />

      {/* MATERIAL FEATURE MODULE */}
      <AssetBrowserInterface_material
        onDoMapping={onDoMapping}
      />

    </div>
  );
}