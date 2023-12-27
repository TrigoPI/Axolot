import RAPIER from "@dimforge/rapier2d";
import { WASM } from "../utils/Wasm";
import AxolotECS from "../ecs/AxolotECS";
import { Entity } from "../ecs/Ecs-type";
import { _BoxCollider2D, _RigidBody2D, _SpriteRenderer, _Transform } from "../scene/Components";
import { Bound } from "../math";

type CollisionHandler = (a: Entity, b: Entity) => void;

export default class PhysicsEngine {
    private gravityScale: number;
    private world: RAPIER.World;
    private ecs: AxolotECS;
    private eventQueue: RAPIER.EventQueue;
    private gravity: RAPIER.Vector2;
    private colliders: Map<number, Entity>

    private collisionHandler: CollisionHandler;

    public constructor() {
        this.gravityScale = 50;
        this.gravity = new WASM.RAPIER.Vector2(0, 9.81 * this.gravityScale);
        this.world = new WASM.RAPIER.World(this.gravity);
        this.eventQueue = new WASM.RAPIER.EventQueue(true);
        this.colliders = new Map<number, Entity>();

        this.collisionHandler = undefined;
    }

    public SetECS(ecs: AxolotECS): void {
        this.ecs = ecs
    }

    public AddCollisionListener(cb: CollisionHandler): void {
        this.collisionHandler = cb;
    }

    public OnCreateRigidBody(entity: Entity): void {
        const [ transform, body ] = this.ecs.GetComponents(entity, _Transform, _RigidBody2D);
        const bodyDesc: RAPIER.RigidBodyDesc = WASM.RAPIER.RigidBodyDesc.dynamic();
        
        bodyDesc.translation.x = transform.position.x;
        bodyDesc.translation.y = transform.position.y;
        bodyDesc.rotation = transform.rotation;
        bodyDesc.mass = body.mass;

        body.rigidBody = this.world.createRigidBody(bodyDesc);
        body.rigidBody.setBodyType(body.type, false);
    }

    public OnCreateCollider(entity: Entity): void {
        const size: Bound = new Bound();
        const [ tranfrom, collider ] = this.ecs.GetComponents(entity, _Transform, _BoxCollider2D);

        if (this.ecs.HasComponent(entity, _SpriteRenderer)) {
            const spriteRender: _SpriteRenderer = this.ecs.GetComponent(entity, _SpriteRenderer);
            size.w = spriteRender.Width() * tranfrom.scale.x;
            size.h = spriteRender.Height() * tranfrom.scale.y;
        }


        const colliderDesc: RAPIER.ColliderDesc = WASM.RAPIER.ColliderDesc.cuboid(size.w / 2, size.h / 2);
        colliderDesc.setActiveEvents(WASM.RAPIER.ActiveEvents.COLLISION_EVENTS);

        if (this.ecs.HasComponent(entity, _RigidBody2D)) {
            const rigidBody: _RigidBody2D = this.ecs.GetComponent(entity, _RigidBody2D);
            collider.collider = this.world.createCollider(colliderDesc, rigidBody.rigidBody);
        } else {
            colliderDesc.translation.x = tranfrom.position.x;
            colliderDesc.translation.y = tranfrom.position.y;
            colliderDesc.rotation = tranfrom.rotation;
            collider.collider = this.world.createCollider(colliderDesc);
        }


        this.colliders.set(collider.collider.handle, entity);
    }

    public OnUpdatePhysics(): void {
        this.world.step(this.eventQueue);
    }

    public OnEventQueue(): void {
        this.eventQueue.drainCollisionEvents((handle1: number, handle2: number, started: boolean) => {
            if (started) {
                const entity1: Entity = this.colliders.get(handle1);
                const entity2: Entity = this.colliders.get(handle2);
                this.collisionHandler(entity1, entity2);
            }
        });
    }

    public OnUpdateCollider(entity: Entity): void {
        if (this.ecs.HasComponent(entity, _RigidBody2D)) return;
        const [ transform, collider ] = this.ecs.GetComponents(entity, _Transform, _BoxCollider2D);
        collider.SetPosition(transform.position);
    }

    public OnUpdateRigidBody(entity: Entity): void {
        const [ transform, body ] = this.ecs.GetComponents(entity, _Transform, _RigidBody2D);
        const translation: RAPIER.Vector2 = body.rigidBody.translation();
        const rotation: number = body.rigidBody.rotation();

        transform.position.x = translation.x;
        transform.position.y = translation.y;
        transform.rotation = rotation; 
    }
}