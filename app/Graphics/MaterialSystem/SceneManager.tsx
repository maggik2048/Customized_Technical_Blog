import * as THREE from 'three';

export type SceneContent = {
  mesh?: THREE.Mesh;
  dispose?: () => void;
};

/**
 * Adds scene objects (geometry / models) into an existing THREE.Scene
 * Returns a cleanup function to remove them later.
 */
export function addSceneContent(scene: THREE.Scene): SceneContent {
  //
  // Sphere (moved from renderer)
  //
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0,
    })
  );

  scene.add(sphere);

  return {
    mesh: sphere,

    dispose: () => {
      scene.remove(sphere);

      sphere.geometry.dispose();

      const mat = sphere.material as THREE.Material;
      mat.dispose();
    },
  };
}