"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import { useWorldStore } from "../state/worldStore";
import { initialWorld } from "../data/initialWorld";

// layers
import { addRoadLayer } from "../layers/roadLayer";
import { addIntersectionLayer } from "../layers/intersectionLayer";
import { addDistrictLayer } from "../layers/districtLayer";

export default function WorldRenderer() {
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const features = useWorldStore((s) => s.features);
  const addRoad = useWorldStore((s) => s.addRoad);

  // 1. init world state
  useEffect(() => {
    useWorldStore.setState({ features: initialWorld as any });
  }, []);

  // 2. init map
  useEffect(() => {
    if (!ref.current) return;

    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [128.587, 35.152],
      zoom: 15,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("world", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: useWorldStore.getState().features as any,
        },
      });

      // =========================
      // LAYERS (CRITICAL ORDER)
      // =========================

      // 1. POLYGON FIRST (BASE LAYER)
      map.addLayer({
        id: "district-fill",
        type: "fill",
        source: "world",
        paint: {
          "fill-color": "#2c5cff",
          "fill-opacity": 0.35,
        },
      });

      map.addLayer({
        id: "district-outline",
        type: "line",
        source: "world",
        paint: {
          "line-color": "#2c5cff",
          "line-width": 1,
        },
      });

      // 2. ROADS
      addRoadLayer(map);

      // 3. INTERSECTIONS
      addIntersectionLayer(map);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 3. runtime mutation test
  useEffect(() => {
    const interval = setInterval(() => {
      addRoad({
        id: "road_dynamic_" + Date.now(),
        type: "Feature",
        properties: {
          name: "dynamic road",
          roadClass: "residential",
          lanesForward: 1,
          lanesBackward: 1,
          speedLimit: 30,
          debugColor: "#33ffaa",
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [128.588, 35.150],
            [128.589, 35.151],
          ],
        },
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [addRoad]);

  // 4. state sync → map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = map.getSource("world") as maplibregl.GeoJSONSource;
    if (!source) return;

    source.setData({
      type: "FeatureCollection",
      features: features as any,
    });
  }, [features]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
  );
}