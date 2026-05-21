'use client';

import { useRef, useState } from 'react';
import PurgeAllRegisteredMaterial from './PurgeAllRegisteredMaterial';
import {
  compareTextureSets,
  TextureSet,
} from './compareTextureSetsbeforeRegister';

import { parseTextureFileName } from './textureNamingParser';

type RegisterStatus =
  | ''
  | 'Material is already registered'
  | 'Material is Newly registered'
  | 'Material is updated';

export default function RegisterMaterialPanel() {
  const [textures, setTextures] = useState<TextureSet>({});
  const [status, setStatus] = useState<RegisterStatus>('');

  const lastRegisteredRef = useRef<TextureSet | null>(null);

  //
  // AUTO PARSER (cleaned)
  //
  const parseTextures = (files: FileList) => {
    const parsed: TextureSet = {};

    Array.from(files).forEach((file) => {
      const { key } = parseTextureFileName(file);
      if (key) parsed[key] = file;
    });

    setTextures(parsed);
    console.log('AUTO PARSED TEXTURES', parsed);
  };

  //
  // FILE NAMING FIX
  //
  const buildStudioFile = (
    file: File,
    channelKey: keyof TextureSet
  ): File => {
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

  //
  // UPLOAD
  //
  const uploadMaterial = async (textureData: TextureSet) => {
    const formData = new FormData();

    Object.entries(textureData).forEach(([key, file]) => {
      if (!file) return;

      const studioFile = buildStudioFile(
        file,
        key as keyof TextureSet
      );

      formData.append(key, studioFile);
    });

    try {
      const response = await fetch('/api/material/register', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('REGISTER SUCCESS', result);
    } catch (err) {
      console.error('REGISTER FAILED', err);
    }
  };

  //
  // REGISTER
  //
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

    const totalChannels = Object.keys(textures).length;

    if (changedCount === totalChannels) {
      await uploadMaterial(textures);

      lastRegisteredRef.current = textures;
      setStatus('Material is Newly registered');
      return;
    }

    await uploadMaterial(textures);

    lastRegisteredRef.current = textures;
    setStatus('Material is updated');
  };

  //
  // UI labels (clean improvement)
  //
  const textureLabels: (keyof TextureSet)[] = [
    'albedo',
    'normal',
    'roughness',
    'ao',
    'displacement',
    'metallic',
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        marginBottom: 24,
        padding: 14,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
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
        style={{ color: 'white', fontSize: 12 }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontSize: 12,
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        {textureLabels.map((key) => (
          <div key={key}>
            {key}: {textures[key]?.name || '-'}
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 13,
          color:
            status === 'Material is already registered'
              ? '#ff8080'
              : '#80ffaa',
          fontWeight: 600,
        }}
      >
        {status}
      </div>

      <button
        onClick={registerMaterial}
        style={{
          width: '100%',
          height: 44,
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
          color: 'white',
          fontWeight: 700,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        RegisterMaterial
      </button>

      <PurgeAllRegisteredMaterial />
    </div>
  );
}