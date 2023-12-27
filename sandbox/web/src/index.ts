import { EntryPoint, Application, Scene, AxolotEntity, Transform, SpriteRenderer, Graphics, Script, RigidBody2D, BoxCollider2D, Prefab } from "@axolot/engine";
import Test from "./scripts/Test";

@EntryPoint
export default class SandboxWebApp extends Application {
    private scene: Scene;

    public override async OnStart(): Promise<void> {
        this.scene = new Scene();

        const prefab: Prefab = new Prefab("bullet");
        prefab.AddComponent(Transform, 0, 0, 0.5, 0.5);
        prefab.AddComponent(RigidBody2D);
        prefab.AddComponent(BoxCollider2D);
        prefab.AddComponent(SpriteRenderer, Graphics.Texture.White());

        const floor: AxolotEntity = this.scene.CreateEntity("floor");
        floor.AddComponent(Transform, 0, 500, 900, 1);
        floor.AddComponent(SpriteRenderer, Graphics.Texture.White());
        floor.AddComponent(BoxCollider2D);

        const player: AxolotEntity = this.scene.CreateEntity("player");
        player.AddComponent(Transform, 100, 100);
        player.AddComponent(SpriteRenderer, Graphics.Texture.White());
        player.AddComponent(RigidBody2D);
        player.AddComponent(BoxCollider2D);
        player.AddComponent(Script, Test, { floor, prefab });
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