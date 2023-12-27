import { Prefab } from "../Asset";
import { ComponentClassObject } from "../ecs/Ecs-type";
import { Vec2, Vector2 } from "../math";
import Collision from "./Collision";
import GameObject from "./GameObject";

export default class ScriptObject {
    private static tag: number = 1;

    public readonly gameObject: GameObject;

    public OnCreate(): void {};
    public OnUpdate(dt: number): void {};
    public OnCollision(collsion: Collision): void {};
    
    public Instantiate(prefab: Prefab, position: Vector2 = new Vec2(0, 0), rotation: number = 0): GameObject { 
        return undefined;
    };

    public HasComponent<T>(a: ComponentClassObject<T>): boolean {
        return this.gameObject.HasComponent(a);
    }
    
    public GetComponent<T>(a: ComponentClassObject<T>): T {        
        return this.gameObject.GetComponent(a);
    };

}