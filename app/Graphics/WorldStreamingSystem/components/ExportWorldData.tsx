"use client";

/**
 * =========================================
 * GIS → SVG EXPORTER
 * =========================================
 *
 * WHY SVG:
 *
 * - Blender import 훨씬 안정적
 * - Illustrator/Figma/Inkscape 가능
 * - Houdini curve workflow 가능
 * - GIS footprint 검증 쉬움
 * - OBJ triangulation 문제 회피
 *
 * Blender:
 * File → Import → SVG
 *
 * 이후:
 * Geometry Nodes / Extrude 사용
 *
 * =========================================
 */

type Feature = any;

/**
 * =========================================
 * SVG BUILDER
 * =========================================
 */

function toSVG(features: Feature[]) {
  /**
   * =========================================
   * COLLECT ALL POINTS
   * =========================================
   */

  const allPoints: number[][] = [];

  const collectCoords = (coords: any) => {
    if (!coords) return;

    if (
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      allPoints.push(coords);
      return;
    }

    coords.forEach(collectCoords);
  };

  features.forEach((f) => {
    if (!f.geometry) return;

    collectCoords(f.geometry.coordinates);
  });

  if (allPoints.length === 0) {
    return "";
  }

  /**
   * =========================================
   * BOUNDS
   * =========================================
   */

  let minX = Infinity;
  let minY = Infinity;

  let maxX = -Infinity;
  let maxY = -Infinity;

  allPoints.forEach((p) => {
    minX = Math.min(minX, p[0]);
    minY = Math.min(minY, p[1]);

    maxX = Math.max(maxX, p[0]);
    maxY = Math.max(maxY, p[1]);
  });

  /**
   * =========================================
   * NORMALIZE
   * =========================================
   */

  const SCALE = 100000;

  const width =
    (maxX - minX) * SCALE;

  const height =
    (maxY - minY) * SCALE;

  /**
   * SVG Y-axis flip
   */

  const projectPoint = (
    lon: number,
    lat: number
  ) => {
    const x =
      (lon - minX) * SCALE;

    const y =
      height -
      (lat - minY) * SCALE;

    return [x, y];
  };

  /**
   * =========================================
   * SVG HEADER
   * =========================================
   */

  let svg = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
>
`;

  /**
   * =========================================
   * PROCESS RING
   * =========================================
   */

  const processRing = (
    ring: number[][]
  ) => {
    if (!ring || ring.length < 2)
      return;

    const pts = ring
      .map((p) => {
        const [x, y] =
          projectPoint(
            p[0],
            p[1]
          );

        return `${x},${y}`;
      })
      .join(" ");

    svg += `
<polygon
  points="${pts}"
  fill="none"
  stroke="white"
  stroke-width="1"
/>
`;
  };

  /**
   * =========================================
   * PROCESS FEATURES
   * =========================================
   */

  features.forEach((f) => {
    const g = f.geometry;

    if (!g) return;

    /**
     * Polygon
     */

    if (g.type === "Polygon") {
      g.coordinates.forEach(
        (ring: number[][]) => {
          processRing(ring);
        }
      );
    }

    /**
     * MultiPolygon
     */

    if (
      g.type === "MultiPolygon"
    ) {
      g.coordinates.forEach(
        (poly: number[][][]) => {
          poly.forEach(
            (
              ring: number[][]
            ) => {
              processRing(ring);
            }
          );
        }
      );
    }

    /**
     * LineString
     */

    if (
      g.type === "LineString"
    ) {
      processRing(g.coordinates);
    }
  });

  /**
   * =========================================
   * CLOSE SVG
   * =========================================
   */

  svg += `
</svg>
`;

  console.log(
    "SVG GENERATED:",
    width,
    height
  );

  return svg;
}

/**
 * =========================================
 * DOWNLOAD
 * =========================================
 */

function downloadFile(
  content: string,
  name: string
) {
  const blob = new Blob(
    [content],
    {
      type: "image/svg+xml",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = name;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

/**
 * =========================================
 * EXPORT COMPONENT
 * =========================================
 */

export function ExportWorldData({
  features,
}: {
  features: any[];
}) {
  const exportSVG = () => {
    console.log(
      "EXPORT FEATURES:",
      features
    );

    if (
      !features ||
      features.length === 0
    ) {
      alert(
        "No GIS features found"
      );

      return;
    }

    const svg = toSVG(features);

    console.log(
      "SVG LENGTH:",
      svg.length
    );

    downloadFile(
      svg,
      "world.svg"
    );

    console.log(
      "SVG EXPORT COMPLETE"
    );
  };

  return (
    <button
      onClick={exportSVG}
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,

        zIndex: 999999,

        padding: "12px 16px",

        background: "#202020",

        color: "#ffffff",

        border:
          "1px solid #555",

        borderRadius: 8,

        cursor: "pointer",
      }}
    >
      Export World SVG
    </button>
  );
}