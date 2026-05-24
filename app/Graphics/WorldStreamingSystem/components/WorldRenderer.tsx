"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

import { useWorldStore } from "../state/worldStore";
import { initialWorld } from "../data/initialWorld";

export default function WorldRenderer() {
  const ref = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<maplibregl.Map | null>(null);

  const features = useWorldStore((s) => s.features);
  const addRoad = useWorldStore((s) => s.addRoad);

  // 1. init world state once
  useEffect(() => {
    useWorldStore.setState({ features: initialWorld as any });
  }, []);

  // 2. init map once
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
          features: features as any,
        },
      });

      map.addLayer({
        id: "roads",
        type: "line",
        source: "world",
        filter: ["==", ["geometry-type"], "LineString"],
        paint: {
          "line-color": ["get", "debugColor"],
          "line-width": 5,
        },
      });

      map.addLayer({
        id: "nodes",
        type: "circle",
        source: "world",
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-radius": 6,
          "circle-color": "#ffffff",
        },
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 3. runtime mutation example (engine behavior test)
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

  // 4. 핵심: state → map sync (이게 엔진 핵심)
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
      style={{ width: "100%", height: "100vh" }}
    />
  );
}