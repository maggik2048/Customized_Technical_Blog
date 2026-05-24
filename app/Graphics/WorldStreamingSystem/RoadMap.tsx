"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

const geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Main Road",
        lanes: 2,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [128.585, 35.152],
          [128.587, 35.153],
          [128.590, 35.155],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Side Road",
        lanes: 1,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [128.587, 35.153],
          [128.588, 35.150],
        ],
      },
    },
  ],
};

export default function RoadMap() {

  const mapContainer =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {

    if (!mapContainer.current)
      return;

    const map =
      new maplibregl.Map({
        container:
          mapContainer.current,

        style:
          "https://demotiles.maplibre.org/style.json",

        center: [128.587, 35.152],

        zoom: 15,
      });

    map.on("load", () => {

      map.addSource("roads", {
        type: "geojson",
        data: geojson as any,
      });

      map.addLayer({
        id: "road-lines",
        type: "line",
        source: "roads",

        paint: {
          "line-color":
            "#ff5533",

          "line-width": 6,
        },
      });
    });

    return () => {
      map.remove();
    };

  }, []);

  return (

    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100vh",
      }}
    />

  );
}