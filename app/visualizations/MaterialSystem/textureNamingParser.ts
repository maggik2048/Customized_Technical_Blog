import { TextureSet } from './compareTextureSetsbeforeRegister';

export type TextureKey = keyof TextureSet | 'preview';

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

  // AO
  {
    key: 'ao',
    patterns: [/ambientocclusion/, /\bao\b/, /occlusion/],
  },

  // Displacement
  {
    key: 'displacement',
    patterns: [/displacement/, /height/, /disp/],
  },

  // Opacity
  {
    key: 'opacity',
    patterns: [/opacity/, /\balpha\b/, /transparency/, /mask/],
  },

  // Emissive
  {
    key: 'emissive',
    patterns: [/emissive/, /emission/, /emit/, /glow/],
  },

  // Specular
  {
    key: 'specular',
    patterns: [/specular/, /spec/],
  },

  // Glossiness
  {
    key: 'glossiness',
    patterns: [/glossiness/, /gloss/],
  },

  // SSS
  {
    key: 'sss',
    patterns: [/sss/, /subsurface/, /subsurf/],
  },

  // Fuzz
  {
    key: 'fuzz',
    patterns: [/fuzz/],
  },

  // ARM packed
  {
    key: 'arm',
    patterns: [/\barm\b/, /ao.*rough.*metal/, /armap/, /packed/],
  },
];

/**
 * preview detection
 */
function isPreview(file: File): boolean {
  const n = file.name.toLowerCase();

  return (
    n.includes('preview') ||
    n.includes('previewimage') ||
    n.includes('thumbnail') ||
    n.includes('thumb')
  );
}

/**
 * MAIN PARSER
 */
export function parseTextureFileName(file: File): {
  key: TextureKey | null;
} {
  const name = file.name.toLowerCase();

  if (isPreview(file)) {
    return { key: 'preview' };
  }

  for (const rule of textureRules) {
    if (rule.patterns.some((p) => p.test(name))) {
      return { key: rule.key };
    }
  }

  return { key: null };
}