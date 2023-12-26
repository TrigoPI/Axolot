import AxolotECS from "../ecs/AxolotECS";
import Collision from "./Collision";
import { ComponentClassObject, Entity } from "../ecs/Ecs-type";
import { AXOLOT_ASSERT } from "../utils/Assert";

export default class GameObject {
    private static tag: number = 1;
    
    private entity: Entity;
    private ecs: AxolotECS;

    public OnCollision(collsion: Collision): void {}
    public OnCreate(): void {};
    public OnUpdate(dt: number): void {};

    public HasComponent<T>(a: ComponentClassObject<T>): boolean {
        return this.ecs.HasComponent(this.entity, (<any>a).s_ComponentClass);
    }
    
    public GetComponent<T>(a: ComponentClassObject<T>): T {
        AXOLOT_ASSERT(!this.HasComponent(a), `Entity doesn't have component ${a.name}`);
        
        const component: T = new a();
        (<any>component).componentClass = (<any>a).s_ComponentClass;
        (<any>component).ecs = this.ecs;
        (<any>component).entity = this.entity;
        
        return component;
    };
}