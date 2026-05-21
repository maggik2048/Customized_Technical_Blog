import { TextureSet } from './compareTextureSetsbeforeRegister';

export type TextureKey = keyof TextureSet | 'preview';

type TextureRule = {
  key: TextureKey;
  patterns: RegExp[];
};

const textureRules: TextureRule[] = [
  { key: 'albedo', patterns: [/albedo/, /basecolor/, /base_color/, /diffuse/, /color(?!.*mask)/] },
  { key: 'normal', patterns: [/normal/, /nor/, /normalgl/, /nrm/] },
  { key: 'roughness', patterns: [/roughness/, /rough/] },
  { key: 'metallic', patterns: [/metallic/, /metalness/, /\bmetal\b/] },
  { key: 'ao', patterns: [/ambientocclusion/, /\bao\b/, /occlusion/] },
  { key: 'displacement', patterns: [/displacement/, /height/, /disp/] },
  { key: 'opacity', patterns: [/opacity/, /\balpha\b/, /transparency/, /mask/] },
  { key: 'emissive', patterns: [/emissive/, /emission/, /emit/, /glow/] },
  { key: 'specular', patterns: [/specular/, /spec/] },
  { key: 'glossiness', patterns: [/glossiness/, /gloss/] },
  { key: 'sss', patterns: [/sss/, /subsurface/, /subsurf/] },
  { key: 'fuzz', patterns: [/fuzz/] },
  { key: 'arm', patterns: [/\barm\b/, /ao.*rough.*metal/, /armap/, /packed/] },
];

/**
 * preview keyword detection
 */
function isExplicitPreview(file: File): boolean {
  const n = file.name.toLowerCase();
  return (
    n.includes('preview') ||
    n.includes('thumb') ||
    n.includes('thumbnail')
  );
}

/**
 * MAIN PARSER (ONLY classification, NO fallback logic)
 */
export function parseTextureFileName(file: File): {
  key: TextureKey | null;
  isPreview: boolean;
} {
  const name = file.name.toLowerCase();

  if (isExplicitPreview(file)) {
    return { key: 'preview', isPreview: true };
  }

  for (const rule of textureRules) {
    if (rule.patterns.some((p) => p.test(name))) {
      return { key: rule.key, isPreview: false };
    }
  }

  return { key: null, isPreview: false };
}