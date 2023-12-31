import RAPIER from "@dimforge/rapier2d";
import * as PIXI from "pixi.js"

import Random from "../math/Random";
import Bound from "../math/Bound";
import Vec2 from "../math/Vec2";

import Component from "../ecs/Component";
import AxolotComponent from "./AxolotComponent";
import LinkToComponent from "./LinkToComponent";
import { Texture } from "../graphics/Texture";
import { WASM } from "../utils/Wasm";
import { Vector2 } from "../math/Vector";
import { Body } from "../physics/Body";
import { BodyType } from "../physics/BodyType";
import { BoxCollider } from "../physics/Collider";

export enum ComponentName {
    TAG             = "TAG",
    TRANSFORM       = "TRANSFROM",
    SPRITE_RENDERER = "SPRITE_RENDERER",
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

@Component(ComponentName.SPRITE_RENDERER)
export class _SpriteRenderer {
    public texture: Texture;
    public sprite: PIXI.Sprite;

    public constructor(texture: Texture) {
        this.texture = texture;
    }

    public Color(): string {
        return "#" + this.sprite.tintValue.toString(16);
    }

    public Bound(): Bound {
        return new Bound(this.Width(), this.Height());
    }

    public Width(): number {
        return this.texture.GetWidth();
    }

    public Height(): number {
        return this.texture.GetHeight();
    }

    public SetColor(color: string): void {
        this.sprite.tint = color;
    }

    public SetPosition(postion: Vector2): void {
        this.sprite.position.x = postion.x;
        this.sprite.position.y = postion.y;
    }

    public SetScale(scale: Vector2): void {
        this.sprite.scale.x = scale.x;
        this.sprite.scale.y = scale.y;
    }

    public SetRotation(r: number): void {
        this.sprite.rotation = r;
    }
}

@LinkToComponent(_SpriteRenderer)
export class SpriteRenderer extends AxolotComponent<_SpriteRenderer> {
    public Color(): string {
        return this.component.Color();
    }
    
    public Bound(): Bound {
        return this.component.Bound()
    }
    
    public Width(): number {
        return this.component.Width();
    }
    
    public Height(): number {
        return this.component.Height();
    }

    public SetColor(color: string): void {
        this.component.SetColor(color);
    }
}

@Component(ComponentName.RIGID_BODY_2D)
export class _RigidBody2D {
    public rigidBody: Body;
    public type: BodyType;
    public mass: number;
    public forceScale: number;

    public constructor(type: BodyType = BodyType.DYNAMIC, mass: number = 1, forceScale: number = 1) {
        this.forceScale = forceScale;
        this.mass = mass;
        this.type = type;
    }

    public Velocity(): Vector2 {
        return this.rigidBody.GetVelocity();
    }

    public Position(): Vector2 {
        return this.rigidBody.GetPosition()
    }

    public Rotation(): number {
        return this.rigidBody.GetRotation();
    }

    public ApplyImpulse(impulse: Vector2): void {
        this.rigidBody.ApplyImpuse({x: impulse.x * this.forceScale, y: impulse.y * this.forceScale});
    }

    public AddForce(force: Vector2): void {
        this.rigidBody.ApplyForce({x: force.x * this.forceScale, y: force.y * this.forceScale});
    }

    public SetPosition(position: Vector2): void {
        this.rigidBody.SetPosition({x: position.x * this.forceScale, y: position.y * this.forceScale});
    }

    public SetVelocity(velocity: Vector2): void {
        this.rigidBody.SetVelocity({x: velocity.x * this.forceScale, y: velocity.y * this.forceScale});
    }

    public SetRotation(rotation: number): void {
        this.rigidBody.SetRotation(rotation);
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

    public get rotation(): number {
        return this.component.Rotation();
    }

    public set rotation(rotation: number) {
        this.component.SetRotation(rotation);
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
    public collider: BoxCollider

    public Bound(): Bound {
        return new Bound(this.Width(), this.Height()); 
    }

    public Width(): number {
        return this.collider.GetWidth();
    }

    public Height(): number {
        return this.collider.GetHeight();
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