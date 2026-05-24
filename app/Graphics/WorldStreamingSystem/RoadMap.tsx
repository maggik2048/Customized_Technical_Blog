"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

/*
  ADVANCED GIS / PROCEDURAL WORLDBUILDING
  GEOJSON EXAMPLE

  This example demonstrates:

  - FeatureCollection
  - CRS metadata
  - Rich road properties
  - 3D coordinates
  - MultiLineString roads
  - Polygon districts
  - Point intersections
  - Procedural metadata
  - Streaming metadata
  - Houdini/Unreal-friendly attributes
*/

const geojson = {
  type: "FeatureCollection",

  name: "AAA_WorldStreaming_RoadNetwork",

  crs: {
    type: "name",
    properties: {
      name: "EPSG:4326",
    },
  },

  metadata: {
    version: "1.0",
    authoringTool: "WorldStreamingSystem",
    generatedBy: "Procedural GIS Pipeline",
    exportTarget: [
      "Houdini",
      "Unreal Engine",
    ],
  },

  features: [

    /*
      ==========================================
      MAIN ARTERIAL ROAD
      ==========================================
    */

    {
      type: "Feature",

      id: "road_main_001",

      properties: {

        /* BASIC */

        name: "Downtown Arterial",
        featureType: "road",

        /* ROAD CLASSIFICATION */

        roadClass: "arterial",
        roadSurface: "asphalt",
        district: "central_city",

        /* LANE DATA */

        lanesForward: 3,
        lanesBackward: 3,
        laneWidth: 3.5,

        /* TRAFFIC */

        speedLimit: 80,
        trafficDensity: 0.82,
        trafficFlowDirection: "bidirectional",

        /* FLAGS */

        oneWay: false,
        bridge: false,
        tunnel: false,

        /* SIDEWALK */

        sidewalkLeft: true,
        sidewalkRight: true,

        /* PROCEDURAL */

        generationSeed: 812934,
        proceduralCategory:
          "urban_primary",

        /* STREAMING */

        streamingChunk:
          "city_chunk_01",

        lodCategory: "high",

        /* NAVIGATION */

        navRoadId: 1001,

        connectedIntersections: [
          "intersection_A",
          "intersection_B",
        ],

        /* HOUDINI */

        houdiniGroup:
          "roads_primary",

        unrealSplineActor:
          "BP_RoadSpline",

        /* DEBUG */

        debugColor: "#ff5533",
      },

      geometry: {
        type: "LineString",

        /*
          [longitude, latitude, elevation]
        */

        coordinates: [
          [128.585, 35.152, 12.5],
          [128.587, 35.153, 13.1],
          [128.590, 35.155, 14.8],
          [128.594, 35.158, 16.0],
        ],
      },
    },

    /*
      ==========================================
      SIDE ROAD
      ==========================================
    */

    {
      type: "Feature",

      id: "road_side_002",

      properties: {
        name: "Residential Side Road",

        featureType: "road",

        roadClass: "residential",

        roadSurface: "concrete",

        district: "residential_A",

        lanesForward: 1,
        lanesBackward: 1,

        laneWidth: 3.0,

        speedLimit: 30,

        trafficDensity: 0.21,

        oneWay: false,

        sidewalkLeft: true,
        sidewalkRight: false,

        bridge: false,
        tunnel: false,

        generationSeed: 991822,

        proceduralCategory:
          "residential_local",

        streamingChunk:
          "city_chunk_01",

        lodCategory: "medium",

        navRoadId: 2002,

        connectedIntersections: [
          "intersection_A",
        ],

        houdiniGroup:
          "roads_secondary",

        unrealSplineActor:
          "BP_SideRoadSpline",

        debugColor: "#33ffaa",
      },

      geometry: {
        type: "LineString",

        coordinates: [
          [128.587, 35.153, 13.1],
          [128.588, 35.150, 11.7],
          [128.589, 35.148, 10.9],
        ],
      },
    },

    /*
      ==========================================
      MULTI-LANE HIGHWAY
      ==========================================
    */

    {
      type: "Feature",

      id: "highway_003",

      properties: {
        name: "Outer Ring Highway",

        featureType: "highway",

        roadClass: "highway",

        lanesForward: 4,
        lanesBackward: 4,

        speedLimit: 110,

        medianBarrier: true,

        tollRoad: false,

        emergencyLane: true,

        trafficDensity: 0.93,

        streamingChunk:
          "highway_chunk_02",

        proceduralCategory:
          "expressway",

        generationSeed: 553812,

        houdiniGroup:
          "roads_highway",

        debugColor: "#ffaa00",
      },

      geometry: {
        type: "MultiLineString",

        coordinates: [
          [
            [128.600, 35.160, 20.0],
            [128.610, 35.165, 21.2],
          ],

          [
            [128.610, 35.165, 21.2],
            [128.620, 35.170, 22.0],
          ],
        ],
      },
    },

    /*
      ==========================================
      INTERSECTION NODE
      ==========================================
    */

    {
      type: "Feature",

      id: "intersection_A",

      properties: {

        featureType:
          "intersection",

        connectedRoads: [
          "road_main_001",
          "road_side_002",
        ],

        signalized: true,

        trafficLightPattern:
          "4_way_standard",

        pedestrianCrossing:
          true,

        proceduralIntersectionType:
          "urban_cross",

        navIntersectionId: 5001,

        generationSeed: 111999,
      },

      geometry: {
        type: "Point",

        coordinates: [
          128.587,
          35.153,
          13.1,
        ],
      },
    },

    /*
      ==========================================
      DISTRICT POLYGON
      ==========================================
    */

    {
      type: "Feature",

      id: "district_central",

      properties: {

        featureType: "district",

        districtType:
          "commercial",

        zoning: "high_density",

        populationDensity:
          0.88,

        proceduralBiome:
          "urban_dense",

        streamingChunk:
          "district_chunk_A",
      },

      geometry: {
        type: "Polygon",

        coordinates: [
          [
            [128.580, 35.150],
            [128.600, 35.150],
            [128.600, 35.165],
            [128.580, 35.165],
            [128.580, 35.150],
          ],
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

        center: [128.590, 35.155],

        zoom: 14,

        pitch: 45,

        bearing: -15,
      });

    map.on("load", () => {

      /*
        ======================================
        SOURCE
        ======================================
      */

      map.addSource("world-data", {
        type: "geojson",
        data: geojson as any,
      });

      /*
        ======================================
        DISTRICT POLYGON
        ======================================
      */

      map.addLayer({
        id: "district-fill",

        type: "fill",

        source: "world-data",

        filter: [
          "==",
          ["geometry-type"],
          "Polygon",
        ],

        paint: {
          "fill-color":
            "#2244ff",

          "fill-opacity": 0.15,
        },
      });

      /*
        ======================================
        ROAD LINES
        ======================================
      */

      map.addLayer({
        id: "road-lines",

        type: "line",

        source: "world-data",

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

          "line-color": [
            "get",
            "debugColor",
          ],

          "line-width": [

            "case",

            [
              "==",
              ["get", "roadClass"],
              "highway",
            ],
            10,

            [
              "==",
              ["get", "roadClass"],
              "arterial",
            ],
            7,

            4,
          ],
        },
      });

      /*
        ======================================
        INTERSECTION POINTS
        ======================================
      */

      map.addLayer({
        id: "intersection-points",

        type: "circle",

        source: "world-data",

        filter: [
          "==",
          ["geometry-type"],
          "Point",
        ],

        paint: {

          "circle-radius": 7,

          "circle-color":
            "#ffffff",

          "circle-stroke-width":
            2,

          "circle-stroke-color":
            "#000000",
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