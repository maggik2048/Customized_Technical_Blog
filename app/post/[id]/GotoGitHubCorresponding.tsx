"use client";

import React from "react";
import Image from "next/image";

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

          height: 26px;

          padding: 0 12px 0 18px;

          border: none;

          border-radius: 8px 0 0 8px;

          cursor: pointer;

          background: #3a3a3a;

          color: #fff;

          white-space: nowrap;

          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.16);

          transition:
            transform 0.18s ease,
            filter 0.18s ease,
            box-shadow 0.18s ease;
        }

        .githubButton:hover {
          filter: brightness(1.08);

          transform:
            translateX(-180px)
            translateY(-1px);

          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.2);
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

        .iconGroup {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-right: 4px;
        }

        .gitIcon, .githubIcon {
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .arrowSvg {
          width: 96px;

          height: 34px;

          margin-right: -40px;

          flex-shrink: 0;

          overflow: visible;

          filter:
            drop-shadow(
              0 2px 8px rgba(0, 0, 0, 0.16)
            );
        }

        .arrowWrap {
          display: flex;
          align-items: center;
        }

        .container {
          margin-top: 20px;
          margin-bottom: 24px;

          display: flex;
          flex-direction: column;
          gap: 12px;

          padding: 20px 18px;

          border-radius: 12px;

          background: rgba(255,140,0,0.08);

          border: 1px solid rgba(255,140,0,0.3);

          position: relative;
          min-height: 180px;
        }

        .topRow {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
        }

        .imageWrapper {
          position: absolute;
          bottom: 12px;
          right: 12px;
          width: 500px;
          max-width: 50%;
          height: auto;
          opacity: 0.6;
          pointer-events: none;
        }

        .imageWrapper img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 8px;
        }

        .commitLink {
          color: #3b82f6;
          text-decoration: underline;
          word-break: break-all;
        }

        .noCommitText {
          color: #888;
        }
      `}</style>

      <div className="container">
        <div className="topRow">
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
            <div className="iconGroup">
              {/* Git Icon (orange) */}
              <svg
                className="gitIcon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.546 11.426L12.574 0.454C12.247 0.127 11.754 0 11.264 0C10.774 0 10.279 0.126 9.953 0.454L8.091 2.316L10.688 4.913C11.341 4.618 12.139 4.699 12.724 5.284C13.312 5.872 13.393 6.676 13.094 7.33L15.591 9.827C16.245 9.528 17.049 9.609 17.637 10.197C18.468 11.028 18.468 12.378 17.637 13.209C16.806 14.04 15.456 14.04 14.625 13.209C14.006 12.59 13.911 11.732 14.254 11.051L11.879 8.676V15.605C12.093 15.711 12.294 15.855 12.468 16.029C13.299 16.86 13.299 18.21 12.468 19.041C11.637 19.872 10.287 19.872 9.456 19.041C8.625 18.21 8.625 16.86 9.456 16.029C9.661 15.824 9.9 15.671 10.156 15.566V8.482C9.901 8.377 9.662 8.222 9.457 8.018C8.82 7.381 8.742 6.417 9.207 5.714L6.622 3.129L0.454 9.426C0.127 9.753 0 10.246 0 10.736C0 11.226 0.126 11.721 0.454 12.047L11.426 23.546C11.753 23.873 12.246 24 12.736 24C13.226 24 13.721 23.874 14.047 23.546L23.546 14.047C23.874 13.721 24 13.226 24 12.736C24 12.246 23.873 11.753 23.546 11.426Z"
                  fill="#F05032"
                />
              </svg>

              {/* GitHub Octocat Icon (orange) */}
              <svg
                className="githubIcon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"
                  fill="#F05032"
                />
              </svg>
            </div>

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
                  fill="#060608"
                />

                {/* 큰 화살촉 */}
                <polygon
                  points="
                    72,0
                    120,20
                    72,40
                    88,20
                  "
                  fill="#f0e9e9"
                />
              </svg>
            </span>
          </button>

          {commitUrl ? (
            <a
              href={commitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="commitLink"
            >
              {commitUrl}
            </a>
          ) : (
            <span className="noCommitText">
              No commit linked yet
            </span>
          )}
        </div>

        {/* Image attached to right-bottom */}
        <div className="imageWrapper">
          <img
            src="/images/githubsync/docGithubSyncimage.jpg"
            alt="GitHub Sync"
            width={500}
            height={300}
          />
        </div>
      </div>
    </>
  );
}