"use client";

import React from "react";

type Props = {
  raw: string;
};

export default function DiffVisualizer({
  raw,
}: Props) {
  const lines = raw.split("\n");

  return (
    <div
      style={{
        margin: "10px 0",

        borderRadius: 8,

        overflow: "hidden",

        border: "1px solid #333",

        fontFamily: "monospace",

        fontSize: 14,
      }}
    >
      {lines.map((line, index) => {
        let background = "#1e1e1e";

        let color = "#d4d4d4";

        /**
         * added
         */

        if (line.startsWith("+")) {
          background = "#0f2a1f";

          color = "#7ee787";
        }

        /**
         * removed
         */

        if (line.startsWith("-")) {
          background = "#2d1517";

          color = "#ff7b72";
        }

        /**
         * hunk
         */

        if (line.startsWith("@")) {
          background = "#1f2937";

          color = "#79c0ff";
        }

        return (
          <div
            key={index}
            style={{
              background,

              color,

              padding: "2px 10px",

              whiteSpace: "pre-wrap",

              lineHeight: 1.6,
            }}
          >
            {line || " "}
          </div>
        );
      })}
    </div>
  );
}