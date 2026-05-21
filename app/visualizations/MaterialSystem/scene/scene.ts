import * as THREE from 'three';
import { World } from '../ecs/World';
import { TransformComponent, MeshComponent } from '../ecs/components';

export class Scene {
  constructor(
    public threeScene: THREE.Scene,
    public world: World
  ) {}

  addMeshEntity(mesh: THREE.Mesh) {
    const entity = this.world.entities.create();

    const transform: TransformComponent = {
      position: mesh.position,
      rotation: mesh.rotation,
      scale: mesh.scale,
    };

    const meshComp: MeshComponent = {
      mesh,
    };

    this.world.transforms.add(entity, transform);
    this.world.meshes.add(entity, meshComp);

    this.threeScene.add(mesh);

    return entity;
  }
}