import { Entity } from './types';

export class EntityManager {
  private nextId = 1;
  private freeList: Entity[] = [];

  create(): Entity {
    return this.freeList.length > 0
      ? this.freeList.pop()!
      : this.nextId++;
  }

  destroy(entity: Entity) {
    this.freeList.push(entity);
  }
}