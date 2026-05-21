import { TextureSet } from './compareTextureSetsbeforeRegister';

export type ExtendedTextureSet = TextureSet & {
  preview?: File;
};

/**
 * base image detection (Leaking012C.png 같은 것)
 */
function isBaseImage(file: File): boolean {
  const n = file.name.toLowerCase();

  const hasTextureKeyword =
    /albedo|normal|rough|roughness|metal|metalness|ao|displacement|opacity|alpha|emissive|spec|gloss|sss|fuzz|arm|thumb|preview/.test(
      n
    );

  return !hasTextureKeyword;
}

/**
 * preview resolver (post-processing ONLY)
 */
export function resolvePreview(
  textures: ExtendedTextureSet
): File | null {
  const entries = Object.entries(textures) as [string, File][];

  if (entries.length === 0) return null;

  let explicitPreview: File | null = null;
  let baseImage: File | null = null;
  let albedo: File | null = null;

  for (const [key, file] of entries) {
    if (!file) continue;

    const name = file.name.toLowerCase();

    if (key === 'preview') {
      explicitPreview = file;
    }

    if (key === 'albedo') {
      albedo = file;
    }

    if (isBaseImage(file)) {
      baseImage = file;
    }
  }

  // 1. explicit preview (keyword)
  if (explicitPreview) return explicitPreview;

  // 2. material base image (Leaking012C.png)
  if (baseImage) return baseImage;

  // 3. albedo fallback
  if (albedo) return albedo;

  // 4. fallback first
  return entries[0][1];
}