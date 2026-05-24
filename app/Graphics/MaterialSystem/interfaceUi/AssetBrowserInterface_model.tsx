'use client';

import { useEffect, useRef, useState } from 'react';

import AssetCard from './AssetCard';
import { styles } from './assetbrowserinterfaceStyle';

import { ThumbnailRenderer }
from '../ThumbnailRenderer';

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

  //
  // STATE
  //
  const [models, setModels] =
    useState<ModelItem[]>([]);

  const [latestModelId, setLatestModelId] =
    useState<string | null>(null);

  const [isUploading, setIsUploading] =
    useState(false);

  //
  // REFS
  //
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  //
  // THUMBNAIL RENDERER
  //
  const thumbnailRenderer =
    useRef(
      new ThumbnailRenderer()
    );

  //
  // INITIAL LOAD
  //
  useEffect(() => {

    refreshModels();

  }, []);

  //
  // REFRESH
  //
  const refreshModels = async () => {

    try {

      const res = await fetch(
        '/api/model/list'
      );

      const data =
        await res.json();

      setModels(data);

      console.log(
        'MODELS REFRESHED:',
        data
      );

    } catch (err) {

      console.error(
        'MODEL REFRESH FAILED',
        err
      );

    }
  };

  //
  // OPEN FILE PICKER
  //
  const handleRegisterClick = () => {

    fileInputRef.current?.click();

  };

  //
  // FILE SELECT
  //
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) return;

    try {

      setIsUploading(true);

      console.log(
        'GENERATING THUMBNAIL...'
      );

      //
      // GENERATE PREVIEW
      //
      const previewBlob =
        await thumbnailRenderer.current
          .generatePreview(file);

      console.log(
        'THUMBNAIL GENERATED'
      );

      //
      // FORM DATA
      //
      const formData =
        new FormData();

      formData.append(
        'model',
        file
      );

      formData.append(
        'preview',
        previewBlob,
        'preview.png'
      );

      //
      // REGISTER MODEL
      //
      const res = await fetch(
        '/api/model/register',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data =
        await res.json();

      console.log(
        'MODEL REGISTERED',
        data
      );

      //
      // REFRESH
      //
      await refreshModels();

    } catch (err) {

      console.error(
        'MODEL REGISTER FAILED',
        err
      );

    } finally {

      setIsUploading(false);

      //
      // RESET INPUT
      //
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      style={{
        ...styles.sidebar,

        //
        // RIGHT SIDE FIX
        //
        right: 0,
        left: 'auto',

        borderLeft:
          '1px solid rgba(255,255,255,0.08)',

        borderRight: 'none',
      }}
    >

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb,.gltf,.fbx,.obj"
        style={{
          display: 'none',
        }}
        onChange={handleFileChange}
      />

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

      {/* REGISTER */}
      <button
        onClick={handleRegisterClick}
        style={styles.registerButton}
        disabled={isUploading}
      >
        {
          isUploading
            ? 'Generating Preview...'
            : 'registerModel'
        }
      </button>

      {/* GRID */}
      <div style={styles.grid}>

        {models.map(
          (model, index) => (

            <div
              key={model.modelId}

              onClick={() => {

                setLatestModelId(
                  model.modelId
                );

                onSelectModel(
                  model.modelId
                );
              }}

              style={{
                cursor: 'pointer',
              }}
            >

              <AssetCard

                assetName={
                  model.modelName
                }

                previewUrl={
                  model.previewUrl
                }

                materialId={
                  model.modelId
                }

                index={index}

              />

            </div>
          )
        )}

      </div>

    </div>
  );
}