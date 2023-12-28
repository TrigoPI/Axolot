import * as p2 from "p2";
import { BoxCollider } from "./Collider";

export type CollisionHandler = (a: BoxCollider, b: BoxCollider) => void;
export type P2BeginContactEvent = {
    type: 'beginContact' | "postStep",
    bodyA: p2.Body;
    bodyB: p2.Body;
    shapeA: p2.Shape;
    shapeB: p2.Shape;
}