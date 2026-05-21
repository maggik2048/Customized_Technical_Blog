import { World } from '../ecs/World';

export class RenderSystem {
  constructor(private world: World) {}

  update() {
    for (const [entity, meshComp] of this.world.meshes.entries()) {
      const transform = this.world.transforms.get(entity);

      if (!transform) continue;

      meshComp.mesh.position.copy(transform.position);
      meshComp.mesh.rotation.copy(transform.rotation);
      meshComp.mesh.scale.copy(transform.scale);
    }
  }
}