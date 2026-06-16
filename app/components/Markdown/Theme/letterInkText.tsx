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
  // New: Shadow options for ink smearing effect
  shadowIntensity: 0.35,
  shadowBlur: 3,
  shadowOffset: 1,
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
    return ((t ^ t >>> 14) >>> 0) * 2.3283064365386963e-10;
  };
}

// Cache for random generators with WeakMap for automatic cleanup
const randomCache = new Map<number, () => number>();
const MAX_CACHE_SIZE = 10000;

function getRandomGenerator(seed: number, index: number) {
  const key = seed + index * 13;
  let generator = randomCache.get(key);
  if (!generator) {
    if (randomCache.size > MAX_CACHE_SIZE) {
      const firstKey = randomCache.keys().next().value;
      if (firstKey !== undefined) {
        randomCache.delete(firstKey);
      }
    }
    generator = mulberry32(key);
    randomCache.set(key, generator);
  }
  return generator;
}

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

// Shadow styles from RemarkPageRenderer - applied to each character
const getInkShadow = (intensity: number = 0.35, blur: number = 3, offset: number = 1) => {
  const alpha = intensity;
  const alphaLight = intensity * 0.7;
  return `
    0 ${offset}px 0 rgba(255,255,255,0.55),
    0 ${offset}px ${blur}px rgba(0,0,0,${alpha}),
    0 ${offset}px ${blur * 0.67}px rgba(0,0,0,${alphaLight})
  `;
};

export function renderInkText(
  text: React.ReactNode,
  seed: number,
  options?: InkOptions
) {
  const opts = options ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;
  
  const textStr = String(text);
  const length = textStr.length;
  
  const result = new Array(length);
  
  const offsets = {
    opacity: 0,
    shiftY: 7,
    shiftX: 5,
    rotation: 17,
    scale: 23,
    kerning: 31,
    bleed: 29,
  };
  
  const { 
    maxShiftY, maxShiftX, maxRotation, 
    minScale, maxScale, opacityMin, opacityMax,
    bleedChance, kerningVariance, color, maxBlur,
    shadowIntensity, shadowBlur, shadowOffset
  } = opts;
  
  const halfShiftY = maxShiftY * 0.5;
  const halfShiftX = maxShiftX * 0.5;
  const halfRotation = maxRotation * 0.5;
  const halfKerning = kerningVariance * 0.5;
  const bleedThreshold = 1 - bleedChance;
  
  // Pre-compute shadow for this render
  const textShadow = getInkShadow(shadowIntensity, shadowBlur, shadowOffset);
  
  for (let i = 0; i < length; i++) {
    const char = textStr[i];
    
    const rGen = getRandomGenerator(seed, i);
    
    const shiftY = (getRandomGenerator(seed, i * offsets.shiftY)() - 0.5) * maxShiftY;
    const shiftX = (getRandomGenerator(seed, i * offsets.shiftX)() - 0.5) * maxShiftX;
    const rotation = (getRandomGenerator(seed, i * offsets.rotation)() - 0.5) * maxRotation;
    const scale = minScale + getRandomGenerator(seed, i * offsets.scale)() * SCALE_RANGE;
    
    const bleedStrength = getRandomGenerator(seed, i * offsets.bleed)();
    const strongBleed = bleedStrength > bleedThreshold;
    
    const opacity = opacityMin + getRandomGenerator(seed, i * offsets.opacity)() * OPACITY_RANGE;
    
    const blurAmount = strongBleed 
      ? BLUR_STRONG_OFFSET + getRandomGenerator(seed, i)() * maxBlur
      : getRandomGenerator(seed, i * 41)() * BLUR_NORMAL_MAX;
    
    const transform = `translate(${shiftX}px,${shiftY}px) rotate(${rotation}deg) scale(${scale})`;
    
    // Enhanced shadow with ink smearing effect - applied to each character
    const charShadow = strongBleed
      ? `${textShadow}, 0 0 0.6px ${color},0 0 1.4px ${color}`
      : textShadow;
    
    const kerningShift = (getRandomGenerator(seed, i * offsets.kerning)() - 0.5) * kerningVariance;
    
    result[i] = React.createElement('span', {
      key: i,
      style: {
        ...baseStyle,
        opacity,
        marginRight: `${kerningShift}em`,
        transform,
        textShadow: charShadow, // Applied shadow here!
        filter: `blur(${blurAmount}px)`,
        // Add color to ensure it inherits correctly
        color: opts.color,
      },
      children: char === " " ? "\u00A0" : char
    });
  }
  
  return result;
}

export function clearRandomCache(keepSize: number = 1000) {
  if (randomCache.size > keepSize) {
    const entries = Array.from(randomCache.keys());
    for (let i = 0; i < entries.length - keepSize; i++) {
      randomCache.delete(entries[i]);
    }
  }
}

const NBSP_CHAR = "\u00A0";