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
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Michroma&display=swap");

        .githubButton {
          position: relative;

          margin-left: auto;

          transform: translateX(-180px);

          display: flex;
          align-items: center;
          gap: 12px;

          height: 34px;

          padding: 0 48px 0 18px;

          border: none;

          border-radius: 7px 0 0 7px;

          cursor: pointer;

          background: #974e4e;

          color: #fff;

          transition:
            transform 0.18s ease,
            filter 0.18s ease;

          white-space: nowrap;
        }

        .githubButton:hover {
          filter: brightness(1.08);

          transform:
            translateX(-180px)
            translateY(-1px);
        }

        .githubButton::after {
          content: "";

          position: absolute;

          top: 0;
          right: -34px;

          width: 38px;
          height: 100%;

          background: #974e4e;

          clip-path: polygon(
            0 0,
            100% 50%,
            0 100%,
            18% 50%
          );
        }

        .githubButton::before {
          content: "";

          position: absolute;

          top: 0;
          right: -17px;

          width: 26px;
          height: 100%;

          background: #974e4e;

          clip-path: polygon(
            0 0,
            100% 50%,
            0 100%,
            18% 50%
          );

          z-index: 2;
        }

        .goToText {
          position: relative;
          z-index: 3;

          font-family:
            "Cormorant Garamond",
            serif;

          font-style: italic;

          font-size: 17px;

          font-weight: 600;

          line-height: 1;
        }

        .commitText {
          position: relative;
          z-index: 3;

          font-family:
            "Michroma",
            "JetBrains Mono",
            monospace;

          font-size: 10px;

          font-weight: 400;

          letter-spacing: 0.12em;

          text-transform: uppercase;

          line-height: 1;
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
          <span className="goToText">
            Go To
          </span>

          <span className="commitText">
            Corresponding GitHub Commit
          </span>
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