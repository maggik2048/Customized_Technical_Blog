import * as THREE from 'three';

export default async function
LoadRegisteredMaterial(

  material:
    THREE.MeshStandardMaterial,

  materialId: string
) {

  //
  // FETCH DESCRIPTOR
  //

  const response =
    await fetch(

      `/materials/${materialId}/material.json`
    );

  const descriptor =
    await response.json();

  //
  // LOADER
  //

  const textureLoader =
    new THREE.TextureLoader();

  //
  // COMMON SETTINGS
  //

  const applyTextureSettings =
    (
      texture: THREE.Texture
    ) => {

      texture.wrapS =
        THREE.RepeatWrapping;

      texture.wrapT =
        THREE.RepeatWrapping;

      texture.repeat.set(2, 2);
    };

  //
  // ALBEDO
  //

  if (descriptor.albedo) {

    const texture =
      await textureLoader.loadAsync(
        descriptor.albedo
      );

    texture.colorSpace =
      THREE.SRGBColorSpace;

    applyTextureSettings(
      texture
    );

    material.map = texture;
  }

  //
  // NORMAL
  //

  if (descriptor.normal) {

    const texture =
      await textureLoader.loadAsync(
        descriptor.normal
      );

    applyTextureSettings(
      texture
    );

    material.normalMap =
      texture;

    material.normalScale =
      new THREE.Vector2(1, 1);
  }

  //
  // ROUGHNESS
  //

  if (
    descriptor.roughness
  ) {

    const texture =
      await textureLoader.loadAsync(
        descriptor.roughness
      );

    applyTextureSettings(
      texture
    );

    material.roughnessMap =
      texture;

    material.roughness = 1;
  }

  //
  // AO
  //

  if (descriptor.ao) {

    const texture =
      await textureLoader.loadAsync(
        descriptor.ao
      );

    applyTextureSettings(
      texture
    );

    material.aoMap =
      texture;

    material.aoMapIntensity = 1;
  }

  //
  // DISPLACEMENT
  //

  if (
    descriptor.displacement
  ) {

    const texture =
      await textureLoader.loadAsync(
        descriptor.displacement
      );

    applyTextureSettings(
      texture
    );

    material.displacementMap =
      texture;

    material.displacementScale =
      0.25;
  }

  //
  // METALLIC
  //

  if (
    descriptor.metallic
  ) {

    const texture =
      await textureLoader.loadAsync(
        descriptor.metallic
      );

    applyTextureSettings(
      texture
    );

    material.metalnessMap =
      texture;

    material.metalness = 1;
  }

  //
  // FINALIZE
  //

  material.needsUpdate =
    true;

  console.log(
    'REGISTERED MATERIAL LOADED',
    materialId
  );
}