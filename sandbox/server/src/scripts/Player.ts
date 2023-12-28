import { RigidBody2D, ScriptObject } from "@axolot/server"

export default class Player extends ScriptObject {
    private rb: RigidBody2D;

    public override OnCreate(): void {
        console.log("Created");
        this.rb = this.GetComponent(RigidBody2D);
    }

    public override OnServerUpdate(): void {
        console.log(this.rb.velocity);
    }
}