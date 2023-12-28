import { ComponentClassObject } from "../ecs/Ecs-type";
import { ComponentName, Tag } from "../scene/Components";
import { AXOLOT_ASSERT } from "../utils/Assert";
import Asset from "./Asset";

export type ComponentDesc = { name: ComponentName, args: any[] }

export class Prefab extends Asset {
    private components: ComponentDesc[];
    private names: ComponentName[];

    public constructor(name: string) {
        super(name);
        this.components = [];
        this.names = [];

        this.AddComponent(Tag)
    }

    AddComponent<T>(componentClass: ComponentClassObject<T>, ...args: any[]): void {
        const name: ComponentName = (<any>componentClass).s_ComponentClass.GetName();
        AXOLOT_ASSERT(this.names.indexOf(name) >= 0, `Prefab ${this.name} already have component ${name}`);
        this.components.push({ name, args });
    }
}