import * as p2 from "p2";

import { BodyType } from "../physics/BodyType";

import { Vector2 } from "../math/Vector";
import Random from "../math/Random";
import Bound from "../math/Bound";
import Vec2 from "../math/Vec2";

import Component from "../ecs/Component";
import AxolotComponent from "./AxolotComponent";
import LinkToComponent from "./LinkToComponent";

export enum ComponentName {
    TAG             = "TAG",
    TRANSFORM       = "TRANSFROM",
    RIGID_BODY_2D   = "RIGID_BODY_2D",
    BOX_COLLIDER_2D = "BOX_COLLIDER_2D",
    SCRIPT          = "SCRIPT"
}

@Component(ComponentName.TAG)
export class _Tag {
    public uuid: string;
    public name: string
    public constructor(name: string) {
        this.uuid = Random.uuidv4();
        this.name = (name)? name : this.uuid;
    }    
}

@LinkToComponent(_Tag)
export class Tag extends AxolotComponent<_Tag> {
    public GetUUID(): string {
        return this.component.uuid;
    }
}

@Component(ComponentName.TRANSFORM)
export class _Transform {
    public position: Vec2;
    public scale: Vec2;
    public rotation: number;

    public constructor(x: number = 0, y: number = 0, scaleX: number = 1, scaleY: number = 1, rotation: number = 0) {
        this.position = new Vec2(x, y);
        this.scale = new Vec2(scaleX, scaleY);
        this.rotation = rotation;
    }
}

@LinkToComponent(_Transform)
export class Transform extends AxolotComponent<_Transform> {
    public get position(): Vector2 {
        return this.component.position;
    }

    public set position(a: Vec2) {
        this.component.position.x = a.x;
        this.component.position.y = a.y;
    }
}

@Component(ComponentName.RIGID_BODY_2D)
export class _RigidBody2D {
    public rigidBody: p2.Body;
    public type: BodyType;
    public mass: number;
    public forceScale: number;

    public constructor(type: BodyType = BodyType.DYNAMIC) {
        this.mass = 1;
        this.type = type;
        this.forceScale = 1000;
    }

    public Velocity(): Vector2 {
        return new Vec2(this.rigidBody.velocity[0], this.rigidBody.velocity[1]);
    }

    public Position(): Vector2 {
        return new Vec2(this.rigidBody.position[0], this.rigidBody.velocity[1]);
    }

    public ApplyImpulse(impulse: Vector2): void {
        this.rigidBody.applyImpulse([impulse.x * this.forceScale, impulse.y * this.forceScale]);
    }

    public AddForce(force: Vector2): void {
        this.rigidBody.applyForce([force.x * this.forceScale, force.y * this.forceScale]);
    }

    public SetPosition(position: Vector2): void {
        this.rigidBody.position[0] = position.x;
        this.rigidBody.position[1] = position.y;
    }

    public SetVelocity(velocity: Vector2): void {
        this.rigidBody.velocity[0] = velocity.x;
        this.rigidBody.velocity[1] = velocity.y;
    }
}

@LinkToComponent(_RigidBody2D)
export class RigidBody2D extends AxolotComponent<_RigidBody2D> {
    public get velocity(): Vector2 {
        return this.component.Velocity();
    }

    public set velocity(velocity: Vector2) {
        this.component.SetVelocity(velocity);
    }

    public get position(): Vector2 {
        return this.component.Position();
    }

    public set position(position: Vec2) {
        this.component.SetPosition(position);
    }

    public ApplyImpulse(impulse: Vector2): void {
        this.component.ApplyImpulse(impulse);
    }

    public AddForce(force: Vector2): void {
        this.component.AddForce(force);
    }
}

@Component(ComponentName.BOX_COLLIDER_2D)
export class _BoxCollider2D {
    public collider: p2.Box;
    public width: number;
    public height: number;

    public constructor(width: number = 16, height: number = 16) {
        this.width = width;
        this.height = height;
    }

    public Bound(): Bound {
        return new Bound(this.Width(), this.Height()); 
    }

    public Width(): number {
        return this.collider.width;
    }

    public Height(): number {
        return this.collider.height;
    }

    public SetBound(w: number, h: number): void {
        this.collider.width = w;
        this.collider.height = h;
    }

    public SetPosition(position: Vec2): void {
        this.collider.position[0] = position.x;
        this.collider.position[1] = position.y;
    }
}

@LinkToComponent(_BoxCollider2D)
export class BoxCollider2D extends AxolotComponent<_BoxCollider2D> {
    public Bound(): Bound {
        return this.component.Bound();
    }

    public Width(): number {
        return this.component.Width();
    }

    public Height(): number {
        return this.component.Height();
    }
}

@Component(ComponentName.SCRIPT)
export class _Script {
    public script: { new(...args: any): any };
    public className: string;
    public params: Record<string, any>;

    public constructor(script: { new(...args: any): any }, params: Record<string, any> = undefined) {
        this.script = script;
        this.className = script.name;
        this.params = params;
    }
}

@LinkToComponent(_Script)
export class Script extends AxolotComponent<_Script> {}