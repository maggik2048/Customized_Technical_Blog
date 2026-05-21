import { TextureSet } from './compareTextureSetsbeforeRegister';

export function parseTextureFileName(file: File): {
  key: keyof TextureSet | null;
} {
  const name = file.name.toLowerCase();

  if (
    name.includes('albedo') ||
    name.includes('basecolor') ||
    name.includes('base_color') ||
    name.includes('diffuse') ||
    name.includes('color')
  ) {
    return { key: 'albedo' };
  }

  if (
    name.includes('normal') ||
    name.includes('nor') ||
    name.includes('normalgl')
  ) {
    return { key: 'normal' };
  }

  if (
    name.includes('roughness') ||
    name.includes('rough')
  ) {
    return { key: 'roughness' };
  }

  if (
    name.includes('ambientocclusion') ||
    name.includes('ao')
  ) {
    return { key: 'ao' };
  }

  if (
    name.includes('displacement') ||
    name.includes('height') ||
    name.includes('disp')
  ) {
    return { key: 'displacement' };
  }

  if (
    name.includes('metallic') ||
    name.includes('metalness') ||
    name.includes('metal')
  ) {
    return { key: 'metallic' };
  }

  return { key: null };
}