'use client';

interface Props {
  item: number;
}

export default function AssetCard({ item }: Props) {
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
      {/* PREVIEW */}
      <div
        style={{
          width: '100%',
          height: '75%',
          background: `linear-gradient(
            ${item * 17}deg,
            rgba(255,255,255,0.12),
            rgba(255,255,255,0.02)
          )`,
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
          background: 'rgba(0,0,0,0.22)',
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
          Material {item + 1}
        </div>

        <div
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 11,
            marginTop: 3,
          }}
        >
          PBR Surface
        </div>
      </div>
    </div>
  );
}