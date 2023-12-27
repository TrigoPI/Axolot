import { Vector2 } from "./Vector";

export default class Vec2 {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public Mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public Set(a: Vector2): void {
        this.x = a.x;
        this.y = a.y;
    }

    public Add(a: Vector2): void {
        this.x += a.x;
        this.y += a.y;
    }

    public Sub(a: Vector2): void {
        this.x -= a.x;
        this.y -= a.y;
    }

    public Mult(k: number): void {
        this.x *= k;
        this.y *= k;
    }

    public Normalize(): void {
        const mag: number = this.Mag();
        this.x /= mag;
        this.y /= mag;
    }

    public static Copy(a: Vector2): Vec2 {
        return new Vec2(a.x, a.y);
    }

    public static Add(a: Vector2, b: Vector2): Vec2 {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    public static Sub(a: Vector2, b: Vector2): Vec2 {
        return new Vec2(a.x - b.x, a.y - b.y);
    }

    public static Mult(a: Vector2, k: number): Vec2 {
        return new Vec2(a.x * k, a.y * k);
    }

    public static Normalize(a: Vector2): Vec2 {
        const mag: number = Vec2.Length(a);
        return new Vec2(a.x / mag, a.y / mag);
    }

    public static Length(a: Vector2): number {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }
}
