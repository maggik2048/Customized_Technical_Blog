"use client";

import React from "react";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

type Props = {
  isDark?: boolean;
};

export default function GotoTheTop({
  isDark = false,
}: Props) {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 26,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 120,
        marginBottom: 48,
      }}
    >
      <motion.button
        whileHover={{
          scale: 1.025,
          y: -2,
        }}
        whileTap={{
          scale: 0.985,
        }}
        onClick={handleClick}
        style={{
          position: "relative",

          width: 178,
          height: 178,

          borderRadius: "50%",

          background: "transparent",

          border: isDark
            ? "1px solid rgba(255,255,255,0.11)"
            : "1px solid rgba(0,0,0,0.11)",

          cursor: "pointer",

          overflow: "hidden",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          boxShadow: isDark
            ? `
              inset 0 0 0 1px rgba(255,255,255,0.02),
              0 10px 40px rgba(0,0,0,0.32)
            `
            : `
              inset 0 0 0 1px rgba(255,255,255,0.45),
              0 10px 34px rgba(0,0,0,0.08)
            `,
        }}
      >
        {/* outer animated ring */}
        <motion.svg
          width="178"
          height="178"
          viewBox="0 0 178 178"
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <motion.circle
            cx="89"
            cy="89"
            r="76"
            fill="transparent"
            stroke={
              isDark
                ? "rgba(255,255,255,0.12)"
                : "rgba(0,0,0,0.12)"
            }
            strokeWidth="1"
          />

          <motion.path
            d="
              M 40 104
              A 49 49 0 0 1 138 104
            "
            fill="transparent"
            stroke={
              isDark
                ? "rgba(255,255,255,0.34)"
                : "rgba(0,0,0,0.28)"
            }
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="10 12"
            animate={{
              strokeDashoffset: [0, -40],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "linear",
            }}
          />
        </motion.svg>

        {/* center content */}
        <div
          style={{
            position: "relative",
            zIndex: 5,

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            gap: 14,
          }}
        >
          {/* arrow */}
          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.7,
              ease: "easeInOut",
            }}
            style={{
              position: "relative",
            }}
          >
            {/* glow */}
            <motion.div
              animate={{
                opacity: [0.25, 0.7, 0.25],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.7,
              }}
              style={{
                position: "absolute",
                inset: 0,
                filter: "blur(12px)",
              }}
            >
              <ArrowUp
                size={30}
                strokeWidth={1.8}
                color={
                  isDark
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(0,0,0,0.85)"
                }
              />
            </motion.div>

            <ArrowUp
              size={30}
              strokeWidth={1.8}
              color={
                isDark
                  ? "rgba(255,255,255,0.98)"
                  : "rgba(0,0,0,0.88)"
              }
            />
          </motion.div>

          {/* text */}
          <motion.div
            animate={{
              opacity: [0.82, 1, 0.82],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.6,
            }}
            style={{
              fontSize: 13,

              letterSpacing: "0.24em",

              textTransform: "uppercase",

              fontWeight: 600,

              color: isDark
                ? "rgba(255,255,255,0.92)"
                : "rgba(0,0,0,0.78)",

              textShadow: isDark
                ? "0 0 14px rgba(255,255,255,0.08)"
                : "0 0 10px rgba(0,0,0,0.04)",
            }}
          >
            GO TO THE TOP
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
}