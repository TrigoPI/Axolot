import { AXOLOT_ASSERT } from "../utils/Assert";
import { Class, InstantiateHandler } from "./Scripting-type";

import { Vec2, Vector2 } from "../math";
import { Prefab } from "../Asset";

import { Entity } from "../ecs/Ecs-type";
import AxolotECS from "../ecs/AxolotECS";

import { _Script, _Tag } from "../scene/Components";
import AxolotEntity from "../scene/AxolotEntity";

import GameObject from "./GameObject";
import Collision from "./Collision";
import ScriptObject from "./ScriptObject";

export default class ScriptingEngine {
    private scriptInstance: Map<string, ScriptObject>;
    private ecs: AxolotECS;

    private instantiateHandler: InstantiateHandler;

    public constructor() {
        this.scriptInstance = new Map<string, ScriptObject>();
        this.instantiateHandler = undefined;
    }

    public SetECS(ecs: AxolotECS) {
        this.ecs = ecs;
    }

    public AddInstantiateListener(cb: InstantiateHandler): void {
        this.instantiateHandler = cb;
    }

    public OnCreateScriptInstance(entity: Entity): void {        
        const [tag, script] = this.ecs.GetComponents(entity, _Tag, _Script);
        
        AXOLOT_ASSERT(this.scriptInstance.has(tag.uuid), `${tag.uuid} already have script ${script.className}`);
        AXOLOT_ASSERT(!this.IsGameObject(script.script), `Script ${script.className} is not a GameObject`);

        const instance: ScriptObject = new (<Class<ScriptObject>>script.script)();
        const gameObject: GameObject = new GameObject();
        if (script.params) this.InstantiateParams(instance, script);

        (<any>gameObject).entity = entity;
        (<any>gameObject).ecs = this.ecs;
        (<any>instance).gameObject = gameObject;
        (<any>instance).Instantiate = (prefab: Prefab, position: Vector2 = new Vec2(0, 0), rotation: number = 0) => this.OnInstantiate(prefab, position, rotation);

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
            const instance: ScriptObject = this.scriptInstance.get(tagEntity1.uuid);
            instance.OnCollision(collision);
        }

        if (this.ecs.HasComponent(entity2, _Script) &&
            this.ecs.HasComponent(entity1, _Tag)
        ) {
            const tagEntity1: _Tag = this.ecs.GetComponent(entity1, _Tag);
            const tagEntity2: _Tag = this.ecs.GetComponent(entity2, _Tag);
            const collision: Collision = new Collision(tagEntity1.name);
            const instance: ScriptObject = this.scriptInstance.get(tagEntity2.uuid);
            instance.OnCollision(collision);
        }
    }

    public OnUpdateScript(entity: Entity, dt: number): void {
        const tag: _Tag = this.ecs.GetComponent(entity, _Tag);
        AXOLOT_ASSERT(!this.scriptInstance.has(tag.uuid), `Cannot find script for ${tag.uuid}`);
        const instance: ScriptObject = this.scriptInstance.get(tag.uuid);
        instance.OnUpdate(dt);
    } 

    private OnInstantiate(prefab: Prefab,  position: Vector2, rotation: number): GameObject {
        const entity: Entity = this.instantiateHandler(prefab, position, rotation);
        const gameObject: GameObject = new GameObject();
        (<any>gameObject).entity = entity;
        (<any>gameObject).ecs = this.ecs;
        return gameObject;
    }

    private IsGameObject(script: Class<any>): boolean {
        return (<any>script).tag != undefined
    }

    private InstantiateParams(instance: ScriptObject, script: _Script): void {
        for (const key in script.params) {
            const value: any = script.params[key];
            
            if (value instanceof AxolotEntity) {
                const gameObject: GameObject = new GameObject();
                (<any>gameObject).entity = (<any>value).id;
                (<any>gameObject).ecs = this.ecs;
                instance[key] = gameObject;
            } else {
                instance[key] = value;
            }
        }
    }
}