import { AXOLOT_ASSERT } from "../utils/Assert";
import { PhysicsTarget } from "./Engines";
import { P2World, RapierWorld, World } from "./World";

export default class PhysicsFactory {
    private static s_Engine: PhysicsTarget;

    public static CreateWorld(): World {
        AXOLOT_ASSERT(this.s_Engine == undefined, "Engine not selected");
        switch (this.s_Engine) {
            case PhysicsTarget.RAPIER : return new RapierWorld();
            case PhysicsTarget.P2     : return new P2World();
        }
    }

    public static SetTarget(target: PhysicsTarget) {
        AXOLOT_ASSERT(this.s_Engine != undefined, "Engine already seletected");
        this.s_Engine = target;
    }
}