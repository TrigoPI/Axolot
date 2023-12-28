import { TypedFastBitSet } from "typedfastbitset";

import { ComponentClassObject, ComponentClassObjectTuple, ComponentType, Entity } from "./Ecs-type";
import EntityManager from "./EntityManager";
import ComponentManager from "./ComponentManager";

export default class AxolotECS {
    private entityManager: EntityManager;
    private componentManager: ComponentManager;
    
    public constructor() {
        this.entityManager = new EntityManager();
        this.componentManager = new ComponentManager();
    }

    public CreateEntity(): Entity {
        return this.entityManager.CreateEntity();
    }

    public GetEntities<T extends any[]>(...args: ComponentClassObjectTuple<T> ): Entity[] {
        const entities: Entity[] = [];

        let entitiesFromPool: Entity[] = [];
        let smallerSize: number = 999999;
        let querySignature: TypedFastBitSet = new TypedFastBitSet();

        for (let i: number = 0; i < args.length; i++) {
            const component: ComponentClassObject<any> = args[i];
            const type: ComponentType = this.GetComponentType<T>(component);
            const size: number = this.componentManager.GetPoolSize(type);

            querySignature.add(type);

            if (smallerSize > size) {
                smallerSize = size;
                entitiesFromPool = this.componentManager.GetEntities(component);
            }
        }

        for (let i: number = 0; i < entitiesFromPool.length; i++) {
            const entity: Entity = entitiesFromPool[i];
            const signature = this.entityManager.GetSignature(entity);
            const intersection: TypedFastBitSet = querySignature.new_intersection(signature);
            if (intersection.equals(querySignature)) entities.push(entity);
        }

        return entities;
    }


    public AddComponent<T>(entity: Entity, component: ComponentClassObject<T>, ...args: any[]): T {
        const componentType: ComponentType = this.GetComponentType<T>(component);
        const object: T = this.componentManager.AddComponent<T>(entity, component, ...args);
        const signature: TypedFastBitSet = this.entityManager.GetSignature(entity);
        signature.add(componentType);
        return object;
    }

    public GetComponents<T extends any[]>(entity: Entity, ...args: ComponentClassObjectTuple<T>): { [P in keyof T]: T[P] } {
        const components: any[] = [];
        
        for (let i: number = 0; i < args.length; i++) {
            const component: any = this.GetComponent(entity, args[i])
            components.push(component);
        }
        
        return <{ [P in keyof T]: T[P] }>components;
    }

    public GetComponent<T>(entity: Entity, component: ComponentClassObject<T>): T {
        return this.componentManager.GetComponent<T>(entity, component);
    }

    public HasComponents<T extends any[]>(entity: Entity, ...args: ComponentClassObjectTuple<T>): boolean {
        let valid: boolean = true;
        let i: number = 0;

        while (i < args.length && valid) {
            valid = this.HasComponent(entity, args[i]);
            i++
        }
        
        return valid;
    }

    public HasComponent<T>(entity: Entity, component: ComponentClassObject<T>): boolean {
        const componentType: ComponentType = this.GetComponentType<T>(component);
        const signature: TypedFastBitSet = this.entityManager.GetSignature(entity);
        return signature.has(componentType);
    }

    public RemoveComponent<T>(entity: Entity, component: ComponentClassObject<T>): void {
        const componentType: ComponentType = this.GetComponentType<T>(component);
        const signature: TypedFastBitSet = this.entityManager.GetSignature(entity);
        this.componentManager.RemoveComponent<T>(entity, component);
        signature.remove(componentType);
    }


    public RemoveEntity(entity: Entity): void {
        this.entityManager.RemoveEntity(entity);
        this.componentManager.RemoveEntity(entity);        
    }

    private GetComponentType<T>(Component: ComponentClassObject<T>): ComponentType {
        if (!(<any>Component).GetType) throw new Error(`${Component.name} is not a component`);
        return (<any>Component).GetType();
    }
}
