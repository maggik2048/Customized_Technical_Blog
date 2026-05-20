export type TextureSet = {
  albedo?: File;
  normal?: File;
  roughness?: File;
  ao?: File;
  displacement?: File;
  metallic?: File;
};

const isSameFile = (a?: File, b?: File) => {
  if (!a || !b) return false;

  return (
    a.name === b.name &&
    a.size === b.size &&
    a.lastModified === b.lastModified
  );
};

export const compareTextureSets = (
  oldSet: TextureSet,
  newSet: TextureSet
) => {
  const keys: (keyof TextureSet)[] = [
    'albedo',
    'normal',
    'roughness',
    'ao',
    'displacement',
    'metallic',
  ];

  let changedCount = 0;

  keys.forEach((key) => {
    const oldFile = oldSet[key];
    const newFile = newSet[key];

    // 둘 다 없음
    if (!oldFile && !newFile) return;

    // 하나만 있음
    if ((!oldFile && newFile) || (oldFile && !newFile)) {
      changedCount++;
      return;
    }

    // 둘 다 있지만 다름
    if (!isSameFile(oldFile, newFile)) {
      changedCount++;
    }
  });

  return changedCount;
};