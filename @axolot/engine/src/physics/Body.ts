import * as p2 from "p2";
import RAPIER from "@dimforge/rapier2d";

import Random from "../math/Random";
import { Vec2, Vector2 } from "../math";

export interface Body {
    GetId(): string;
    GetPosition(): Vector2;
    GetVelocity(): Vector2;
    GetRotation(): number;
    GetMass(): number;
    ApplyForce(force: Vector2): void;
    ApplyImpuse(impulse: Vector2): void;
    SetPosition(position: Vector2): void;
    SetVelocity(velocity: Vector2): void;
    SetRotation(rotation: number): void;
}

export class RapierBody implements Body {
    private rigidBody: RAPIER.RigidBody;
    private id: string;

    public constructor(rigidBody: RAPIER.RigidBody) {
        this.rigidBody = rigidBody;
        this.id = Random.uuidv4();
    }

    public GetId(): string {
        return this.id;
    }

    public GetPosition(): Vector2 {
        return this.rigidBody.translation()
    }

    public GetVelocity(): Vector2 {
        return this.rigidBody.linvel();
    }

    public GetRotation(): number {
        return this.rigidBody.rotation();
    }

    public GetMass(): number {
        return this.rigidBody.mass();
    }

    public ApplyForce(force: Vector2): void {
        this.rigidBody.addForce(force, true);
    }

    public ApplyImpuse(impulse: Vector2): void {
        this.rigidBody.applyImpulse(impulse, true);
    }

    public SetPosition(position: Vector2): void {
        this.rigidBody.setTranslation(position, true)
    }

    public SetVelocity(velocity: Vector2): void {
        this.rigidBody.setLinvel(velocity, true);
    }

    public SetRotation(rotation: number): void {
        this.rigidBody.setRotation(rotation, true);
    }

    public GetBody(): RAPIER.RigidBody {
        return this.rigidBody;
    }
}

export class P2Body implements Body {
    private rigidBody: p2.Body;
    private position: Vec2;
    private velocity: Vec2;
    private id: string;

    public constructor(rigidBody: p2.Body) {
        this.rigidBody = rigidBody;
        this.position = new Vec2();
        this.velocity = new Vec2();
        this.id = Random.uuidv4();
    }

    public GetId(): string {
        return this.id;
    }

    public GetPosition(): Vector2 {
        this.position.x = this.rigidBody.position[0];
        this.position.y = this.rigidBody.position[1];
        return this.position;
    }

    public GetVelocity(): Vector2 {
        this.velocity.x = this.rigidBody.velocity[0];
        this.velocity.y = this.rigidBody.velocity[1];
        return this.velocity;
    }

    public GetRotation(): number {
        return this.rigidBody.angle;
    }

    public GetMass(): number {
        return this.rigidBody.mass;
    }

    public ApplyForce(force: Vector2): void {
        this.rigidBody.applyForce([force.x, force.y]);
    }

    public ApplyImpuse(impulse: Vector2): void {
        this.rigidBody.applyImpulse([ impulse.x, impulse.y ]);
    }

    public SetPosition(position: Vector2): void {
        throw new Error("Method not implemented.");
    }

    public SetVelocity(velocity: Vector2): void {
        this.rigidBody.velocity[0] = velocity.x;
        this.rigidBody.velocity[1] = velocity.y
    }

    public SetRotation(rotation: number): void {
        this.rigidBody.angle = rotation;
    }

    public GetBody(): p2.Body {
        return this.rigidBody;
    }
}