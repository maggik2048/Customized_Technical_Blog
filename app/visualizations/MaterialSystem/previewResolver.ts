import { TextureSet } from './compareTextureSetsbeforeRegister';

type ExtendedTextureSet = TextureSet & {
  preview?: File;
};

/**
 * STEP 2: preview 결정 로직 (classification 이후 실행)
 */
export function resolvePreview(
  textures: ExtendedTextureSet
): File | null {
  // 1. explicit preview
  if (textures.preview) return textures.preview;

  // 2. albedo fallback (industry standard)
  if (textures.albedo) return textures.albedo;

  // 3. first available texture
  const keys = Object.keys(textures).filter((k) => k !== 'preview');

  if (keys.length === 0) return null;

  return textures[keys[0]];
}