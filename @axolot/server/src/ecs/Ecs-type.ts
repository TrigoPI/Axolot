import { TypedFastBitSet } from "typedfastbitset";

export type Entity = number;
export type ComponentType = number;
export type ComponentId = number;

export type ComponentClassObject<T> = { new(...args: any): T };
export type ComponentClassObjectTuple<T> = { [P in keyof T]: ComponentClassObject<T[P]> };
export type AddComponentListener = (entity: Entity, signature: TypedFastBitSet) => void;
export type DelComponentListener = (entity: Entity) => void;

export const NULL_ENTITY = -1