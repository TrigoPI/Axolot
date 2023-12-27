import { PixiTexture } from "../graphics/Texture";
import Renderer from "../graphics/Renderer";
import ScriptingEngine from "../scripting/ScriptingEngine";
import PhysicsEngine from "../physics/physicsEngine";

import { Entity } from "../ecs/Ecs-type";
import AxolotEntity from "./AxolotEntity";
import AxolotECS from "../ecs/AxolotECS";

import { ComponentName, _BoxCollider2D, _RigidBody2D, _Script, _SpriteRenderer, _Tag, _Transform } from "./Components";
import { ComponentDesc, Prefab } from "../Asset/Prefab";
import { Vector2 } from "../math";

export default class Scene {
    private ecs: AxolotECS;

    private renderer: Renderer;
    private scriptingEngine: ScriptingEngine;
    private physicsEngine: PhysicsEngine;

    public constructor() {
        this.ecs = new AxolotECS();
        this.renderer = new Renderer();
        this.scriptingEngine = new ScriptingEngine();
        this.physicsEngine = new PhysicsEngine();
    }

    public CreateEntity(name: string = undefined): AxolotEntity {
        const entity: Entity = this.ecs.CreateEntity();
        const axolotEntity: AxolotEntity = new AxolotEntity(entity, this.ecs);
        this.ecs.AddComponent(entity, _Tag, name);
        return axolotEntity;
    }

    public CreateEntityFromPrefab(prefab: Prefab): AxolotEntity {
        const entity: Entity = this.ecs.CreateEntity();
        const axolotEntity: AxolotEntity = new AxolotEntity(entity, this.ecs);
        const components: ComponentDesc[] = (<any>prefab).components;

        for (let i: number = 0; i < components.length; i++) {
            const decs: ComponentDesc = components[i];
            
            switch (decs.name) {
                case ComponentName.TAG:
                    this.ecs.AddComponent(entity, _Tag, prefab.name);
                    break;
                case ComponentName.TRANSFORM:
                    this.ecs.AddComponent(entity, _Transform, ...decs.args);
                    break;
                case ComponentName.SPRITE_RENDERER:
                    this.ecs.AddComponent(entity, _SpriteRenderer, ...decs.args);
                    break;
                case ComponentName.RIGID_BODY_2D:
                    this.ecs.AddComponent(entity, _RigidBody2D, ...decs.args);
                    break
                case ComponentName.BOX_COLLIDER_2D:
                    this.ecs.AddComponent(entity, _BoxCollider2D, ...decs.args);
                    break;
                case ComponentName.SCRIPT:
                    this.ecs.AddComponent(entity, _Script, ...decs.args);
                    break
            }
        }

        return axolotEntity;
    }

    public ResizeView(width: number, height: number): void {
        this.renderer.ResizeView(width, height);
    }

    public OnRuntimeStart(): void {
        this.OnRenderingStart();
        this.OnPhysics2dStart();
        this.OnScriptingStart();
    }

    public OnRuntimeUpdate(dt: number): void {
        this.OnScriptingUpdate(dt);
        this.OnUpdatePhysics();
        this.OnUpdateSpriteRenderer();
    }

    private OnInstantiate(prefab: Prefab, position: Vector2, rotation: number): Entity {
        const entity: AxolotEntity = this.CreateEntityFromPrefab(prefab);
        const entityId: Entity = (<any>entity).id;

        if (!this.ecs.HasComponent(entityId, _Transform)) {
            this.ecs.AddComponent(entityId, _Transform);
        }
        
        if (!this.ecs.HasComponent(entityId, _Tag)) {
            this.ecs.AddComponent(entityId, _Tag);
        }

        const transform: _Transform = this.ecs.GetComponent(entityId, _Transform);
        transform.position.Set(position);
        transform.rotation = rotation;

        if (this.ecs.HasComponents(entityId, _RigidBody2D)) {
            this.physicsEngine.OnCreateRigidBody(entityId);
        }
        
        if (this.ecs.HasComponents(entityId, _BoxCollider2D)) {
            this.physicsEngine.OnCreateCollider(entityId);
        }
        
        if (this.ecs.HasComponents(entityId, _SpriteRenderer)) {
            this.renderer.OnAddSpriteRenderer(entityId);
        }
        
        if (this.ecs.HasComponent(entityId, _Script)) {
            this.scriptingEngine.OnCreateScriptInstance(entityId);
        }
    
        return entityId;
    }

    private OnUpdatePhysics(): void {
        const entitiesRb: Entity[] = this.ecs.GetEntities(_Transform, _RigidBody2D);
        const entitiesBc: Entity[] = this.ecs.GetEntities(_Transform, _BoxCollider2D);

        for (let i: number = 0; i < entitiesBc.length; i++) {
            const entity: Entity = entitiesBc[i];    
            this.physicsEngine.OnUpdateCollider(entity);
        }

        this.physicsEngine.OnUpdatePhysics();
        this.physicsEngine.OnEventQueue();

        for (let i: number = 0; i < entitiesRb.length; i++) {
            const entity: Entity = entitiesRb[i]; 
            this.physicsEngine.OnUpdateRigidBody(entity);
        }
    }

    private OnUpdateSpriteRenderer(): void {        
        const entities: Entity[] = this.ecs.GetEntities(_Transform, _SpriteRenderer);

        for (let i: number = 0; i < entities.length; i++) {
            const entity: Entity = entities[i]; 
            this.renderer.OnUpdateSpriteRenderer(entity);
        }
        
        this.renderer.EndScence();
    }

    private OnScriptingUpdate(dt: number): void {
        const entities: Entity[] = this.ecs.GetEntities(_Script, _Tag);
        for (let i: number = 0; i < entities.length; i++) {
            const entity: Entity = entities[i];
            this.scriptingEngine.OnUpdateScript(entity, dt);
        }
    }

    private OnRenderingStart(): void {
        this.renderer.SetECS(this.ecs);
        this.renderer.CreateCanvas(window.innerWidth, window.innerHeight);
        
        const entities: Entity[] = this.ecs.GetEntities(_Transform, _SpriteRenderer);

        for (let i: number = 0; i < entities.length; i++) {
            const entity: Entity = entities[i]; 
            this.renderer.OnAddSpriteRenderer(entity);
        }
    }

    private OnPhysics2dStart(): void {
        this.physicsEngine.SetECS(this.ecs);
        this.physicsEngine.AddCollisionListener((a: Entity, b: Entity) => this.scriptingEngine.OnCollision(a, b));

        const entitiesRb: Entity[] = this.ecs.GetEntities(_Transform, _RigidBody2D);
        const entitiesBc: Entity[] = this.ecs.GetEntities(_Transform, _BoxCollider2D);

        for (let i: number = 0; i < entitiesRb.length; i++) {
            const entity: Entity = entitiesRb[i]; 
            this.physicsEngine.OnCreateRigidBody(entity);
        }

        for (let i: number = 0; i < entitiesBc.length; i++) {
            const entity: Entity = entitiesBc[i];
            this.physicsEngine.OnCreateCollider(entity);
        }
    }

    private OnScriptingStart(): void {
        const entities: Entity[] = this.ecs.GetEntities(_Script, _Tag);

        this.scriptingEngine.SetECS(this.ecs);
        this.scriptingEngine.AddInstantiateListener((prefab: Prefab, position: Vector2, rotation: number) => this.OnInstantiate(prefab, position, rotation));

        for (let i: number = 0; i < entities.length; i++) {
            const entity: Entity = entities[i];
            this.scriptingEngine.OnCreateScriptInstance(entity);
        }
    }
}