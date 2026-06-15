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

// Pre-computed ranges
const OPACITY_RANGE = DEFAULT_OPTIONS.opacityMax - DEFAULT_OPTIONS.opacityMin;
const SCALE_RANGE = DEFAULT_OPTIONS.maxScale - DEFAULT_OPTIONS.minScale;
const BLUR_NORMAL_MAX = 0.04;
const BLUR_STRONG_OFFSET = 0.08;

// Faster seeded random using mulberry32 with pre-computed multipliers
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) * 2.3283064365386963e-10; // Pre-computed division
  };
}

// Cache for random generators with WeakMap for automatic cleanup
const randomCache = new Map<number, () => number>();
const MAX_CACHE_SIZE = 10000;

function getRandomGenerator(seed: number, index: number) {
  const key = seed + index * 13;
  let generator = randomCache.get(key);
  if (!generator) {
    // Prevent memory leaks
    if (randomCache.size > MAX_CACHE_SIZE) {
      const firstKey = randomCache.keys().next().value;
      randomCache.delete(firstKey);
    }
    generator = mulberry32(key);
    randomCache.set(key, generator);
  }
  return generator;
}

// Optimized value clamping
const clamp = (value: number, min: number, max: number) => 
  (value > max ? max : (value < min ? min : value));

type InkOptions = Partial<typeof DEFAULT_OPTIONS>;

// Pre-allocate reusable style objects
const baseStyle = {
  position: "relative",
  display: "inline-block",
  transformOrigin: "center bottom",
  willChange: "transform,filter,opacity",
  backfaceVisibility: "hidden",
} as const;

export function renderInkText(
  text: React.ReactNode,
  seed: number,
  options?: InkOptions
) {
  const opts = options ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;
  
  const textStr = String(text);
  const length = textStr.length;
  
  // Pre-allocate array with exact size
  const result = new Array(length);
  
  // Pre-calculate offsets as local variables for faster access
  const offsets = {
    opacity: 0,
    shiftY: 7,
    shiftX: 5,
    rotation: 17,
    scale: 23,
    kerning: 31,
    bleed: 29,
  };
  
  // Local aliases for faster access
  const { 
    maxShiftY, maxShiftX, maxRotation, 
    minScale, maxScale, opacityMin, opacityMax,
    bleedChance, kerningVariance, color, maxBlur
  } = opts;
  
  const halfShiftY = maxShiftY * 0.5;
  const halfShiftX = maxShiftX * 0.5;
  const halfRotation = maxRotation * 0.5;
  const halfKerning = kerningVariance * 0.5;
  const bleedThreshold = 1 - bleedChance;
  
  for (let i = 0; i < length; i++) {
    const char = textStr[i];
    
    // Single random generator for all values (better cache locality)
    const rGen = getRandomGenerator(seed, i);
    
    const shiftY = (getRandomGenerator(seed, i * offsets.shiftY)() - 0.5) * maxShiftY;
    const shiftX = (getRandomGenerator(seed, i * offsets.shiftX)() - 0.5) * maxShiftX;
    const rotation = (getRandomGenerator(seed, i * offsets.rotation)() - 0.5) * maxRotation;
    const scale = minScale + getRandomGenerator(seed, i * offsets.scale)() * SCALE_RANGE;
    
    // Optimize common operations
    const bleedStrength = getRandomGenerator(seed, i * offsets.bleed)();
    const strongBleed = bleedStrength > bleedThreshold;
    
    // Pre-calculate opacity using multiplication instead of addition
    const opacity = opacityMin + getRandomGenerator(seed, i * offsets.opacity)() * OPACITY_RANGE;
    
    // Optimize blur calculation with ternary
    const blurAmount = strongBleed 
      ? BLUR_STRONG_OFFSET + getRandomGenerator(seed, i)() * maxBlur
      : getRandomGenerator(seed, i * 41)() * BLUR_NORMAL_MAX;
    
    // Build transform string more efficiently
    const transform = `translate(${shiftX}px,${shiftY}px) rotate(${rotation}deg) scale(${scale})`;
    
    // Optimize text shadow strings
    const textShadow = strongBleed
      ? `0 0 0.6px ${color},0 0 1.4px ${color},0 0 2.8px rgba(0,0,0,0.10)`
      : `0 0 0.3px rgba(0,0,0,0.08)`;
    
    const kerningShift = (getRandomGenerator(seed, i * offsets.kerning)() - 0.5) * kerningVariance;
    
    // Create style object with spread for better JIT optimization
    result[i] = React.createElement('span', {
      key: i,
      style: {
        ...baseStyle,
        opacity,
        marginRight: `${kerningShift}em`,
        transform,
        textShadow,
        filter: `blur(${blurAmount}px)`,
      },
      children: char === " " ? "\u00A0" : char
    });
  }
  
  return result;
}

// Optimized cleanup with size limit
export function clearRandomCache(keepSize: number = 1000) {
  if (randomCache.size > keepSize) {
    const entries = Array.from(randomCache.keys());
    for (let i = 0; i < entries.length - keepSize; i++) {
      randomCache.delete(entries[i]);
    }
  }
}

// Optional: Pre-allocate common strings
const NBSP_CHAR = "\u00A0";