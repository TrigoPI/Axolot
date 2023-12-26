import { Clock } from "../math";
import { WASM } from "../utils/Wasm";
import { Key } from "./Key";

import Input from "./Input";

export default class Application {
    private static created: boolean = false;

    private running: boolean;
    private loopTimeout: NodeJS.Timeout;
    private dtClock: Clock;

    public constructor() {
        this.running = true;
        this.dtClock = new Clock();
        this.loopTimeout = undefined;
    }

    public async OnStart(): Promise<void> {};
    public async OnRuntimeStart(): Promise<void> {};
    public async OnShutdown(): Promise<void> {};
    
    public OnRuntimeUpdate(dt: number): void {};
    public OnKeyDown(key: Key): void {};
    public OnKeyUp(key: Key): void {};
    public OnResize(w: number, h: number): void {};

    public Stop(): void {
        this.running = false;
    }

    private async Start(): Promise<void> {
        this.AddListeners();
        await WASM.Load();
    }

    private async ShutDown(): Promise<void> {
        clearInterval(this.loopTimeout);
    }

    private async Update(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.loopTimeout = setInterval(() => {
                const dt: number = this.dtClock.ResetSecond();

                if (!this.running) {
                    resolve();
                    return;
                } 
                
                this.OnRuntimeUpdate(dt);
            }, 1000 / 60);
        });
    }

    private AddListeners(): void {
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            const key: Key = (e.key != " ")? <Key>(e.key.toUpperCase()) : Key.SPACE;
            if (Input.Key[key] != undefined) Input.Key[key] = Input.State.PRESSED;
            this.OnKeyDown(key)
        });

        window.addEventListener('keyup', (e: KeyboardEvent) => {
            const key: Key = (e.key != " ")? <Key>(e.key.toUpperCase()) : Key.SPACE;
            if (Input.Key[key] != undefined) Input.Key[key] = Input.State.RELEASED;
            this.OnKeyUp(key);
        });

        window.addEventListener('resize', (e: UIEvent) => this.OnResize(window.innerWidth, window.innerHeight));
    }

    public static async CreateApplication(app: Application): Promise<void> {
        if (Application.created) throw new Error("Application already created");
        await app.Start();
        await app.OnStart();

        await app.OnRuntimeStart();
        await app.Update();

        await app.ShutDown();
        await app.OnShutdown();
    }
}