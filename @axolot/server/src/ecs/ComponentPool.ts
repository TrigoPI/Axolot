import { ComponentId, Entity } from "./Ecs-type";

export interface IComponentPool {
    Has(entity: Entity): boolean;
    Size(): number;
    Entities(): Entity[];
    Remove(entity: Entity): void;
}

export class ComponentPool<T> implements IComponentPool {
    private components: T[];
    private entities: Entity[];
    private entityToIndex: Map<Entity, number>;
    private indexToEntity: Map<number, Entity>;

    public constructor() {
        this.components = [];
        this.entities = [];
        this.entityToIndex = new Map<Entity, number>();
        this.indexToEntity = new Map<number, Entity>();
    }

    public Has(entity: Entity): boolean {
        return this.entityToIndex.has(entity);
    }

    public Size(): number {
        return this.components.length;
    }

    public Entities(): Entity[] {
        return this.entities;
    }

    public GetComponent(entity: Entity): T {
        if (!this.entityToIndex.has(entity)) throw new Error(`Cannot find component for entity : ${entity}`);
        const entityIndex: number = this.entityToIndex.get(entity); 
        return this.components[entityIndex];
    }

    public Add(entity: Entity, component: T): void {
        if (this.entityToIndex.has(entity)) throw new Error(`Entity ${entity} already have a component ${component}`);
        const lastIndex: number = this.components.length;
        this.entities.push(entity);
        this.components.push(component);
        this.entityToIndex.set(entity, lastIndex);
        this.indexToEntity.set(lastIndex, entity);
    }

    public Remove(entity: Entity): void {
        if (!this.entityToIndex.has(entity)) return;
        
        const indexOfRemovedEntity: number = this.entityToIndex.get(entity); 
        const lastEntityIndex: number = this.components.length - 1;
        const lastEntity: Entity = this.indexToEntity.get(lastEntityIndex);
        
        this.components[indexOfRemovedEntity] = this.components[lastEntity];
        this.entities[indexOfRemovedEntity] = this.entities[lastEntity];

        this.entityToIndex.delete(entity);
        this.indexToEntity.delete(indexOfRemovedEntity);
        this.components.pop();
        this.entities.pop();
    }
}