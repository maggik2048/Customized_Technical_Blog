"use client";

import { useEffect, useRef } from "react";

import "maplibre-gl/dist/maplibre-gl.css";

import { worldGeoJson } from "../data/worldGeoJson";
import { createMap } from "../utils/createMap";
import { addRoadLayer } from "../layers/roadLayer";
import { addDistrictLayer } from "../layers/districtLayer";
import { addIntersectionLayer } from "../layers/intersectionLayer";

export default function RoadMap() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const map = createMap(ref.current);

    map.on("load", () => {
      map.addSource("world", {
        type: "geojson",
        data: worldGeoJson as any,
      });

      addDistrictLayer(map);
      addRoadLayer(map);
      addIntersectionLayer(map);
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={ref}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}