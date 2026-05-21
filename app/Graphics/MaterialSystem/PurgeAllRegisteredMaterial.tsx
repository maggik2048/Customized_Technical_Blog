'use client';

import { useState } from 'react';

type PurgeStatus =
  | ''
  | 'All materials deleted successfully'
  | 'Delete failed';

export default function PurgeAllRegisteredMaterial() {
  const [status, setStatus] = useState<PurgeStatus>('');
  const [loading, setLoading] = useState(false);

  const purgeAllMaterials = async () => {
    const confirmResult = window.confirm(
      'Are you sure you want to delete all registered materials?\nThis action cannot be undone.'
    );

    if (!confirmResult) return;

    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/material/delete', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Delete failed');
      }

      console.log('DELETE SUCCESS', result);

      setStatus('All materials deleted successfully');
    } catch (err) {
      console.error('DELETE FAILED', err);
      setStatus('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        padding: 14,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        Delete All Materials
      </div>

      <div
        style={{
          fontSize: 12,
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.4,
        }}
      >
        This will permanently delete all registered material data from the server.
        This action cannot be undone.
      </div>

      <button
        onClick={purgeAllMaterials}
        disabled={loading}
        style={{
          width: '100%',
          height: 44,
          border: 'none',
          borderRadius: 12,
          cursor: loading ? 'not-allowed' : 'pointer',
          color: 'white',
          fontWeight: 700,
          background: loading
            ? 'rgba(255,80,80,0.3)'
            : 'rgba(255,80,80,0.2)',
          border: '1px solid rgba(255,80,80,0.3)',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Deleting...' : 'Delete All Materials'}
      </button>

      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color:
            status === 'All materials deleted successfully'
              ? '#80ffaa'
              : status === 'Delete failed'
              ? '#ff8080'
              : 'rgba(255,255,255,0.6)',
        }}
      >
        {status}
      </div>
    </div>
  );
}