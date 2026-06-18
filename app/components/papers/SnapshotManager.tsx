// app/components/papers/SnapshotManager.tsx
"use client";

import React, { useRef, useCallback } from "react";
import html2canvas from "html2canvas";

export interface SnapshotData {
  id: string;
  imageData: string;
  width: number;
  height: number;
  timestamp: number;
}

export const useSnapshotManager = () => {
  const snapshots = useRef<Map<string, SnapshotData>>(new Map());

  const takeSnapshot = useCallback(async (
    element: HTMLElement,
    id: string
  ): Promise<SnapshotData | null> => {
    try {
      console.log(`📸 Taking snapshot for ${id}...`);
      
      // 요소가 실제로 DOM에 있는지 확인
      if (!element || !element.isConnected) {
        console.error('❌ Element not in DOM');
        return null;
      }

      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // 클론된 문서에서 스타일이 제대로 적용되도록
          const clonedElement = clonedDoc.querySelector(`[data-snapshot-id="${id}"]`);
          if (clonedElement) {
            (clonedElement as HTMLElement).style.transform = 'none';
          }
        }
      });

      const imageData = canvas.toDataURL('image/png', 0.95);
      const snapshot: SnapshotData = {
        id,
        imageData,
        width: canvas.width,
        height: canvas.height,
        timestamp: Date.now()
      };

      snapshots.current.set(id, snapshot);
      console.log(`✅ Snapshot captured for ${id}, size: ${canvas.width}x${canvas.height}`);
      return snapshot;
    } catch (error) {
      console.error('❌ Failed to take snapshot:', error);
      return null;
    }
  }, []);

  const getSnapshot = useCallback((id: string): SnapshotData | undefined => {
    return snapshots.current.get(id);
  }, []);

  const getAllSnapshots = useCallback((): SnapshotData[] => {
    return Array.from(snapshots.current.values());
  }, []);

  return {
    takeSnapshot,
    getSnapshot,
    getAllSnapshots,
  };
};