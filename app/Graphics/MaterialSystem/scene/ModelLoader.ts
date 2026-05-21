import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Scene } from './Scene';

export class ModelLoader {
  private loader = new GLTFLoader();

  constructor(private scene: Scene) {}

  loadGLTF(url: string) {
    this.loader.load(url, (gltf) => {
      const model = gltf.scene;

      // treat whole model as one entity for now
      this.scene.addMeshEntity(model as unknown as THREE.Mesh);
    });
  }
}