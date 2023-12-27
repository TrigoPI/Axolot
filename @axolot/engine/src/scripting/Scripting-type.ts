import { Prefab } from "../Asset";
import { Entity } from "../ecs/Ecs-type";
import { Vector2 } from "../math";

export type Class<T> = { new(...args: any[]): T };
export type InstantiateHandler = (prefab: Prefab, position: Vector2, rotation: number) => Entity;