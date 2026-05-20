'use client';

import { useState } from 'react';

type TextureSet = {
  albedo?: File;
  normal?: File;
  roughness?: File;
  ao?: File;
  displacement?: File;
  metallic?: File;
};

export default function RegisterMaterialPanel() {

  const [textures, setTextures] =
    useState<TextureSet>({});

  //
  // AUTO PARSER
  //
  // Blender Node Wrangler Ctrl+Shift+T 느낌
  //

  const parseTextures = (
    files: FileList
  ) => {

    const parsed: TextureSet = {};

    Array.from(files).forEach(
      (file) => {

        const name =
          file.name.toLowerCase();

        //
        // ALBEDO / COLOR
        //

        if (
          name.includes('albedo') ||
          name.includes('basecolor') ||
          name.includes('base_color') ||
          name.includes('diffuse') ||
          name.includes('color')
        ) {
          parsed.albedo = file;
        }

        //
        // NORMAL
        //

        else if (
          name.includes('normal') ||
          name.includes('nor') ||
          name.includes('normalgl')
        ) {
          parsed.normal = file;
        }

        //
        // ROUGHNESS
        //

        else if (
          name.includes('roughness') ||
          name.includes('rough')
        ) {
          parsed.roughness = file;
        }

        //
        // AO
        //

        else if (
          name.includes(
            'ambientocclusion'
          ) ||

          name.includes('ao')
        ) {
          parsed.ao = file;
        }

        //
        // DISPLACEMENT
        //

        else if (
          name.includes('displacement') ||
          name.includes('height') ||
          name.includes('disp')
        ) {
          parsed.displacement = file;
        }

        //
        // METALLIC
        //

        else if (
          name.includes('metallic') ||
          name.includes('metalness') ||
          name.includes('metal')
        ) {
          parsed.metallic = file;
        }
      }
    );

    setTextures(parsed);

    console.log(
      'AUTO PARSED TEXTURES',
      parsed
    );
  };

  //
  // REGISTER
  //

  const registerMaterial =
    async () => {

      const formData =
        new FormData();

      Object.entries(textures).forEach(
        ([key, file]) => {

          if (!file) return;

          formData.append(
            key,
            file
          );
        }
      );

      try {

        const response =
          await fetch(
            '/api/material/register',
            {
              method: 'POST',

              body: formData,
            }
          );

        const result =
          await response.json();

        console.log(
          'REGISTER SUCCESS',
          result
        );

      } catch (err) {

        console.error(
          'REGISTER FAILED',
          err
        );
      }
    };

  //
  // UI
  //

  return (

    <div
      style={{
        display: 'flex',

        flexDirection: 'column',

        gap: 14,

        marginBottom: 24,

        padding: 14,

        borderRadius: 16,

        background:
          'rgba(255,255,255,0.04)',

        border:
          '1px solid rgba(255,255,255,0.08)',
      }}
    >

      {/* TITLE */}

      <div
        style={{
          color: 'white',

          fontSize: 18,

          fontWeight: 700,
        }}
      >
        Register Material
      </div>

      {/* FILE INPUT */}

      <input
        type="file"

        multiple

        accept="
          .jpg,
          .jpeg,
          .png,
          .webp
        "

        onChange={(e) => {

          if (!e.target.files)
            return;

          parseTextures(
            e.target.files
          );
        }}

        style={{
          color: 'white',

          fontSize: 12,
        }}
      />

      {/* PARSED RESULT */}

      <div
        style={{
          display: 'flex',

          flexDirection: 'column',

          gap: 6,

          fontSize: 12,

          color:
            'rgba(255,255,255,0.7)',
        }}
      >

        <div>
          Albedo:
          {' '}
          {textures.albedo?.name ||
            '-'}
        </div>

        <div>
          Normal:
          {' '}
          {textures.normal?.name ||
            '-'}
        </div>

        <div>
          Roughness:
          {' '}
          {textures.roughness?.name ||
            '-'}
        </div>

        <div>
          AO:
          {' '}
          {textures.ao?.name ||
            '-'}
        </div>

        <div>
          Displacement:
          {' '}
          {textures.displacement
            ?.name || '-'}
        </div>

        <div>
          Metallic:
          {' '}
          {textures.metallic?.name ||
            '-'}
        </div>

      </div>

      {/* REGISTER BUTTON */}

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

          background:
            'rgba(255,255,255,0.08)',

          border:
            '1px solid rgba(255,255,255,0.08)',
        }}
      >
        RegisterMaterial
      </button>

    </div>
  );
}