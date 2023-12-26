import { ComponentClassObject, Entity } from "../ecs/Ecs-type";
import AxolotECS from "../ecs/AxolotECS";

export default class AxolotEntity {
    private ecs: AxolotECS;
    private id: Entity;

    public constructor(id: Entity, ecs: AxolotECS) {
        this.id = id;
        this.ecs = ecs;
    }

    public AddComponent<T>(a: ComponentClassObject<T>, ...args: any[]): void {
        this.ecs.AddComponent(this.id, (<any>a).s_ComponentClass, ...args); 
    }

    public RemoveComponent<T>(a: ComponentClassObject<T>): void {
        this.ecs.RemoveComponent<T>(this.id, a);
    }

    public HasComponent<T>(a: ComponentClassObject<T>): boolean {
        return this.ecs.HasComponent(this.id, a);
    }
}
