import { ComponentClassObject, ComponentClassObjectTuple, Entity } from "../ecs/Ecs-type";
import AxolotECS from "../ecs/AxolotECS";

export default class AxolotEntity {
    private ecs: AxolotECS;
    private id: Entity;

    public constructor(id: Entity, ecs: AxolotECS) {
        this.id = id;
        this.ecs = ecs;
    }
    
    public HasComponent<T>(a: ComponentClassObject<T>): boolean {
        return this.ecs.HasComponent(this.id, (<any>a).s_ComponentClass);
    }

    public HasComponents<T extends any[]>(...a: ComponentClassObjectTuple<T>): boolean {
        return this.ecs.HasComponents(this.id, ...a); 
    }

    public AddComponent<T>(a: ComponentClassObject<T>, ...args: any[]): void {
        this.ecs.AddComponent(this.id, (<any>a).s_ComponentClass, ...args); 
    }

}
