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
          gap: 14px;

          height: 34px;

          padding: 0 12px 0 18px;

          border: none;

          border-radius: 8px 0 0 8px;

          cursor: pointer;

          background: #974e4e;

          color: #fff;

          white-space: nowrap;

          transition:
            transform 0.18s ease,
            filter 0.18s ease;
        }

        .githubButton:hover {
          filter: brightness(1.08);

          transform:
            translateX(-180px)
            translateY(-1px);
        }

        .goToText {
          font-family:
            "Cormorant Garamond",
            serif;

          font-style: italic;

          font-size: 17px;

          font-weight: 600;

          line-height: 1;
        }

        .commitText {
          font-family:
            "Michroma",
            "JetBrains Mono",
            monospace;

          font-size: 9px;

          font-weight: 400;

          text-transform: uppercase;

          letter-spacing: 0.14em;

          line-height: 1;
        }

        .arrowSvg {
          width: 96px;

          height: 34px;

          margin-right: -40px;

          flex-shrink: 0;

          overflow: visible;
        }

        .arrowWrap {
          display: flex;
          align-items: center;
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

          <span className="arrowWrap">
            <svg
              className="arrowSvg"
              viewBox="0 0 120 40"
              aria-hidden="true"
            >
              {/* 위쪽 날개 */}
              <polygon
                points="
                  40,2
                  62,2
                  82,18
                  64,13
                "
                fill="#ffffff"
                opacity="0.92"
              />

              {/* 아래쪽 날개 */}
              <polygon
                points="
                  40,38
                  62,38
                  82,22
                  64,27
                "
                fill="#ffffff"
                opacity="0.92"
              />

              {/* 작은 화살촉 */}
              <polygon
                points="
                  54,4
                  74,20
                  54,36
                  66,20
                "
                fill="#ffffff"
              />

              {/* 큰 화살촉 */}
              <polygon
                points="
                  72,0
                  120,20
                  72,40
                  88,20
                "
                fill="#ffffff"
              />
            </svg>
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