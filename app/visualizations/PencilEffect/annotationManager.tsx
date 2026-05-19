// annotationManager.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type AnnotationState = {
  showThreshold: boolean;
  showConvex: boolean;
  showLongestSide: boolean;
  showPerpendicular: boolean;
  showAreaText: boolean;
  showHatching: boolean;

  // 추가
  showHatchEndpoints: boolean;
};

type AnnotationContextType = {
  annotations: AnnotationState;

  toggleAnnotation: (
    key: keyof AnnotationState
  ) => void;
};

const AnnotationContext =
  createContext<
    AnnotationContextType | undefined
  >(undefined);

export function AnnotationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [annotations, setAnnotations] =
    useState<AnnotationState>({
      showThreshold: true,
      showConvex: true,
      showLongestSide: true,
      showPerpendicular: true,
      showAreaText: true,
      showHatching: true,

      // 추가
      showHatchEndpoints: true,
    });

  const toggleAnnotation = (
    key: keyof AnnotationState
  ) => {
    setAnnotations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <AnnotationContext.Provider
      value={{
        annotations,
        toggleAnnotation,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotationManager() {
  const context = useContext(
    AnnotationContext
  );

  if (!context) {
    throw new Error(
      "useAnnotationManager must be used inside AnnotationProvider"
    );
  }

  return context;
}

export function AnnotationPanel() {
  const {
    annotations,
    toggleAnnotation,
  } = useAnnotationManager();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        border: "1px solid #444",
        width: 240,
        background: "#111",
        color: "white",
        fontSize: 14,
      }}
    >
      <b>Annotation Debug</b>

      <label>
        <input
          type="checkbox"
          checked={
            annotations.showThreshold
          }
          onChange={() =>
            toggleAnnotation(
              "showThreshold"
            )
          }
        />
        Threshold
      </label>

      <label>
        <input
          type="checkbox"
          checked={
            annotations.showConvex
          }
          onChange={() =>
            toggleAnnotation(
              "showConvex"
            )
          }
        />
        Convex
      </label>

      <label>
        <input
          type="checkbox"
          checked={
            annotations.showLongestSide
          }
          onChange={() =>
            toggleAnnotation(
              "showLongestSide"
            )
          }
        />
        Longest Side
      </label>

      <label>
        <input
          type="checkbox"
          checked={
            annotations.showPerpendicular
          }
          onChange={() =>
            toggleAnnotation(
              "showPerpendicular"
            )
          }
        />
        Perpendicular
      </label>

      <label>
        <input
          type="checkbox"
          checked={
            annotations.showAreaText
          }
          onChange={() =>
            toggleAnnotation(
              "showAreaText"
            )
          }
        />
        Area Text
      </label>

      <label>
        <input
          type="checkbox"
          checked={
            annotations.showHatching
          }
          onChange={() =>
            toggleAnnotation(
              "showHatching"
            )
          }
        />
        Hatch
      </label>

      {/* 추가 */}
      <label>
        <input
          type="checkbox"
          checked={
            annotations.showHatchEndpoints
          }
          onChange={() =>
            toggleAnnotation(
              "showHatchEndpoints"
            )
          }
        />
        Hatch Endpoints
      </label>
    </div>
  );
}