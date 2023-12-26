import RAPIER from "@dimforge/rapier2d";
import { WASM } from "../utils/Wasm";

import { PixiTexture } from "../graphics/Texture";
import Renderer from "../graphics/Renderer";
import ScriptingEngine from "../scripting/ScriptingEngine";

import { Entity } from "../ecs/Ecs-type";
import AxolotEntity from "./AxolotEntity";
import AxolotECS from "../ecs/AxolotECS";

import { _BoxCollider2D, _RigidBody2D, _Script, _SpriteRenderer, _Tag, _Transform } from "./Components";
import Bound from "../math/Bound";
import PhysicsEngine from "../physics/physicsEngine";

export default class Scene {
    private entities: Map<string, AxolotEntity>;
    private ecs: AxolotECS;

    private renderer: Renderer;
    private scriptingEngine: ScriptingEngine;
    private physicsEngine: PhysicsEngine;

    public constructor() {
        this.entities = new Map<string, AxolotEntity>();
        this.ecs = new AxolotECS();
        this.renderer = new Renderer();
        this.scriptingEngine = new ScriptingEngine();
        this.physicsEngine = new PhysicsEngine();
    }

    public CreateEntity(name: string = undefined): AxolotEntity {
        const entity: Entity = this.ecs.CreateEntity();
        const axolotEntity: AxolotEntity = new AxolotEntity(entity, this.ecs);
        const tag: _Tag = this.ecs.AddComponent(entity, _Tag, name); 
        this.entities.set(tag.uuid, axolotEntity);
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

    private OnUpdatePhysics(): void {
        this.physicsEngine.OnUpdatePhysics();
        this.physicsEngine.OnUpdateCollision();

        const entitiesRb: Entity[] = this.ecs.GetEntities(_Transform, _RigidBody2D);

        for (let i: number = 0; i < entitiesRb.length; i++) {
            const entity: Entity = entitiesRb[i]; 
            this.physicsEngine.OnUpdateRigidBody(entity);
        }
    }

    private OnUpdateSpriteRenderer(): void {        
        const entities: Entity[] = this.ecs.GetEntities(_Transform, _SpriteRenderer);
        for (let i: number = 0; i < entities.length; i++) {
            const entity: Entity = entities[i]; 
            const [ transform, sprite ] = this.ecs.GetComponents(entity, _Transform, _SpriteRenderer);
            const texture: PixiTexture = <PixiTexture>sprite.texture;
            
            texture.SetPosition(transform.position.x, transform.position.y);
            texture.SetScale(transform.scale.x, transform.scale.y);
            texture.SetRotation(transform.rotation);
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
        this.renderer.CreateCanvas(window.innerWidth, window.innerHeight);

        const entities: Entity[] = this.ecs.GetEntities(_Transform, _SpriteRenderer);

        for (let i: number = 0; i < entities.length; i++) {
            const entity: Entity = entities[i]; 
            const [ transform, sprite ] = this.ecs.GetComponents(entity, _Transform, _SpriteRenderer);
            const texture: PixiTexture = <PixiTexture>sprite.texture;
            
            texture.SetPosition(transform.position.x, transform.position.y);
            texture.SetScale(transform.scale.x, transform.scale.y);
            texture.SetRotation(transform.rotation);

            this.renderer.AddTexture(texture);
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

    public OnScriptingStart(): void {
        const entities: Entity[] = this.ecs.GetEntities(_Script, _Tag);
        this.scriptingEngine.SetECS(this.ecs);

        for (let i: number = 0; i < entities.length; i++) {
            const entity: Entity = entities[i];
            this.scriptingEngine.OnCreateScriptInstance(entity);
        }
    }
}