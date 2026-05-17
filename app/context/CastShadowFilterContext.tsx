"use client";

import React, { createContext, useContext, useState } from "react";

type CastShadowFilterState = {
  enabled: boolean;
  shadowOn: boolean;
  filterOn: boolean;
  toggle: () => void;
};

const CastShadowFilterContext =
  createContext<CastShadowFilterState | null>(null);

export function CastShadowFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [enabled, setEnabled] = useState(true);

  const toggle = () => setEnabled((prev) => !prev);

  return (
    <CastShadowFilterContext.Provider
      value={{
        enabled,
        shadowOn: enabled,
        filterOn: enabled,
        toggle,
      }}
    >
      {children}
    </CastShadowFilterContext.Provider>
  );
}

export function useCastShadowFilter() {
  const ctx = useContext(CastShadowFilterContext);
  if (!ctx) {
    throw new Error(
      "useCastShadowFilter must be used within CastShadowFilterProvider"
    );
  }
  return ctx;
}