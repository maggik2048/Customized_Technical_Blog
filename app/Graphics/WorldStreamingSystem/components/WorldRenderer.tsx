"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

/**
 * =====================================================
 * UNIVERSAL GIS RENDERER
 * =====================================================
 *
 * 지원:
 * - Point
 * - LineString
 * - Polygon
 * - MultiPolygon
 *
 * semantic filtering 없이
 * geometry 기반으로 전부 렌더
 *
 * 파일:
 * /public/gis/losAngeles.geojson
 *
 * =====================================================
 */

export default function WorldRenderer() {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    /**
     * =====================================================
     * MAP INIT
     * =====================================================
     */

    const map = new maplibregl.Map({
      container: mapContainer.current,

      style: {
        version: 8,

        sources: {},

        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#050505",
            },
          },
        ],
      },

      center: [-118.2437, 34.0522],
      zoom: 11,
    });

    /**
     * =====================================================
     * LOAD GEOJSON
     * =====================================================
     */

    map.on("load", async () => {
      try {
        const res = await fetch(
          "/gis/losAngeles.geojson"
        );

        const geojson = await res.json();

        console.log("FULL GIS:", geojson);

        /**
         * =====================================================
         * FEATURE SAFETY
         * =====================================================
         */

        if (!geojson.features) {
          console.error(
            "No features found"
          );
          return;
        }

        /**
         * =====================================================
         * SOURCE
         * =====================================================
         */

        map.addSource("world", {
          type: "geojson",

          data: geojson,
        });

        /**
         * =====================================================
         * POLYGON FILL
         * =====================================================
         */

        map.addLayer({
          id: "polygon-fill",

          type: "fill",

          source: "world",

          filter: [
            "any",

            ["==", ["geometry-type"], "Polygon"],

            [
              "==",
              ["geometry-type"],
              "MultiPolygon",
            ],
          ],

          paint: {
            "fill-color": [
              "case",

              /**
               * semantic coloring examples
               */

              [
                "has",
                "building",
              ],
              "#444444",

              [
                "has",
                "landuse",
              ],
              "#224422",

              [
                "has",
                "highway",
              ],
              "#553311",

              "#2c5cff",
            ],

            "fill-opacity": 0.35,
          },
        });

        /**
         * =====================================================
         * POLYGON OUTLINE
         * =====================================================
         */

        map.addLayer({
          id: "polygon-outline",

          type: "line",

          source: "world",

          filter: [
            "any",

            ["==", ["geometry-type"], "Polygon"],

            [
              "==",
              ["geometry-type"],
              "MultiPolygon",
            ],
          ],

          paint: {
            "line-color": "#88aaff",

            "line-width": 1,

            "line-opacity": 0.7,
          },
        });

        /**
         * =====================================================
         * LINESTRING ROADS
         * =====================================================
         */

        map.addLayer({
          id: "line-features",

          type: "line",

          source: "world",

          filter: [
            "any",

            [
              "==",
              ["geometry-type"],
              "LineString",
            ],

            [
              "==",
              ["geometry-type"],
              "MultiLineString",
            ],
          ],

          paint: {
            /**
             * semantic coloring
             */

            "line-color": [
              "case",

              [
                "==",
                ["get", "highway"],
                "motorway",
              ],
              "#ff5533",

              [
                "==",
                ["get", "highway"],
                "primary",
              ],
              "#ffaa00",

              [
                "==",
                ["get", "highway"],
                "secondary",
              ],
              "#ffee88",

              "#00ffff",
            ],

            /**
             * semantic width
             */

            "line-width": [
              "case",

              [
                "==",
                ["get", "highway"],
                "motorway",
              ],
              7,

              [
                "==",
                ["get", "highway"],
                "primary",
              ],
              5,

              [
                "==",
                ["get", "highway"],
                "secondary",
              ],
              3,

              1.5,
            ],

            "line-opacity": 0.95,
          },
        });

        /**
         * =====================================================
         * POINT FEATURES
         * =====================================================
         */

        map.addLayer({
          id: "point-features",

          type: "circle",

          source: "world",

          filter: [
            "==",
            ["geometry-type"],
            "Point",
          ],

          paint: {
            "circle-radius": 4,

            "circle-color": "#ffee00",

            "circle-opacity": 0.9,

            "circle-stroke-width": 1,

            "circle-stroke-color": "#000000",
          },
        });

        /**
         * =====================================================
         * LABELS
         * =====================================================
         */

        map.addLayer({
          id: "labels",

          type: "symbol",

          source: "world",

          layout: {
            "text-field": [
              "coalesce",

              ["get", "name"],

              ["get", "highway"],

              ["get", "landuse"],

              "unknown",
            ],

            "text-size": 10,

            "text-offset": [0, 1.2],
          },

          paint: {
            "text-color": "#ffffff",

            "text-halo-color":
              "#000000",

            "text-halo-width": 1,
          },
        });

        /**
         * =====================================================
         * CLICK DEBUG INSPECTOR
         * =====================================================
         */

        map.on("click", (e) => {
          const features =
            map.queryRenderedFeatures(
              e.point
            );

          if (!features.length) return;

          const f = features[0];

          console.log(
            "CLICKED FEATURE:",
            f
          );

          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
              <div style="font-family:sans-serif;">
                <b>
                  ${
                    f.properties?.name ||
                    "Unnamed"
                  }
                </b>

                <br/>

                Geometry:
                ${f.geometry.type}

                <br/>

                Highway:
                ${
                  f.properties?.highway ||
                  "none"
                }

                <br/>

                Landuse:
                ${
                  f.properties?.landuse ||
                  "none"
                }
              </div>
            `)
            .addTo(map);
        });

        /**
         * =====================================================
         * FIT BOUNDS
         * =====================================================
         */

        const bounds =
          new maplibregl.LngLatBounds();

        geojson.features.forEach(
          (f: any) => {
            const g = f.geometry;

            if (!g) return;

            /**
             * recursive coord walker
             */

            const walk = (
              coords: any
            ) => {
              if (
                typeof coords[0] ===
                "number"
              ) {
                bounds.extend([
                  coords[0],
                  coords[1],
                ]);

                return;
              }

              coords.forEach(walk);
            };

            walk(g.coordinates);
          }
        );

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, {
            padding: 40,
          });
        }

        console.log(
          "GIS RENDER COMPLETE"
        );
      } catch (err) {
        console.error(
          "GIS LOAD ERROR:",
          err
        );
      }
    });

    /**
     * =====================================================
     * CLEANUP
     * =====================================================
     */

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
        background: "#000",
      }}
    />
  );
}