'use client';

interface Props {
  assetName: string;
  previewUrl: string;
  materialId: string;
  index: number;
}

export default function AssetCard({
  assetName,
  previewUrl,
  materialId,
  index,
}: Props) {

  return (
    <div
      style={{
        aspectRatio: '1 / 1',
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        transition: '0.25s ease',
      }}
    >

      {/* PREVIEW IMAGE */}
      <img
        src={previewUrl}
        alt={assetName}
        style={{
          width: '100%',
          height: '75%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* LABEL */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: 10,
          boxSizing: 'border-box',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {assetName}
        </div>

        <div
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 11,
            marginTop: 3,
          }}
        >
          {materialId}
        </div>
      </div>

    </div>
  );
}