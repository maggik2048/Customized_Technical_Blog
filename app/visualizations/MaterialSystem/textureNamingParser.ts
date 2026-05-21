import { TextureSet } from './compareTextureSetsbeforeRegister';

/**
 * Rule-based texture parser
 * - 확장 가능한 keyword matching system
 * - supports PBR + advanced material workflows
 */

type TextureKey = keyof TextureSet;

type TextureRule = {
  key: TextureKey;
  patterns: RegExp[];
};

const textureRules: TextureRule[] = [
  // Base Color
  {
    key: 'albedo',
    patterns: [/albedo/, /basecolor/, /base_color/, /diffuse/, /color(?!.*mask)/],
  },

  // Normal
  {
    key: 'normal',
    patterns: [/normal/, /nor/, /normalgl/, /nrm/],
  },

  // Roughness
  {
    key: 'roughness',
    patterns: [/roughness/, /rough/],
  },

  // Metallic
  {
    key: 'metallic',
    patterns: [/metallic/, /metalness/, /\bmetal\b/],
  },

  // Ambient Occlusion
  {
    key: 'ao',
    patterns: [/ambientocclusion/, /\bao\b/, /occlusion/],
  },

  // Height / Displacement
  {
    key: 'displacement',
    patterns: [/displacement/, /height/, /disp/],
  },

  // Opacity / Alpha
  {
    key: 'opacity',
    patterns: [/opacity/, /\balpha\b/, /transparency/, /mask/],
  },

  // Emissive
  {
    key: 'emissive',
    patterns: [/emissive/, /emission/, /emit/, /glow/],
  },

  // Specular (legacy / workflows)
  {
    key: 'specular',
    patterns: [/specular/, /spec/],
  },

  // Glossiness (inverse roughness workflow)
  {
    key: 'glossiness',
    patterns: [/glossiness/, /gloss/],
  },

  // Subsurface Scattering
  {
    key: 'sss',
    patterns: [/sss/, /subsurface/, /subsurf/],
  },

  // Fuzz (fabric / cloth shading)
  {
    key: 'fuzz',
    patterns: [/fuzz/],
  },

  // ARM packed maps (AoRoughMetal)
  {
    key: 'arm',
    patterns: [/\barm\b/, /ao.*rough.*metal/, /armap/, /packed/],
  },
];

/**
 * Main parser
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