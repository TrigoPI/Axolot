import { AXOLOT_ASSERT } from "../utils/Assert";
import { Class } from "./Scripting-type";

import { Entity } from "../ecs/Ecs-type";
import AxolotECS from "../ecs/AxolotECS";

import GameObject from "./GameObject";
import { _Script, _Tag } from "../scene/Components";
import Collision from "./Collision";

export default class ScriptingEngine {
    private scriptInstance: Map<string, GameObject>;
    private ecs: AxolotECS;

    public constructor() {
        this.scriptInstance = new Map<string, GameObject>();
    }

    public SetECS(ecs: AxolotECS) {
        this.ecs = ecs;
    }

    public OnCreateScriptInstance(entity: Entity): void {        
        const [tag, script] = this.ecs.GetComponents(entity, _Tag, _Script);
        
        AXOLOT_ASSERT(this.scriptInstance.has(tag.uuid), `${tag.uuid} already have script ${script.className}`);
        AXOLOT_ASSERT(!this.IsGameObject(script.script), `Script ${script.className} is not a GameObject`);

        const instance: GameObject = new (<Class<GameObject>>script.script)();

        (<any>instance).entity = entity;
        (<any>instance).ecs = this.ecs;
        
        this.scriptInstance.set(tag.uuid, instance);
        instance.OnCreate();
    }

    public OnCollision(entity1: Entity, entity2: Entity): void {
        if (this.ecs.HasComponent(entity1, _Script) &&
            this.ecs.HasComponent(entity2, _Tag)
        ) {
            const tagEntity1: _Tag = this.ecs.GetComponent(entity1, _Tag);
            const tagEntity2: _Tag = this.ecs.GetComponent(entity2, _Tag);
            const collision: Collision = new Collision(tagEntity2.name);
            const instance: GameObject = this.scriptInstance.get(tagEntity1.uuid);
            instance.OnCollision(collision);
        }

        if (this.ecs.HasComponent(entity2, _Script) &&
            this.ecs.HasComponent(entity1, _Tag)
        ) {
            const tagEntity1: _Tag = this.ecs.GetComponent(entity1, _Tag);
            const tagEntity2: _Tag = this.ecs.GetComponent(entity2, _Tag);
            const collision: Collision = new Collision(tagEntity1.name);
            const instance: GameObject = this.scriptInstance.get(tagEntity2.uuid);
            instance.OnCollision(collision);
        }
    }

    public OnUpdateScript(entity: Entity, dt: number): void {
        const tag: _Tag = this.ecs.GetComponent(entity, _Tag);
        AXOLOT_ASSERT(!this.scriptInstance.has(tag.uuid), `Cannot find script for ${tag.uuid}`);
        const instance: GameObject = this.scriptInstance.get(tag.uuid);
        instance.OnUpdate(dt);
    } 

    private IsGameObject(script: Class<any>): boolean {
        return (<any>script).tag != undefined
    }
}