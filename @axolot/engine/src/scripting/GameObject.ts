import AxolotECS from "../ecs/AxolotECS";
import { ComponentClassObject, Entity } from "../ecs/Ecs-type";
import { AXOLOT_ASSERT } from "../utils/Assert";

export default class GameObject {    
    private entity: Entity;
    private ecs: AxolotECS;

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