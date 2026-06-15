"use client";

import React from "react";

type Props = {
  commitUrl?: string;
};

export default function GotoGitHubCorresponding({
  commitUrl,
}: Props) {
  return (
    <>
      <style jsx>{`
        .githubButton {
          position: relative;

          margin-left: auto;

          transform: translateX(-180px);

          padding: 10px 42px 10px 18px;

          border: none;

          border-radius: 8px 0 0 8px;

          cursor: pointer;

          font-weight: 700;

          font-size: 14px;

          letter-spacing: 0.02em;

          font-family:
            "JetBrains Mono",
            "IBM Plex Mono",
            "Cascadia Code",
            monospace;

          background: #974e4e;

          color: #fff;

          transition: all 0.2s ease;
        }

        .githubButton:hover {
          filter: brightness(1.08);
        }

        /* 큰 화살촉 */
        .githubButton::after {
          content: "";

          position: absolute;

          top: 0;
          right: -28px;

          width: 34px;
          height: 100%;

          background: #974e4e;

          clip-path: polygon(
            0 0,
            100% 50%,
            0 100%,
            20% 50%
          );
        }

        /* 작은 화살촉 */
        .githubButton::before {
          content: "";

          position: absolute;

          top: 0;
          right: -12px;

          width: 24px;
          height: 100%;

          background: #974e4e;

          clip-path: polygon(
            0 0,
            100% 50%,
            0 100%,
            20% 50%
          );

          z-index: 2;
        }
      `}</style>

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
          className="githubButton"
          onClick={() => {
            if (commitUrl) {
              window.open(
                commitUrl,
                "_blank"
              );
            }
          }}
          style={{
            cursor: commitUrl
              ? "pointer"
              : "default",
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
    </>
  );
}