import ComponentRegistery from "./ComponentRegistery";
import { ComponentPool, IComponentPool } from "./ComponentPool";
import { ComponentClassObject, ComponentType, Entity } from "./Ecs-type";

export default class ComponentManager {
    private pools: IComponentPool[]

    public constructor() {
        this.pools = ComponentRegistery.GetPools();
    }

    public GetEntities<T>(component: ComponentClassObject<T>): Entity[] {
        const componentType: ComponentType = (<any>component).GetType();
        return this.pools[componentType].Entities();
    }

    public GetComponent<T>(entity: Entity, component: ComponentClassObject<T>): T {
        const componentType: ComponentType = (<any>component).GetType();
        const pool: ComponentPool<T> = this.GetPool<T>(componentType);
        const object: T = pool.GetComponent(entity);
        return object;
    }

    public AddComponent<T>(entity: Entity, component: ComponentClassObject<T>, ...args: any[]): T {
        const componentType: ComponentType = (<any>component).GetType();
        const pool: ComponentPool<T> = this.GetPool(componentType);
        const object: T = new component(...args);
        pool.Add(entity, object);
        return object;
    }

    public RemoveComponent<T>(entity: Entity, component: ComponentClassObject<T>): void {
        const componentType: ComponentType = (<any>component).GetType();
        const pool: ComponentPool<T> = this.GetPool(componentType);
        pool.Remove(entity);
    }

    public GetPoolSize(componentType: ComponentType): number {
        return this.GetPool(componentType).Size();
    }

    public RemoveEntity(entity: Entity): void {
        for (let i: number = 0; i < this.pools.length; i++) this.pools[i].Remove(entity);
    }

    private GetPool<T>(componentType: ComponentType): ComponentPool<T> {
        const pool: ComponentPool<T> = <ComponentPool<T>>this.pools[componentType];
        if (!pool) throw new Error(`Cannot find pool for component ${componentType}`);
        return pool;
    }
}
