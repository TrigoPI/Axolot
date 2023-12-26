import RAPIER from "@dimforge/rapier2d";

import Random from "../math/Random";
import Bound from "../math/Bound";
import Vec2 from "../math/Vec2";

import Component from "../ecs/Component";
import AxolotComponent from "./AxolotComponent";
import LinkToComponent from "./LinkToComponent";
import { Texture } from "../graphics/Texture";
import { WASM } from "../utils/Wasm";
import { Vector2 } from "../math/Vector";

@Component
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

@Component
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

@Component
export class _SpriteRenderer {
    public texture: Texture;

    public constructor(texture: Texture) {
        this.texture = texture;
    }
}

@LinkToComponent(_SpriteRenderer)
export class SpriteRenderer extends AxolotComponent<_SpriteRenderer> {
    public Getcolor(): string {
        return this.component.texture.GetColor();
    }
    
    public Bound(): Bound {
        return new Bound(this.Width(), this.Height());
    }
    
    public Width(): number {
        return this.component.texture.GetWidth();
    }
    
    public Height(): number {
        return this.component.texture.GetHeight();
    }

    public SetColor(color: string): void {
        this.component.texture.SetColor(color);
    }
}

@Component
export class _RigidBody2D {
    public rigidBody: RAPIER.RigidBody;
    public type: RAPIER.RigidBodyType;
    public mass: number;
    public forceScale: number;

    public constructor(type: RAPIER.RigidBodyType = WASM.RAPIER.RigidBodyType.Dynamic) {
        this.mass = 1;
        this.forceScale = 1000;
        this.type = type;
    }

    public Velocity(): Vector2 {
        const linvel: RAPIER.Vector2 = this.rigidBody.linvel();
        return new Vec2(linvel.x, linvel.y);
    }

    public Position(): Vector2 {
        const translation: RAPIER.Vector2 = this.rigidBody.translation();
        return new Vec2(translation.x, translation.y);
    }

    public ApplyImpulse(impulse: Vector2): void {
        this.rigidBody.applyImpulse(new WASM.RAPIER.Vector2(impulse.x * this.forceScale, impulse.y * this.forceScale), true);
    }

    public AddForce(force: Vector2): void {
        this.rigidBody.addForce(new WASM.RAPIER.Vector2(force.x * this.forceScale, force.y * this.forceScale), true);
    }

    public SetPosition(position: Vector2): void {
        this.rigidBody.setTranslation(new RAPIER.Vector2(position.x, position.y), true);
    }

    public SetVelocity(velocity: Vector2): void {
        this.rigidBody.setLinvel(new WASM.RAPIER.Vector2(velocity.x, velocity.y), true);
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

@Component
export class _Script {
    public script: { new(...args: any): any };
    public className: string;

    public constructor(script: { new(...args: any): any }) {
        this.script = script;
        this.className = script.name;
    }
}

@LinkToComponent(_Script)
export class Script extends AxolotComponent<_Script> {}

@Component
export class _BoxCollider2D {
    public collider: RAPIER.Collider;

    public Bound() {
        return new Bound(this.Width(), this.Height()); 
    }

    public Width(): number {
        const shape: RAPIER.Cuboid = this.GetShape();
        return shape.halfExtents.x * 2;
    }

    public Height(): number {
        const shape: RAPIER.Cuboid = this.GetShape();
        return shape.halfExtents.y * 2;
    }

    public GetShape(): RAPIER.Cuboid {
        return <RAPIER.Cuboid>this.collider.shape
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