export class ComponentStore<T> {
  private store = new Map<number, T>();

  add(entity: number, component: T) {
    this.store.set(entity, component);
  }

  get(entity: number): T | undefined {
    return this.store.get(entity);
  }

  remove(entity: number) {
    this.store.delete(entity);
  }

  has(entity: number) {
    return this.store.has(entity);
  }

  entries() {
    return this.store.entries();
  }
}