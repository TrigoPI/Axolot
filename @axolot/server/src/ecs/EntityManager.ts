import { TypedFastBitSet } from "typedfastbitset";
import SparseSet from "../arrays/SparseSet";

import { Entity } from "./Ecs-type";

export default class EntityManager {
    private entities: SparseSet<Entity, TypedFastBitSet>;

    public constructor() {
        this.entities = new SparseSet();
    }

    public CreateEntity(): Entity {
        const data: TypedFastBitSet = new TypedFastBitSet();
        return this.entities.Add(data);
    }

    public GetSignature(entity: Entity): TypedFastBitSet {
        const signature: TypedFastBitSet = this.entities.Get(entity);
        if (!signature) throw new Error("Cannot find entity : " + entity);
        return signature;
    }

    public RemoveEntity(entity: Entity): void {
        const data: TypedFastBitSet = this.entities.Get(entity);
        if (!data) throw new Error("Cannot find entity : " + entity);
        this.entities.Remove(entity);
    }
}
