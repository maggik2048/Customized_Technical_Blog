import * as THREE from 'three';

export type TransformComponent = {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
};

export type MeshComponent = {
  mesh: THREE.Mesh;
};