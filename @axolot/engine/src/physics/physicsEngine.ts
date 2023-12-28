import { _BoxCollider2D, _RigidBody2D, _SpriteRenderer, _Transform } from "../scene/Components";
import { Entity } from "../ecs/Ecs-type";
import AxolotECS from "../ecs/AxolotECS";

import { World } from "./World";
import PhysicsFactory from "./PhysicsFactory";
import { Body } from "./Body";
import { Bound, Vec2, Vector2 } from "../math";
import { BoxCollider } from "./Collider";

type CollisionHandler = (a: Entity, b: Entity) => void;

export default class PhysicsEngine {
    private gravityScale: number;
    private world: World;
    private ecs: AxolotECS;
    private colliders: Map<string, Entity>

    private collisionHandler: CollisionHandler;

    public constructor() {
        this.gravityScale = 50;
        this.world = PhysicsFactory.CreateWorld();
        this.colliders = new Map<string, Entity>();

        this.collisionHandler = undefined;

        this.world.SetGravity(new Vec2(0, 9.81 * this.gravityScale));
        this.world.OnCollision((collider1: BoxCollider, collider2: BoxCollider) => this.OnCollision(collider1, collider2));
    }

    public SetECS(ecs: AxolotECS): void {
        this.ecs = ecs
    }

    public AddCollisionListener(cb: CollisionHandler): void {
        this.collisionHandler = cb;
    }

    public OnCreateRigidBody(entity: Entity): void {
        const [ transform, body ] = this.ecs.GetComponents(entity, _Transform, _RigidBody2D);
        const rigidBody: Body = this.world.CreateBody(transform.position, body.type, body.mass, transform.rotation);
        body.rigidBody = rigidBody;
    }

    public OnCreateCollider(entity: Entity): void {
        const size: Bound = new Bound();
        const [ tranfrom, collider, body ] = this.ecs.GetComponents(entity, _Transform, _BoxCollider2D, _RigidBody2D);

        if (this.ecs.HasComponent(entity, _SpriteRenderer)) {
            const spriteRender: _SpriteRenderer = this.ecs.GetComponent(entity, _SpriteRenderer);
            size.w = spriteRender.Width() * tranfrom.scale.x;
            size.h = spriteRender.Height() * tranfrom.scale.y;
        }
        
        collider.collider = this.world.CreateBoxCollider(body.rigidBody, size.w, size.h);        
        this.colliders.set(collider.collider.GetId(), entity);
    }

    public OnUpdatePhysics(dt: number): void {
        this.world.Step(dt);
    }

    public OnUpdateRigidBody(entity: Entity): void {
        const [ transform, body ] = this.ecs.GetComponents(entity, _Transform, _RigidBody2D);
        const translation: Vector2 = body.Position();
        const rotation: number = body.Rotation();

        transform.position.x = translation.x;
        transform.position.y = translation.y;
        transform.rotation = rotation; 
    }

    private OnCollision(collider1: BoxCollider, collider2: BoxCollider): void {
        const entity1: Entity = this.colliders.get(collider1.GetId());
        const entity2: Entity = this.colliders.get(collider2.GetId());
        this.collisionHandler(entity1, entity2);
    }
}