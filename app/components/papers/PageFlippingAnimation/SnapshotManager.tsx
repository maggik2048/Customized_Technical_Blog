// app/components/papers/PageFlippingAnimation/SnapshotManager.tsx
"use client";

import React, { useRef, useCallback, useState } from "react";
import html2canvas from "html2canvas";

type SnapshotOptions = {
  scale?: number;
  backgroundColor?: string | null;
  quality?: number;
  useCORS?: boolean;
  logging?: boolean;
};

type SnapshotResult = {
  dataUrl: string;
  blob: Blob;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  filename?: string;
  savedPath?: string;
};

// ✅ ADDED: SnapshotData type for page flipping animation
export type SnapshotData = {
  id: string;
  dataUrl: string;
  width: number;
  height: number;
  timestamp: number;
  savedPath?: string;
  pageNumber?: number;
  blob?: Blob;
};

type SnapshotManagerProps = {
  children: React.ReactNode;
  onCaptureStart?: () => void;
  onCaptureEnd?: (result: SnapshotResult) => void;
  onCaptureError?: (error: Error) => void;
  autoCapture?: boolean;
  captureDelay?: number;
  saveToServer?: boolean; // 서버에 저장할지 여부
};

export class SnapshotManager {
  private static instance: SnapshotManager;
  private contentRefs: Map<string, React.RefObject<HTMLDivElement>> = new Map();
  private isCapturing: boolean = false;
  private captureQueue: Array<{
    id: string;
    resolve: (result: SnapshotResult) => void;
    reject: (error: Error) => void;
    options?: SnapshotOptions;
  }> = [];

  private constructor() {}

  static getInstance(): SnapshotManager {
    if (!SnapshotManager.instance) {
      SnapshotManager.instance = new SnapshotManager();
    }
    return SnapshotManager.instance;
  }

  /**
   * 콘텐츠 영역 ref 등록
   */
  registerContentRef(id: string, ref: React.RefObject<HTMLDivElement>) {
    this.contentRefs.set(id, ref);
  }

  /**
   * 콘텐츠 영역 ref 제거
   */
  unregisterContentRef(id: string) {
    this.contentRefs.delete(id);
  }

  /**
   * 특정 ID의 콘텐츠 스크린샷 캡처
   */
  async captureContent(
    id: string,
    options: SnapshotOptions = {}
  ): Promise<SnapshotResult> {
    const ref = this.contentRefs.get(id);
    if (!ref || !ref.current) {
      throw new Error(`Content ref not found for id: ${id}`);
    }

    return this.captureElement(ref.current, options);
  }

  /**
   * 현재 활성화된 콘텐츠 스크린샷 캡처
   */
  async captureActiveContent(
    options: SnapshotOptions = {}
  ): Promise<SnapshotResult> {
    const activeRef = this.findActiveContentRef();
    if (!activeRef || !activeRef.current) {
      throw new Error("No active content found");
    }

    return this.captureElement(activeRef.current, options);
  }

