import * as p2 from "p2"
import RAPIER from "@dimforge/rapier2d";

import { WASM } from "../utils/Wasm";
import { Vec2, Vector2 } from "../math";

import { Body, P2Body, RapierBody } from "./Body";
import { BoxCollider, P2BoxCollider, RapierBoxCollider } from "./Collider";
import { CollisionHandler, P2BeginContactEvent } from "./Physics-types";
import { BodyType } from "./BodyType";

export interface World {
    CreateBody(position?: Vector2, type?: BodyType, mass?: number, rotation?: number): Body;
    CreateBoxCollider(body: Body, width: number, height: number): BoxCollider;
    SetGravity(gravity: Vector2): void;
    OnCollision(cb: CollisionHandler): void
    Step(dt: number): void;
}

export class RapierWorld implements World {
    private world: RAPIER.World;
    private gravity: RAPIER.Vector2;
    private eventQueue: RAPIER.EventQueue;
    private handleToCollider: Map<number, BoxCollider>;

    private collisionHandler: CollisionHandler;

    public constructor() {
        this.gravity = new WASM.RAPIER.Vector2(0, 9.81);
        this.world = new WASM.RAPIER.World(this.gravity);
        this.eventQueue = new WASM.RAPIER.EventQueue(true);
        this.handleToCollider = new Map<number, BoxCollider>();
    }

    public CreateBody(position: Vec2 = new Vec2(0, 0), type: BodyType = BodyType.DYNAMIC, mass: number = 1, rotation: number = 0): Body {
        const rapierBodyType: RAPIER.RigidBodyType = this.BodyTypeToRapierType(type);
        const bodyDesc: RAPIER.RigidBodyDesc = new WASM.RAPIER.RigidBodyDesc(rapierBodyType);
        
        bodyDesc.mass = mass;
        bodyDesc.translation.x = position.x;
        bodyDesc.translation.y = position.y;

        const rapiderBody: RAPIER.RigidBody = this.world.createRigidBody(bodyDesc);
        const body: RapierBody = new RapierBody(rapiderBody);

        return body;
    }

    public CreateBoxCollider(body: Body, width: number, height: number): BoxCollider {
        const rapierBody: RAPIER.RigidBody = (<RapierBody>body).GetBody();
        const shape: RAPIER.Cuboid = new WASM.RAPIER.Cuboid(width / 2, height / 2);
        
        const colliderDesc: RAPIER.ColliderDesc = new WASM.RAPIER.ColliderDesc(shape);
        colliderDesc.setActiveEvents(WASM.RAPIER.ActiveEvents.COLLISION_EVENTS);
        
        const rapierCollider: RAPIER.Collider = this.world.createCollider(colliderDesc, rapierBody);
        const collider: BoxCollider = new RapierBoxCollider(rapierCollider);
        
        this.handleToCollider.set(rapierCollider.handle, collider);

        return collider;
    }

    public OnCollision(cb: CollisionHandler): void {
        this.collisionHandler = cb;
    }

    public SetGravity(gravity: Vector2): void {
        this.world.gravity.x = gravity.x;
        this.world.gravity.y = gravity.y;
    }

    public Step(dt: number): void {
        this.world.step(this.eventQueue);
        
        this.eventQueue.drainCollisionEvents((handle1: number, handle2: number) => {
            const collider1: BoxCollider = this.handleToCollider.get(handle1);
            const collider2: BoxCollider = this.handleToCollider.get(handle2);
            this.collisionHandler(collider1, collider2);
        });
    }

    private BodyTypeToRapierType(type: BodyType): RAPIER.RigidBodyType {
        switch (type) {
            case BodyType.STATIC:       return WASM.RAPIER.RigidBodyType.Fixed;
            case BodyType.DYNAMIC:      return WASM.RAPIER.RigidBodyType.Dynamic;
            case BodyType.KINEMATIC:    return WASM.RAPIER.RigidBodyType.KinematicPositionBased
        }
    }
}

export class P2World implements World {
    private world: p2.World;
    private gravity: [number, number];
    private handleToCollider: Map<number, BoxCollider>;
    
    private fixedTimeStep: number;
    private maxSubSteps: number;

    private collisionHandler: CollisionHandler;

    public constructor() {
        this.gravity = [0, 9.81];
        this.world = new p2.World({ gravity: this.gravity });
        this.handleToCollider = new Map<number, BoxCollider>();

        //TODO change this
        this.fixedTimeStep = 1 / 60;
        this.maxSubSteps = 10;

        this.world.on('beginContact', (e: P2BeginContactEvent) => this.OnP2Collision(e));
    }

    public CreateBody(pos: Vec2 = new Vec2(0, 0), bodyType: BodyType = BodyType.DYNAMIC, mass: number = 1, angle: number = 0): Body {
        const type: any = this.BodyTypeToP2Type(bodyType);
        const position: [number, number] = [ pos.x, pos.y ];
        const body: p2.Body = new p2.Body({ position, angle, type, mass });
        const p2Body: P2Body = new P2Body(body);
        this.world.addBody(body);

        return p2Body;
    }

    public CreateBoxCollider(body: Body, width: number, height: number): BoxCollider {
        const p2Body: p2.Body = (<P2Body>body).GetBody();

        const shape: p2.Box = new p2.Box({ width, height });
        const p2Collider: P2BoxCollider = new P2BoxCollider(shape);

        p2Body.addShape(shape);
        this.handleToCollider.set(shape.id, p2Collider);

        return p2Collider;
    }

    public SetGravity(gravity: Vector2): void {
        this.world.gravity[0] = gravity.x;
        this.world.gravity[1] = gravity.y;
    }

    public OnCollision(cb: CollisionHandler): void {
        this.collisionHandler = cb;
    }

    public Step(dt: number): void {
        this.world.step(this.fixedTimeStep, dt, this.maxSubSteps);
    }

    private BodyTypeToP2Type(type: BodyType): number {
        switch (type) {
            case BodyType.STATIC    : return p2.Body.STATIC;
            case BodyType.DYNAMIC   : return p2.Body.DYNAMIC;
            case BodyType.KINEMATIC : return p2.Body.KINEMATIC
        }
    }

    private OnP2Collision(e: P2BeginContactEvent): void {
        const colliderA: BoxCollider = this.handleToCollider.get(e.shapeA.id);
        const colliderB: BoxCollider = this.handleToCollider.get(e.shapeB.id);
        this.collisionHandler(colliderA, colliderB);
    }
}