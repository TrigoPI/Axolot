import { Clock, Collision, GameObject, Input, Key, Prefab, RigidBody2D, ScriptObject, SpriteRenderer, Transform, Vec2 } from "@axolot/engine";

export default class Test extends ScriptObject {
    public floor: GameObject;
    public prefab: Prefab;

    private clock: Clock;
    private canJump: boolean;

    private sprite: SpriteRenderer;
    private rb: RigidBody2D;
    private transform: Transform;

    public override OnCreate(): void {
        this.canJump = false;
        this.clock = new Clock();

        this.sprite = this.GetComponent(SpriteRenderer);
        this.transform = this.GetComponent(Transform);
        this.rb = this.GetComponent(RigidBody2D);

        this.sprite.SetColor("#fc9bc7");
    }

    public override OnUpdate(dt: number): void {
        if (Input.IsPressed(Key.BUTTON_0)) this.CreateBullet();
        if (Input.IsPressed(Key.SPACE)) this.Jump();
        
        if (Input.IsPressed(Key.D)) this.rb.ApplyImpulse(new Vec2( 10, 0));
        if (Input.IsPressed(Key.Q)) this.rb.ApplyImpulse(new Vec2(-10, 0));
    }

    public override OnCollision(collision: Collision): void {
        if (collision.name == "floor") this.canJump = true;
    }

    private CreateBullet(): void {
        if (this.clock.GetTimeSecond() > 0.2) {
            this.clock.Reset();

            const position: Vec2 = Vec2.Add(this.transform.position, new Vec2(0, -20));
            const bullet: GameObject = this.Instantiate(this.prefab, position);
            const rb: RigidBody2D = bullet.GetComponent(RigidBody2D);
            const direction: Vec2 = Vec2.Sub(Input.Mouse, position);
            
            direction.Normalize();
            direction.Mult(1000);

            rb.ApplyImpulse(direction);
        }
    }

    private Jump(): void {
        if (!this.canJump) return;
        this.rb.velocity = new Vec2(this.rb.velocity.x, 0);
        this.rb.ApplyImpulse(new Vec2(0, -200));
        this.canJump = false;
    }
}