  /**
   * 모든 콘텐츠 스크린샷 캡처
   */
  async captureAllContents(
    options: SnapshotOptions = {}
  ): Promise<Map<string, SnapshotResult>> {
    const results = new Map<string, SnapshotResult>();
    const entries = Array.from(this.contentRefs.entries());

    for (const [id, ref] of entries) {
      if (ref.current) {
        try {
          const result = await this.captureElement(ref.current, options);
          results.set(id, result);
        } catch (error) {
          console.error(`Failed to capture content ${id}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * DOM 요소 스크린샷 캡처
   */
  private async captureElement(
    element: HTMLElement,
    options: SnapshotOptions = {}
  ): Promise<SnapshotResult> {
    const {
      scale = 2,
      backgroundColor = '#ffffff',
      quality = 1,
      useCORS = true,
      logging = false,
    } = options;

    if (this.isCapturing) {
      return new Promise((resolve, reject) => {
        this.captureQueue.push({
          id: 'temp',
          resolve,
          reject,
          options,
        });
      });
    }

    this.isCapturing = true;

    try {
      const rect = element.getBoundingClientRect();
      const width = element.scrollWidth || rect.width;
      const height = element.scrollHeight || rect.height;

      const canvas = await html2canvas(element, {
        scale,
        useCORS,
        backgroundColor,
        logging,
        width,
        height,
        windowWidth: width,
        windowHeight: height,
        onclone: (document) => {
          const clonedElement = document.querySelector('[data-snapshot-target]');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.transform = 'none';
          }
        },
      });

      const dataUrl = canvas.toDataURL('image/png', quality);
      const blob = await this.canvasToBlob(canvas, quality);

      // 파일명 생성
      const timestamp = Date.now();
      const filename = `currentpage_${timestamp}.png`;
      const savedPath = `/CurrentPage/${filename}`;

      const result: SnapshotResult = {
        dataUrl,
        blob,
        canvas,
        width: canvas.width,
        height: canvas.height,
        filename,
        savedPath,
      };

      // 서버에 저장 (선택사항)
      await this.saveToServer(blob, filename);

      this.processQueue();

      return result;
    } catch (error) {
      this.isCapturing = false;
      throw error;
    } finally {
      this.isCapturing = false;
    }
  }

  /**
   * 서버에 스크린샷 저장
   */
  private async saveToServer(blob: Blob, filename: string): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('screenshot', blob, filename);

      const response = await fetch('/api/save-screenshot', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to save screenshot: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Screenshot saved to server:', result.path);
    } catch (error) {
      console.error('❌ Failed to save screenshot to server:', error);
      // 에러는 무시하고 계속 진행 (로컬에는 저장됨)
    }
  }

  /**
   * Canvas를 Blob으로 변환
   */
  private canvasToBlob(canvas: HTMLCanvasElement, quality: number = 1): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/png',
        quality
      );
    });
  }

  /**
   * 대기열 처리
   */
  private processQueue() {
    while (this.captureQueue.length > 0) {
      const item = this.captureQueue.shift();
      if (item) {
        this.captureActiveContent(item.options)
          .then(item.resolve)
          .catch(item.reject);
      }
    }
  }

  /**
   * 활성화된 콘텐츠 ref 찾기
   */
  private findActiveContentRef(): React.RefObject<HTMLDivElement> | null {
    for (const [, ref] of this.contentRefs) {
      if (ref.current && ref.current.dataset.active === 'true') {
        return ref;
      }
    }

    const entries = Array.from(this.contentRefs.entries());
    if (entries.length > 0) {
      return entries[entries.length - 1][1];
    }

    return null;
  }

  /**
   * 스크린샷 다운로드 (로컬)
   */
  downloadSnapshot(result: SnapshotResult, filename?: string) {
    const name = filename || result.filename || `screenshot-${Date.now()}.png`;
    const link = document.createElement('a');
    link.download = name;
    link.href = result.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * SnapshotResult를 SnapshotData로 변환
   */
  resultToSnapshotData(
    result: SnapshotResult, 
    id: string, 
    pageNumber?: number
  ): SnapshotData {
    return {
      id,
      dataUrl: result.dataUrl,
      width: result.width,
      height: result.height,
      timestamp: Date.now(),
      savedPath: result.savedPath,
      pageNumber,
      blob: result.blob,
    };
  }

  /**
   * 상태 초기화
   */
  clear() {
    this.contentRefs.clear();
    this.captureQueue = [];
    this.isCapturing = false;
  }
}

/**
 * React Hook: SnapshotManager 사용
 */
export function useSnapshotManager() {
  const manager = useRef(SnapshotManager.getInstance());
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastResult, setLastResult] = useState<SnapshotResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [savedPath, setSavedPath] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const id = useRef(`content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  React.useEffect(() => {
    const currentId = id.current;
    const currentRef = contentRef;

    if (currentRef.current) {
      currentRef.current.dataset.snapshotTarget = 'true';
    }

    manager.current.registerContentRef(currentId, currentRef);

    return () => {
      manager.current.unregisterContentRef(currentId);
    };
  }, []);

  const setActive = useCallback((active: boolean) => {
    if (contentRef.current) {
      if (active) {
        contentRef.current.dataset.active = 'true';
      } else {
        delete contentRef.current.dataset.active;
      }
    }
  }, []);

  const capture = useCallback(async (options: SnapshotOptions = {}) => {
    setIsCapturing(true);
    setError(null);
    setSavedPath(null);

    try {
      const result = await manager.current.captureContent(id.current, options);
      setLastResult(result);
      
      // 저장된 경로 설정
      if (result.savedPath) {
        setSavedPath(result.savedPath);
        console.log(`✅ Screenshot saved to: ${result.savedPath}`);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to capture screenshot');
      setError(error);
      throw error;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const download = useCallback((filename?: string) => {
    if (lastResult) {
      const name = filename || `screenshot-${Date.now()}.png`;
      manager.current.downloadSnapshot(lastResult, name);
    }
  }, [lastResult]);

  const clear = useCallback(() => {
    setLastResult(null);
    setError(null);
    setSavedPath(null);
  }, []);

  // Helper: Convert last result to SnapshotData
  const getSnapshotData = useCallback((pageNumber?: number): SnapshotData | null => {
    if (!lastResult) return null;
    return manager.current.resultToSnapshotData(lastResult, id.current, pageNumber);
  }, [lastResult]);

  return {
    contentRef,
    isCapturing,
    lastResult,
    error,
    savedPath,
    capture,
    download,
    clear,
    setActive,
    getSnapshotData,
    manager: manager.current,
  };
}

/**
 * SnapshotManager Provider Component
 */
export function SnapshotManagerProvider({ 
  children, 
  onCaptureStart,
  onCaptureEnd,
  onCaptureError,
  autoCapture = false,
  captureDelay = 1000,
  saveToServer = true,
}: SnapshotManagerProps) {
  const manager = useRef(SnapshotManager.getInstance());
  const [isCapturing, setIsCapturing] = useState(false);

  React.useEffect(() => {
    if (autoCapture) {
      const timer = setTimeout(() => {
        handleCapture();
      }, captureDelay);

      return () => clearTimeout(timer);
    }
  }, [autoCapture, captureDelay]);

  const handleCapture = useCallback(async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    onCaptureStart?.();

    try {
      const result = await manager.current.captureActiveContent({
        scale: 2,
        backgroundColor: '#ffffff',
      });
      onCaptureEnd?.(result);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Capture failed');
      onCaptureError?.(err);
    } finally {
      setIsCapturing(false);
    }
  }, [isCapturing, onCaptureStart, onCaptureEnd, onCaptureError]);

  return (
    <div data-snapshot-provider="true">
      {children}
    </div>
  );
}

export default SnapshotManager;