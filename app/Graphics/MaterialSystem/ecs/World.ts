import { EntityManager } from './EntityManager';
import { ComponentStore } from './ComponentStore';
import { TransformComponent, MeshComponent } from './components';

export class World {
  entities = new EntityManager();

  transforms = new ComponentStore<TransformComponent>();
  meshes = new ComponentStore<MeshComponent>();
}