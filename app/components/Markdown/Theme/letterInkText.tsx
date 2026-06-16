// Enhanced renderInkText that handles mixed content properly
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

// Cache for random generators
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

type InkOptions = Partial<typeof DEFAULT_OPTIONS>;

// Pre-allocate reusable style objects
const baseStyle = {
  position: "relative",
  display: "inline-block",
  transformOrigin: "center bottom",
  willChange: "transform,filter,opacity",
  backfaceVisibility: "hidden",
} as const;

// Shadow function
const getInkShadow = (intensity: number = 0.35, blur: number = 3, offset: number = 1) => {
  const alpha = intensity;
  const alphaLight = intensity * 0.7;
  return `
    0 ${offset}px 0 rgba(255,255,255,0.55),
    0 ${offset}px ${blur}px rgba(0,0,0,${alpha}),
    0 ${offset}px ${blur * 0.67}px rgba(0,0,0,${alphaLight})
  `;
};

// 타입 가드 함수 - React 엘리먼트인지 확인하고 props 타입 좁히기
function isReactElementWithProps<T = any>(
  node: React.ReactNode
): node is React.ReactElement<T> {
  return React.isValidElement(node);
}

// Enhanced render function that preserves ink effect for mixed content
export function renderInkText(
  text: React.ReactNode,
  seed: number,
  options?: InkOptions,
  customRenderer?: (char: string, index: number, totalLength: number) => React.ReactNode
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
  
  const bleedThreshold = 1 - bleedChance;
  
  const textShadow = getInkShadow(shadowIntensity, shadowBlur, shadowOffset);
  
  for (let i = 0; i < length; i++) {
    const char = textStr[i];
    
    // If custom renderer is provided and returns something, use it
    if (customRenderer) {
      const customElement = customRenderer(char, i, length);
      
      // FIX: 타입 가드로 props 타입 좁히기
      if (isReactElementWithProps<{ style?: React.CSSProperties }>(customElement)) {
        // Wrap custom element with ink effect but preserve its styles
        const shiftY = (getRandomGenerator(seed, i * offsets.shiftY)() - 0.5) * maxShiftY;
        const shiftX = (getRandomGenerator(seed, i * offsets.shiftX)() - 0.5) * maxShiftX;
        const rotation = (getRandomGenerator(seed, i * offsets.rotation)() - 0.5) * maxRotation;
        const scale = minScale + getRandomGenerator(seed, i * offsets.scale)() * SCALE_RANGE;
        const opacity = opacityMin + getRandomGenerator(seed, i * offsets.opacity)() * OPACITY_RANGE;
        
        const transform = `translate(${shiftX}px,${shiftY}px) rotate(${rotation}deg) scale(${scale})`;
        
        // FIX: customElement.props.style에 안전하게 접근
        const existingStyle = customElement.props.style || {};
        
        result[i] = React.cloneElement(customElement, {
          key: i,
          style: {
            ...existingStyle,
            display: "inline-block",
            transform,
            opacity,
            textShadow: existingStyle.textShadow || textShadow,
            filter: `blur(${0.01}px)`,
          }
        });
        continue;
      }
    }
    
    // Default rendering for normal characters
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
        textShadow: charShadow,
        filter: `blur(${blurAmount}px)`,
        color: opts.color,
      },
      children: char === " " ? "\u00A0" : char
    });
  }
  
  return result;
}

// Special helper for mixed content with red text
export function renderMixedInkText(
  segments: Array<{ text: string; isRed?: boolean; color?: string }>,
  seed: number,
  options?: InkOptions
) {
  // Combine all text for proper seeding
  const fullText = segments.map(s => s.text).join('');
  const opts = options ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;
  
  const result = [];
  let globalIndex = 0;
  
  for (const segment of segments) {
    const segmentText = segment.text;
    const isRed = segment.isRed || false;
    const segmentColor = isRed ? "#6a1f1b" : (segment.color || opts.color);
    
    // Render segment with ink effect
    const segmentNodes = renderInkText(
      segmentText,
      seed + globalIndex, // Offset seed for each segment
      {
        ...opts,
        color: segmentColor,
      }
    );
    
    result.push(...segmentNodes);
    globalIndex += segmentText.length;
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