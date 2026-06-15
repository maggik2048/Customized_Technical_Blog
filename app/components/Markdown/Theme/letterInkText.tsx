"use client";

import React from "react";

// Pre-compute constants
const CHAR_CODES = {
  SPACE: 32,
  NBSP: 160,
} as const;

const DEFAULT_OPTIONS = {
  color: "rgba(40,20,10,0.9)",
  maxBlur: 0.182,
  maxShiftX: 0.45,
  maxShiftY: 1.97,
  maxRotation: 4.8,
  minScale: 0.985,
  maxScale: 1.0525,
  opacityMin: 0.62,
  opacityMax: 0.9,
  bleedChance: 0.24,
  kerningVariance: 0.0006,
} as const;

// Faster seeded random using mulberry32 algorithm
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Cache for random generators
const randomCache = new Map<number, () => number>();

function getRandomGenerator(seed: number, index: number) {
  const key = seed + index * 13;
  let generator = randomCache.get(key);
  if (!generator) {
    generator = mulberry32(key);
    randomCache.set(key, generator);
  }
  return generator;
}

// Optimized value clamping
const clamp = (value: number, min: number, max: number) => 
  Math.min(max, Math.max(min, value));

type InkOptions = Partial<typeof DEFAULT_OPTIONS>;

export function renderInkText(
  text: React.ReactNode,
  seed: number,
  options?: InkOptions
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const textStr = String(text);
  const length = textStr.length;
  
  // Pre-allocate array for better performance
  const result = new Array(length);
  
  // Pre-calculate offsets for better readability
  const offsets = {
    opacity: 0,
    shiftY: 7,
    shiftX: 5,
    rotation: 17,
    scale: 23,
    kerning: 31,
    bleed: 29,
  };
  
  for (let i = 0; i < length; i++) {
    const char = textStr[i];
    
    // Get random values using cached generators
    const rGen = getRandomGenerator(seed, i);
    const r = rGen();
    
    const shiftYGen = getRandomGenerator(seed, i * offsets.shiftY);
    const shiftXGen = getRandomGenerator(seed, i * offsets.shiftX);
    const rotationGen = getRandomGenerator(seed, i * offsets.rotation);
    const scaleGen = getRandomGenerator(seed, i * offsets.scale);
    const kerningGen = getRandomGenerator(seed, i * offsets.kerning);
    const bleedGen = getRandomGenerator(seed, i * offsets.bleed);
    
    // Calculate values
    const opacity = opts.opacityMin + r * (opts.opacityMax - opts.opacityMin);
    
    const shiftY = (shiftYGen() - 0.5) * opts.maxShiftY;
    const shiftX = (shiftXGen() - 0.5) * opts.maxShiftX;
    const rotation = (rotationGen() - 0.5) * opts.maxRotation;
    const scale = opts.minScale + scaleGen() * (opts.maxScale - opts.minScale);
    const kerningShift = (kerningGen() - 0.5) * opts.kerningVariance;
    
    const bleedStrength = bleedGen();
    const strongBleed = bleedStrength > 1 - opts.bleedChance;
    
    // Optimize blur calculation
    const blurAmount = strongBleed
      ? 0.08 + r * opts.maxBlur
      : r * 0.04;
    
    // Use template literal for better performance
    const transform = `translate(${shiftX}px,${shiftY}px) rotate(${rotation}deg) scale(${scale})`;
    
    // Cache shadow strings
    const textShadow = strongBleed
      ? `0 0 0.6px ${opts.color},0 0 1.4px ${opts.color},0 0 2.8px rgba(0,0,0,0.10)`
      : `0 0 0.3px rgba(0,0,0,0.08)`;
    
    result[i] = (
      <span
        key={i}
        style={{
          position: "relative",
          display: "inline-block",
          opacity,
          marginRight: `${kerningShift}em`,
          transform,
          transformOrigin: "center bottom",
          textShadow,
          filter: `blur(${blurAmount}px)`,
          willChange: "transform,filter,opacity",
          backfaceVisibility: "hidden",
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    );
  }
  
  return result;
}

// Optional: Add cleanup function for cache
export function clearRandomCache() {
  randomCache.clear();
}