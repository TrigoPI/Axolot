import { EntryPoint, Application, Scene, AxolotEntity, Transform, SpriteRenderer, Graphics, Script, RigidBody2D, BoxCollider2D, Key } from "@axolot/engine";
import Test from "./scripts/Test";

@EntryPoint
export default class SandboxWebApp extends Application {
    private scene: Scene;

    public override async OnStart(): Promise<void> {
        this.scene = new Scene();

        const player: AxolotEntity = this.scene.CreateEntity("player");
        player.AddComponent(Transform, 100, 100);
        player.AddComponent(SpriteRenderer, Graphics.Texture.Color("#ff0000"));
        player.AddComponent(RigidBody2D);
        player.AddComponent(BoxCollider2D);
        player.AddComponent(Script, Test);

        const floor: AxolotEntity = this.scene.CreateEntity("floor");
        floor.AddComponent(Transform, 0, 500, 900, 1);
        floor.AddComponent(SpriteRenderer, Graphics.Texture.White());
        floor.AddComponent(BoxCollider2D);
    }

    public override async OnRuntimeStart(): Promise<void> {
        this.scene.OnRuntimeStart();
    } 

    public override OnRuntimeUpdate(dt: number): void {
        this.scene.OnRuntimeUpdate(dt);
    }

    public override OnResize(width: number, height: number): void {
        this.scene.ResizeView(width, height);
    }
}