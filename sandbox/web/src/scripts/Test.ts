import { Collision, GameObject, Input, RigidBody2D, Vec2 } from "@axolot/engine";

export default class Test extends GameObject {
    private rb: RigidBody2D;
    private canJump: boolean;

    public override OnCreate(): void {
        this.canJump = true;
        this.rb = this.GetComponent(RigidBody2D);
    }

    public override OnUpdate(dt: number): void {
        if (Input.Key.SPACE == Input.State.PRESSED) this.Jump();
        if (Input.Key.D == Input.State.PRESSED) this.rb.ApplyImpulse(new Vec2( 10, 0));
        if (Input.Key.Q == Input.State.PRESSED) this.rb.ApplyImpulse(new Vec2(-10, 0));
    }

    public override OnCollision(collision: Collision): void {
        if (collision.name == "floor") this.canJump = true;
    }

    private Jump(): void {
        if (!this.canJump) return;
        this.rb.ApplyImpulse(new Vec2(0, -50));
        this.canJump = false;
    }
}