'use client';

import { useRef, useState } from 'react';
import PurgeAllRegisteredMaterial from './PurgeAllRegisteredMaterial';
import {
  compareTextureSets,
  TextureSet,
} from './compareTextureSetsbeforeRegister';

import { parseTextureFileName } from './textureNamingParser';
import { resolvePreview } from './previewResolver';

type RegisterStatus =
  | ''
  | 'Material is already registered'
  | 'Material is Newly registered'
  | 'Material is updated';

type ExtendedTextureSet = TextureSet & {
  preview?: File;
};

//  추가: Props 타입 정의
type RegisterMaterialPanelProps = {
  onRegistered?: (materialId: string) => void;
};

export default function RegisterMaterialPanel({ onRegistered }: RegisterMaterialPanelProps = {}) {
  const [textures, setTextures] = useState<ExtendedTextureSet>({});
  const [status, setStatus] = useState<RegisterStatus>('');

  const lastRegisteredRef = useRef<ExtendedTextureSet | null>(null);

  /**
   * STEP 1: texture parsing ONLY (no preview logic here)
   */
  const parseTextures = (files: FileList) => {
    const parsed: ExtendedTextureSet = {};

    Array.from(files).forEach((file) => {
      const { key } = parseTextureFileName(file);

      if (!key) return;

      parsed[key] = file;
    });

    setTextures(parsed);
    console.log('PARSED TEXTURES', parsed);
  };

  /**
   * FILE RENAMING (unchanged)
   */
  const buildStudioFile = (file: File, channelKey: string): File => {
    const name = file.name;

    const dotIndex = name.lastIndexOf('.');
    const ext = dotIndex !== -1 ? name.slice(dotIndex) : '';
    const base = dotIndex !== -1 ? name.slice(0, dotIndex) : name;

    const assetName = base.split('_')[0].toLowerCase();

    const finalName = `${assetName}_${channelKey}${ext}`;

    return new File([file], finalName, {
      type: file.type,
      lastModified: file.lastModified,
    });
  };

  /**
   * UPLOAD (preview resolved here, NOT in parser)
   */
  const uploadMaterial = async (textureData: ExtendedTextureSet) => {
    const formData = new FormData();

    const resolved = {
      ...textureData,
      preview: resolvePreview(textureData),
    };

    Object.entries(resolved).forEach(([key, file]) => {
      if (!file) return;

      const studioFile = buildStudioFile(file, key);

      formData.append(key, studioFile);
    });

    try {
      const response = await fetch('/api/material/register', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('REGISTER SUCCESS', result);
      
      // ✅ 추가: 등록 성공 시 onRegistered 콜백 호출
      if (onRegistered && result.materialId) {
        onRegistered(result.materialId);
      }
    } catch (err) {
      console.error('REGISTER FAILED', err);
    }
  };

  /**
   * REGISTER LOGIC (unchanged behavior)
   */
  const registerMaterial = async () => {
    if (!lastRegisteredRef.current) {
      await uploadMaterial(textures);

      lastRegisteredRef.current = textures;
      setStatus('Material is Newly registered');
      return;
    }

    const changedCount = compareTextureSets(
      lastRegisteredRef.current,
      textures
    );

    if (changedCount === 0) {
      setStatus('Material is already registered');
      return;
    }

    await uploadMaterial(textures);

    lastRegisteredRef.current = textures;

    setStatus(
      changedCount === Object.keys(textures).length
        ? 'Material is Newly registered'
        : 'Material is updated'
    );
  };

  const textureLabels = [
    'albedo',
    'normal',
    'roughness',
    'ao',
    'displacement',
    'metallic',
    'opacity',
    'emissive',
    'specular',
    'glossiness',
    'sss',
    'fuzz',
    'arm',
    'preview',
  ] as const;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      padding: 14,
      borderRadius: 16,
      background: 'rgba(255,255,255,0.04)',
    }}>
      <div style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>
        Register Material
      </div>

      <input
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp"
        onChange={(e) => {
          if (!e.target.files) return;
          parseTextures(e.target.files);
        }}
      />

      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
        {textureLabels.map((key) => (
          <div key={key}>
            {key}: {(textures as any)[key]?.name || '-'}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: '#80ffaa', fontWeight: 600 }}>
        {status}
      </div>

      <button onClick={registerMaterial}>
        RegisterMaterial
      </button>

      <PurgeAllRegisteredMaterial />
    </div>
  );
}