'use client';

import AssetBrowserInterface_material from './AssetBrowserInterface_material';
import AssetBrowserInterface_model from './AssetBrowserInterface_model';
import { styles } from './assetbrowserinterfaceStyle';

interface Props {
  onDoMapping: (materialId: string) => void;
  onSelectModel: (modelId: string) => void;
}

export default function AssetBrowserInterface({
  onDoMapping,
  onSelectModel,
}: Props) {

  return (
    <div style={{ display: 'flex' }}>

      {/* LEFT: MATERIAL BROWSER */}
      <div style={styles.sidebar}>
        <div style={styles.headerWrapper}>
          <h1 style={styles.headerTitle}>
            Asset Browser
          </h1>

          <div style={styles.headerSubtitle}>
            PBR Material Library
          </div>
        </div>

        <input
          placeholder="Search Materials..."
          style={styles.searchInput}
        />

        <AssetBrowserInterface_material
          onDoMapping={onDoMapping}
        />
      </div>

      {/* RIGHT: MODEL BROWSER */}
      <AssetBrowserInterface_model
        onSelectModel={onSelectModel}
      />

    </div>
  );
}