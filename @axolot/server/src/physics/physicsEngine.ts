import * as p2 from "p2";

import { Bound, Vec2 } from "../math";
import { Entity } from "../ecs/Ecs-type";
import AxolotECS from "../ecs/AxolotECS";

import { _BoxCollider2D, _RigidBody2D, _Transform } from "../scene/Components";

type CollisionHandler = (a: Entity, b: Entity) => void;

export default class PhysicsEngine {
    private fixedTimeStep: number;
    private maxSubSteps : number;
    private gravityScale: number;

    private world: p2.World;
    private ecs: AxolotECS;
    private gravity: Vec2;
    private colliders: Map<number, Entity>
    
    private collisionHandler: CollisionHandler;
    
    public constructor() {
        this.gravityScale = 50;
        this.fixedTimeStep = 1 / 60;
        this.maxSubSteps = 10;

        this.gravity = new Vec2(0, 9.81);
        this.world = new p2.World({ gravity: [ this.gravity.x, this.gravity.y ] });
        
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
        const mass: number = body.mass;
        const type: any = body.type;
        const position: [number, number] = [transform.position.x, transform.position.y];
        const angle: number = transform.rotation;

        body.rigidBody = new p2.Body({ mass, position, angle, type });
        
        this.world.addBody(body.rigidBody);
    }

    public OnCreateCollider(entity: Entity): void {
        const size: Bound = new Bound();
        const [ collider, body ] = this.ecs.GetComponents(entity, _BoxCollider2D, _RigidBody2D);

        const width: number = collider.width;
        const height: number = collider.height; 

        collider.collider = new p2.Box({ width, height });
        body.rigidBody.addShape(collider.collider);

        // this.colliders.set(collider.collider.handle, entity);
    }

    public OnUpdatePhysics(dt: number): void {
        this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
    }

    public OnUpdateCollider(entity: Entity): void {
        if (this.ecs.HasComponent(entity, _RigidBody2D)) return;
        const [ transform, collider ] = this.ecs.GetComponents(entity, _Transform, _BoxCollider2D);
        collider.SetPosition(transform.position);
    }

    public OnUpdateRigidBody(entity: Entity): void {
        const [ transform, body ] = this.ecs.GetComponents(entity, _Transform, _RigidBody2D);
        const translation: [number, number] = body.rigidBody.position;
        const rotation: number = body.rigidBody.angle;

        transform.position.x = translation[0];
        transform.position.y = translation[1];
        transform.rotation = rotation; 
    }
}