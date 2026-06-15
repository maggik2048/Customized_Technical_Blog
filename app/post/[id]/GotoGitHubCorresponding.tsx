"use client";

import React from "react";

type Props = {
  commitUrl?: string;
};

export default function GotoGitHubCorresponding({
  commitUrl,
}: Props) {
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 24,

        display: "flex",
        alignItems: "center",
        gap: 12,

        padding: "14px 18px",

        borderRadius: 12,

        background: "rgba(255,140,0,0.08)",

        border:
          "1px solid rgba(255,140,0,0.3)",
      }}
    >
      <button
        type="button"
        onClick={() => {
          if (commitUrl) {
            window.open(
              commitUrl,
              "_blank"
            );
          }
        }}
        style={{
          marginLeft: "auto",
          transform: "translateX(-180px)",

          padding: "10px 18px",

          border: "none",

          borderRadius: 8,

          cursor: commitUrl
            ? "pointer"
            : "default",

          fontWeight: 700,

          background: "#974e4e",

          color: "#fff",
        }}
      >
        Go To Corresponding
        GitHub Commit Page
      </button>

      {commitUrl ? (
        <a
          href={commitUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#3b82f6",
            textDecoration: "underline",

            wordBreak: "break-all",
          }}
        >
          {commitUrl}
        </a>
      ) : (
        <span
          style={{
            color: "#888",
          }}
        >
          No commit linked yet
        </span>
      )}
    </div>
  );
}