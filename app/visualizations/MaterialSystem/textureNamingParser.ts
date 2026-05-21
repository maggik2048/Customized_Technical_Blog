import { TextureSet } from './compareTextureSetsbeforeRegister';

export type TextureKey = keyof TextureSet;

type TextureRule = {
  key: TextureKey;
  patterns: RegExp[];
};

const textureRules: TextureRule[] = [
  { key: 'albedo', patterns: [/albedo/i, /base[_\s-]?color/i, /diffuse/i, /color(?!.*mask)/i] },
  { key: 'normal', patterns: [/normal/i, /nrm/i, /nor/i] },
  { key: 'roughness', patterns: [/roughness/i, /rough/i] },
  { key: 'metallic', patterns: [/metallic/i, /metalness/i, /\bmetal\b/i] },
  { key: 'ao', patterns: [/ambientocclusion/i, /\bao\b/, /occlusion/i] },
  { key: 'displacement', patterns: [/displacement/i, /height/i, /disp/i] },
  { key: 'opacity', patterns: [/opacity/i, /\balpha\b/, /transparency/i, /mask/i] },
  { key: 'emissive', patterns: [/emissive/i, /emission/i, /emit/i, /glow/i] },
  { key: 'specular', patterns: [/specular/i, /spec/i] },
  { key: 'glossiness', patterns: [/glossiness/i, /gloss/i] },
  { key: 'sss', patterns: [/sss/i, /subsurface/i, /subsurf/i] },
  { key: 'fuzz', patterns: [/fuzz/i] },
  { key: 'arm', patterns: [/\barm\b/i, /ao.*rough.*metal/i, /packed/i] },
];

/**
 * STEP 1: PURE CLASSIFICATION ONLY
 */
export function parseTextureFileName(file: File): {
  key: TextureKey | null;
} {
  const name = file.name.toLowerCase();

  for (const rule of textureRules) {
    if (rule.patterns.some((p) => p.test(name))) {
      return { key: rule.key };
    }
  }

  return { key: null };
}