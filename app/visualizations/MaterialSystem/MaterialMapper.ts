import * as THREE from 'three';

export default function MaterialMapper(
  material: THREE.MeshStandardMaterial
) {
  const textureLoader = new THREE.TextureLoader();

  //
  // Vite / React / Next
  // public 폴더 기준
  //
  // public/
  //   Ground054_1K-JPG_Color.jpg
  //   Ground054_1K-JPG_NormalGL.jpg
  //   ...
  //
  const basePath = '/';

  //
  // SAFETY DEFAULTS
  //
  material.metalness = 0;
  material.roughness = 1;

  //
  // 공통 텍스쳐 세팅
  //
  const setupTexture = (texture: THREE.Texture) => {
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
      texture.colorSpace = THREE.SRGBColorSpace;

      setupTexture(texture);

      material.map = texture;

      material.needsUpdate = true;

      console.log('COLOR LOADED');
    },
    undefined,
    (err) => {
      console.error('COLOR LOAD FAIL', err);
    }
  );

  //
  // NORMAL
  //
  textureLoader.load(
    `${basePath}Ground054_1K-JPG_NormalGL.jpg`,
    (texture) => {
      setupTexture(texture);

      material.normalMap = texture;
      material.normalScale = new THREE.Vector2(1, 1);

      material.needsUpdate = true;

      console.log('NORMAL LOADED');
    },
    undefined,
    (err) => {
      console.error('NORMAL LOAD FAIL', err);
    }
  );

  //
  // ROUGHNESS
  //
  textureLoader.load(
    `${basePath}Ground054_1K-JPG_Roughness.jpg`,
    (texture) => {
      setupTexture(texture);

      material.roughnessMap = texture;
      material.roughness = 1;

      material.needsUpdate = true;

      console.log('ROUGHNESS LOADED');
    },
    undefined,
    (err) => {
      console.error('ROUGHNESS LOAD FAIL', err);
    }
  );

  //
  // AO
  //
  textureLoader.load(
    `${basePath}Ground054_1K-JPG_AmbientOcclusion.jpg`,
    (texture) => {
      setupTexture(texture);

      material.aoMap = texture;
      material.aoMapIntensity = 1;

      material.needsUpdate = true;

      console.log('AO LOADED');
    },
    undefined,
    (err) => {
      console.error('AO LOAD FAIL', err);
    }
  );

  //
  // DISPLACEMENT
  //
  textureLoader.load(
    `${basePath}Ground054_1K-JPG_Displacement.jpg`,
    (texture) => {
      setupTexture(texture);

      material.displacementMap = texture;

      material.displacementScale = 0.25;

      material.needsUpdate = true;

      console.log('DISPLACEMENT LOADED');
    },
    undefined,
    (err) => {
      console.error('DISPLACEMENT LOAD FAIL', err);
    }
  );

  console.log('PBR Material Mapping Complete');
}