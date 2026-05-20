import * as THREE from 'three';

import MaterialControlPanel from './MaterialControlPanel';

export default function MaterialMapper(
  material: THREE.MeshStandardMaterial
) {
  const textureLoader = new THREE.TextureLoader();

  const basePath = '/';

  material.metalness = 0;

  material.roughness = 1;

  const textures: {
    color?: THREE.Texture;
    normal?: THREE.Texture;
    roughness?: THREE.Texture;
    ao?: THREE.Texture;
    displacement?: THREE.Texture;
  } = {};

  const setupTexture = (
    texture: THREE.Texture
  ) => {
    texture.wrapS = THREE.RepeatWrapping;

    texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set(2, 2);
  };

  //
  // COLOR
  //
  textureLoader.load(
    `${basePath}Ground054_1K-JPG_Color.jpg`,
    (texture) => {
      texture.colorSpace =
        THREE.SRGBColorSpace;

      setupTexture(texture);

      textures.color = texture;

      material.map = texture;

      material.needsUpdate = true;

      console.log('COLOR LOADED');
    }
  );

  //
  // NORMAL
  //
  textureLoader.load(
    `${basePath}Ground054_1K-JPG_NormalGL.jpg`,
    (texture) => {
      setupTexture(texture);

      textures.normal = texture;

      material.normalMap = texture;

      material.normalScale =
        new THREE.Vector2(1, 1);

      material.needsUpdate = true;

      console.log('NORMAL LOADED');
    }
  );

  //
  // ROUGHNESS
  //
  textureLoader.load(
    `${basePath}Ground054_1K-JPG_Roughness.jpg`,
    (texture) => {
      setupTexture(texture);

      textures.roughness = texture;

      material.roughnessMap = texture;

      material.roughness = 1;

      material.needsUpdate = true;

      console.log('ROUGHNESS LOADED');
    }
  );

  //
  // AO
  //
  textureLoader.load(
    `${basePath}Ground054_1K-JPG_AmbientOcclusion.jpg`,
    (texture) => {
      setupTexture(texture);

      textures.ao = texture;

      material.aoMap = texture;

      material.aoMapIntensity = 1;

      material.needsUpdate = true;

      console.log('AO LOADED');
    }
  );

  //
  // DISPLACEMENT
  //
  textureLoader.load(
    `${basePath}Ground054_1K-JPG_Displacement.jpg`,
    (texture) => {
      setupTexture(texture);

      textures.displacement = texture;

      material.displacementMap = texture;

      material.displacementScale = 0.25;

      material.needsUpdate = true;

      console.log('DISPLACEMENT LOADED');
    }
  );

  //
  // CONTROL PANEL
  //
  new MaterialControlPanel(
    material,
    textures
  );

  console.log(
    'PBR Material Mapping Complete'
  );
}