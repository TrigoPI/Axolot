import * as p2 from "p2";
import RAPIER from "@dimforge/rapier2d";

import Random from "../math/Random";

export interface BoxCollider {
    GetId(): string;
    GetWidth(): number;
    GetHeight(): number;
}

export class RapierBoxCollider implements BoxCollider {
    private collider: RAPIER.Collider;
    private id: string;

    public constructor(collider: RAPIER.Collider) {
        this.collider = collider;
        this.id = Random.uuidv4();
    }

    public GetId(): string {
        return this.id;    
    }

    public GetWidth(): number {
        const shape: RAPIER.Cuboid = this.GetShape();
        return shape.halfExtents.x / 2; 
    }

    public GetHeight(): number {
        const shape: RAPIER.Cuboid = this.GetShape();
        return shape.halfExtents.y / 2;
    }

    private GetShape(): RAPIER.Cuboid {
        return <RAPIER.Cuboid>this.collider.shape
    }
}

export class P2BoxCollider implements BoxCollider {
    private collider: p2.Box;
    private id: string;

    public constructor(collider: p2.Box) {
        this.collider = collider;
        this.id = Random.uuidv4();
    }

    public GetId(): string {
        return this.id;    
    }

    public GetWidth(): number {
        return this.collider.width;
    }

    public GetHeight(): number {
        return this.collider.height;
    }
}