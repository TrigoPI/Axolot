import AxolotECS from "../ecs/AxolotECS";
import { ComponentClassObject, Entity } from "../ecs/Ecs-type"

export default class AxolotComponent<T> {
    private ecs: AxolotECS
    private entity: Entity;
    private componentClass: ComponentClassObject<T>

    protected get component(): T {
        return this.ecs.GetComponent(this.entity, this.componentClass);
    }
}